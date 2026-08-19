import { AXES, SPACING_PROPS, type Axis, type Box, type Violation } from './types';
import type { Config } from './config';

/**
 * PURE MODULE (§4). No `document`, no `window`, no DOM API calls — only numbers
 * off Box. This is what makes it unit-testable, and it is enforced by a test.
 */

/** 2 decimals, trailing zeros stripped. */
export function fmt(n: number): string {
  return String(Math.round(n * 100) / 100);
}

/**
 * §5.3 — sort ascending, sweep, break a group when the gap to the PREVIOUS
 * MEMBER exceeds tol. Comparing against the previous member (not the first
 * member of the group) lets a chain drift, which is intentional: a 1px drift
 * repeated six times is exactly the bug you want caught.
 */
export function cluster(values: number[], tol: number): number[][] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const out: number[][] = [];
  let cur = [sorted[0]!];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]! - cur[cur.length - 1]! <= tol) cur.push(sorted[i]!);
    else { out.push(cur); cur = [sorted[i]!]; }
  }
  out.push(cur);
  return out;
}

/** How far a value is from being a whole number — smaller is "rounder". */
function roundness(v: number): number {
  return Math.abs(v - Math.round(v));
}

/** Most frequent exact value; ties toward the rounder, then the smaller. */
function mode(values: number[]): number {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = values[0] ?? 0;
  let bestN = 0;
  for (const [v, n] of counts) {
    const better = n > bestN || (n === bestN && (roundness(v) < roundness(best) ||
      (roundness(v) === roundness(best) && v < best)));
    if (better) { best = v; bestN = n; }
  }
  return best;
}

/**
 * Modal value of a group, bucketed to `epsilon` precision. Ties break toward the
 * value held by the most boxes, then toward the rounder number (§5.3 step 5).
 */
function majorityOf(values: number[], epsilon: number): number {
  const buckets = new Map<number, number[]>();
  for (const v of values) {
    const key = Math.round(v / epsilon);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(v); else buckets.set(key, [v]);
  }
  let best: number[] = [];
  for (const bucket of buckets.values()) {
    if (bucket.length > best.length) best = bucket;
    else if (bucket.length === best.length && roundness(bucket[0]!) < roundness(best[0]!)) best = bucket;
  }
  return mode(best);
}

/** "5 at 24px, 1 at 25.5px" — descending by count. */
function tally(values: number[]): string {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([v, n]) => `${n} at ${fmt(v)}px`)
    .join(', ');
}

function distinct(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

/** Split boxes into the same groups `cluster()` produced for their values. */
function groupByValue(boxes: Box[], axis: Axis, tol: number): { v: number; box: Box }[][] {
  const pairs = boxes.map((box) => ({ v: box[axis], box })).sort((a, b) => a.v - b.v);
  const groups = cluster(pairs.map((p) => p.v), tol);
  const out: { v: number; box: Box }[][] = [];
  let i = 0;
  for (const g of groups) { out.push(pairs.slice(i, i + g.length)); i += g.length; }
  return out;
}

/**
 * A wrapper and the child it hugs share an edge by construction, so counting
 * both inflates every cluster and produces reports no one can act on. Keep the
 * ancestor, drop any descendant of a box already in the same cluster.
 */
function dropNestedPairs(group: { v: number; box: Box }[], byKey: Map<number, Box>) {
  const present = new Set(group.map((p) => p.box.key));
  return group.filter((p) => {
    let parent = byKey.get(p.box.parentKey);
    while (parent) {
      if (present.has(parent.key)) return false;
      parent = byKey.get(parent.parentKey);
    }
    return true;
  });
}

export function auditAlignment(boxes: Box[], cfg: Config): Violation[] {
  const out: Violation[] = [];
  const byKey = new Map(boxes.map((b) => [b.key, b]));
  for (const axis of AXES) {
    for (const raw of groupByValue(boxes, axis, cfg.tol)) {
      if (raw.length < cfg.minCluster) continue;
      const group = dropNestedPairs(raw, byKey);
      if (group.length < cfg.minCluster) continue;                       // step 3
      const values = group.map((p) => p.v);
      const spread = values[values.length - 1]! - values[0]!;
      if (spread <= cfg.epsilon) continue;                               // step 4
      const majority = majorityOf(values, cfg.epsilon);                  // step 5
      const offenders = group.filter((p) => Math.abs(p.v - majority) > cfg.epsilon);
      if (offenders.length === 0) continue;                              // step 6
      out.push({
        kind: 'align',
        axis,
        values: distinct(values),
        majority,
        spread,
        boxes: offenders.map((p) => p.box),
        all: group.map((p) => p.box),
        message: `${axis} · ${group.length} elements · ${tally(values)}`,
      });
    }
  }
  return dedupeAxes(out).sort((a, b) => b.spread - a.spread);            // worst first
}

/**
 * Six cards misaligned on `left` are also misaligned on `right` and `centerX` —
 * one bug, three rows. Where the offenders and the spread are identical, report
 * the first axis and name the others, rather than tripling the list.
 */
function dedupeAxes(violations: Violation[]): Violation[] {
  const seen = new Map<string, { v: Violation; axes: Axis[] }>();
  for (const v of violations) {
    const sig = `${v.spread.toFixed(4)}|${v.all.length}|` +
      v.boxes.map((b) => b.key).sort((a, b) => a - b).join(',');
    const hit = seen.get(sig);
    if (hit) hit.axes.push(v.axis!);
    else seen.set(sig, { v, axes: [v.axis!] });
  }
  return [...seen.values()].map(({ v, axes }) =>
    axes.length === 1 ? v : { ...v, message: v.message.replace(v.axis!, axes.join('/')) });
}

const EDGES = ['left', 'top', 'right', 'bottom'] as const;

/**
 * How far off a device pixel a coordinate must sit to count as subpixel.
 *
 * §5.3 words this as `frac > epsilon && frac < 1 - epsilon`, but with the
 * default epsilon of 0.5 that range is empty — the exact half-pixels this check
 * exists to catch would never be reported. epsilon answers "are these the same
 * value?", which is a different question, so this check gets its own threshold.
 */
const SUBPIXEL_TOL = 0.1;

/** Same reasoning as the scale-lint cap (§5.4): a flood drowns the real list. */
const SUBPIXEL_CAP = 20;

/**
 * §5.3 — fractional coordinates. On a 2x display a 0.5px offset renders cleanly
 * and is not a defect, so the check runs in device pixels. Without this the tool
 * flags hundreds of legitimate half-pixels on a Retina display.
 */
export function auditSubpixel(boxes: Box[], _cfg: Config, dpr = 1): Violation[] {
  const out: Violation[] = [];
  const byKey = new Map(boxes.map((b) => [b.key, b]));
  const frac = (v: number) => ((v * dpr) % 1 + 1) % 1;
  const off = (v: number) => frac(v) > SUBPIXEL_TOL && frac(v) < 1 - SUBPIXEL_TOL;

  for (const box of boxes) {
    if (out.length >= SUBPIXEL_CAP) break;
    const parent = byKey.get(box.parentKey);
    const bad: string[] = [];
    const values: number[] = [];
    for (const edge of EDGES) {
      const v = box[edge];
      if (!off(v)) continue;
      // A child sitting on the same fraction as its parent has inherited the
      // offset, not caused it. Report the element that introduced it; fixing
      // that one moves the whole subtree back onto the grid.
      if (parent && Math.abs(frac(parent[edge]) - frac(v)) < 1e-6) continue;
      bad.push(`${edge} ${fmt(v)}px`);
      values.push(v);
    }
    if (bad.length === 0) continue;
    out.push({
      kind: 'subpixel',
      values: distinct(values),
      majority: Math.round(values[0]! * dpr) / dpr,
      spread: 0,
      boxes: [box],
      all: [box],
      message: `subpixel · ${box.label} · ${bad.join(', ')}`,
    });
  }
  return out;
}

function kebab(prop: string): string {
  return prop.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
}

/** §5.4 — two checks, both derived from the boxes already collected. */
export function auditSpacing(boxes: Box[], cfg: Config): Violation[] {
  const out: Violation[] = [];

  // ── Gap consistency ───────────────────────────────────────────────────────
  const families = new Map<number, Box[]>();
  for (const box of boxes) {
    if (box.parentKey < 0) continue;
    const f = families.get(box.parentKey);
    if (f) f.push(box); else families.set(box.parentKey, [box]);
  }

  for (const children of families.values()) {
    if (children.length < 3) continue;
    for (const dir of ['x', 'y'] as const) {
      const sorted = [...children].sort((a, b) =>
        dir === 'x' ? a.left - b.left : a.top - b.top);
      const gaps: number[] = [];
      const pairs: Box[][] = [];
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1]!, cur = sorted[i]!;
        gaps.push(dir === 'x' ? cur.left - prev.right : cur.top - prev.bottom);
        pairs.push([prev, cur]);
      }
      // Only a genuine row/column has non-negative gaps throughout; stacked or
      // overlapping children are not a gutter and would report nonsense.
      if (gaps.some((g) => g < 0)) continue;
      for (const group of cluster(gaps, cfg.tol)) {
        if (group.length < 2) continue;
        const spread = group[group.length - 1]! - group[0]!;
        if (spread <= cfg.epsilon) continue;
        const majority = majorityOf(group, cfg.epsilon);
        const offenders = gaps
          .map((g, i) => ({ g, i }))
          .filter(({ g }) => group.includes(g) && Math.abs(g - majority) > cfg.epsilon);
        if (offenders.length === 0) continue;
        out.push({
          kind: 'spacing',
          values: distinct(group),
          majority,
          spread,
          boxes: offenders.flatMap(({ i }) => pairs[i]!),
          all: sorted,
          message: `gap-${dir} · ${sorted.length} items · ${group.map(fmt).join(', ')}px`,
        });
      }
    }
  }

  // ── Scale adherence, capped at 20 so it cannot drown the alignment results ─
  const scaleOut: Violation[] = [];
  for (const box of boxes) {
    if (scaleOut.length >= 20) break;
    const bad: string[] = [];
    const values: number[] = [];
    box.spacing.forEach((v, i) => {
      if (v === 0) return;
      // getComputedStyle reports the USED value, so `margin: auto` arrives as
      // something like 333.141px. Nobody authors a fractional spacing token, so
      // a fractional value is a computed result, not a scale violation.
      if (!Number.isInteger(v)) return;
      if (cfg.scale.some((s) => Math.abs(s - v) <= cfg.epsilon)) return;
      bad.push(`${kebab(SPACING_PROPS[i]!)} ${fmt(v)}px`);
      values.push(v);
    });
    if (bad.length === 0) continue;
    scaleOut.push({
      kind: 'spacing',
      values: distinct(values),
      majority: 0,
      spread: 0,
      boxes: [box],
      all: [box],
      message: `scale · ${box.label} · ${bad.join(', ')}`,
    });
  }

  return [...out.sort((a, b) => b.spread - a.spread), ...scaleOut];
}

/** Alignment violations are always listed first (§5.4). */
export function audit(boxes: Box[], cfg: Config, dpr = 1): Violation[] {
  return [
    ...auditAlignment(boxes, cfg),
    ...auditSpacing(boxes, cfg),
    ...auditSubpixel(boxes, cfg, dpr),
  ];
}
