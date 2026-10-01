/**
 * The spacing lint: every gap and every padding on screen, checked against
 * your scale, and the ones that miss named with the token that would fix them.
 *
 * inspectkit showed the shape of this — shade what is on the scale, call out
 * what is not, count the problems — but it can only check against a multiple
 * of eight, so its fix reads "14 → 16". This reads the design tokens the page
 * actually defines, so the fix reads "14 → --space-4": the token to write, not
 * a number to hardcode. A number that happens to match is still drift.
 *
 * Everything in this file is pure. The DOM walk that feeds it lives with the
 * caller, so the judgement calls — what counts as spacing, what the nearest
 * fix is — are tested without a browser.
 */

import type { Rect } from './notes';
import type { Quad } from './types';

export interface ScaleToken { name: string; value: string; px: number }

export interface Scale {
  /** On-scale values in px, ascending. */
  values: number[];
  /** The token holding each value, when the scale came from tokens. */
  tokens: Map<number, string>;
  /** Where the scale came from, so the readout can say. */
  source: 'tokens' | 'base';
}

export interface LintOptions {
  /** Fallback when the page defines no spacing tokens: multiples of this. */
  base: number;
  /** Extra values that are fine in the fallback scale. */
  allow: number[];
  /** Anything wider is layout, not spacing, and is left alone. */
  max: number;
}

export const LINT_DEFAULTS: LintOptions = { base: 4, allow: [], max: 128 };

/**
 * Names that are spacing, and names that merely hold a spacing-shaped number.
 * Judged by the name's segments, not substrings: "line" must reject
 * --line-height and still accept --space-inline-sm.
 */
const SPACING_SEG = new Set(['space', 'spacing', 'gap', 'gutter', 'inset', 'pad', 'padding', 'margin', 'stack', 'offset']);
const NOT_SEG = new Set(['radius', 'rounded', 'font', 'text', 'leading', 'line', 'tracking', 'letter', 'border',
  'stroke', 'shadow', 'blur', 'z', 'zindex', 'opacity', 'duration', 'delay', 'ease', 'breakpoint', 'screen',
  'container', 'width', 'height', 'icon', 'avatar', 'max', 'min', 'w', 'h']);

function isSpacingName(name: string): boolean {
  const segs = name.replace(/^--/, '').toLowerCase().split(/[-_]/);
  if (segs.some((s) => NOT_SEG.has(s))) return false;
  if (segs.some((s) => SPACING_SEG.has(s))) return true;
  // Open Props and similar: --size-1 … --size-15, --s-2.
  return /^--(size|s)-?\d/i.test(name);
}

/**
 * The spacing scale the page defines, or a numeric one when it defines none.
 *
 * A token counts when its name says spacing and its value is a length. Names
 * decide, not values: `--radius-md: 8px` holds a spacing-shaped number and is
 * not spacing. Three distinct values are needed before it is trusted as a
 * scale; one stray `--gap: 12px` is a token, not a system.
 */
export function scaleFrom(tokens: readonly ScaleToken[], options: LintOptions = LINT_DEFAULTS, rootFontPx = 16): Scale {
  const toPx = (value: string): number | null => {
    const v = value.trim();
    if (/^-?\d*\.?\d+px$/.test(v)) return parseFloat(v);
    if (/^-?\d*\.?\d+rem$/.test(v)) return parseFloat(v) * rootFontPx;
    return null;
  };

  /*
   * Tailwind v4 defines one unit, --spacing (0.25rem), and multiplies it in
   * every utility. There is no list to read, but there is a base, and it is
   * the right base rather than a guessed one.
   */
  let base = options.base;
  const unit = tokens.find((t) => t.name === '--spacing');
  const unitPx = unit ? toPx(unit.value) : null;
  if (unitPx && unitPx > 0 && unitPx <= 16) base = unitPx;

  const candidates = new Map<number, string[]>();
  for (const t of tokens) {
    if (t.name === '--spacing' || !isSpacingName(t.name)) continue;
    let px = toPx(t.value);
    if (px === null || !(px > 0) || px > 512) continue;
    px = Math.round(px * 100) / 100;
    candidates.set(px, [...(candidates.get(px) ?? []), t.name]);
  }

  /*
   * Two tokens for one value: the one from the scale wins over an alias.
   * --space-4 and --gap-md both hold 16px, and the fix for a 14px gap is the
   * scale step, so the family with the most members is taken to be the scale.
   * Shorter name, then alphabetical, only break what is left — so the answer
   * is the same on every run.
   */
  const family = (name: string) => name.replace(/[-_][^-_]*$/, '');
  const familySize = new Map<string, number>();
  for (const names of candidates.values()) {
    for (const n of names) familySize.set(family(n), (familySize.get(family(n)) ?? 0) + 1);
  }
  const byValue = new Map<number, string>();
  for (const [px, names] of candidates) {
    const best = [...names].sort((a, b) =>
      (familySize.get(family(b))! - familySize.get(family(a))!)
      || a.length - b.length
      || (a < b ? -1 : 1))[0]!;
    byValue.set(px, best);
  }
  if (byValue.size >= 3) {
    return { values: [...byValue.keys()].sort((a, b) => a - b), tokens: byValue, source: 'tokens' };
  }
  const values = new Set<number>(options.allow.filter((v) => v > 0));
  for (let v = base; v <= Math.max(options.max, base); v += base) values.add(Math.round(v * 100) / 100);
  return { values: [...values].sort((a, b) => a - b), tokens: new Map(), source: 'base' };
}

export interface Verdict {
  ok: boolean;
  /** Nearest on-scale value, when not ok. */
  suggestion?: number;
  /** The token holding that value, when the scale has one. */
  token?: string;
}

/**
 * Is this value on the scale, and if not, what is the nearest that is?
 *
 * Fractional values are never on the scale: 15.5 is a layout accident, not a
 * spacing decision, however close it is. Ties go to the larger value, which is
 * the conventional reading of a spacing scale and what inspectkit chose too.
 */
export function check(value: number, scale: Scale): Verdict {
  const whole = Math.abs(value - Math.round(value)) < 0.25;
  if (whole && scale.values.some((v) => Math.abs(v - value) < 0.25)) return { ok: true };
  let best = scale.values[0] ?? Math.round(value);
  for (const v of scale.values) {
    const d = Math.abs(v - value);
    const bd = Math.abs(best - value);
    if (d < bd || (d === bd && v > best)) best = v;
  }
  const verdict: Verdict = { ok: false, suggestion: best };
  const token = scale.tokens.get(best);
  if (token) verdict.token = token;
  return verdict;
}

/** One container, as the DOM walk measured it. */
export interface LintBox {
  rect: Rect;
  padding: Quad;
  border: Quad;
  /** justify-content and align-content: space-* distributes, nobody chose it. */
  justify: string;
  align: string;
  /** In-flow children, in document order. */
  children: Rect[];
}

export interface Band {
  rect: Rect;
  value: number;
  axis: 'x' | 'y';
  kind: 'gap' | 'padding';
  ok: boolean;
  suggestion?: number;
  token?: string;
}

export interface LintResult {
  bands: Band[];
  issues: number;
  scale: Scale;
}

/** Below this is a sliver or an overlap, not spacing. */
const MIN = 0.5;

const overlapX = (a: Rect, b: Rect) => a.x < b.x + b.w - MIN && b.x < a.x + a.w - MIN;
const overlapY = (a: Rect, b: Rect) => a.y < b.y + b.h - MIN && b.y < a.y + a.h - MIN;

export function analyze(boxes: readonly LintBox[], scale: Scale, options: LintOptions = LINT_DEFAULTS): LintResult {
  const bands: Band[] = [];
  const add = (rect: Rect, value: number, axis: Band['axis'], kind: Band['kind']) => {
    if (!(value >= MIN) || value > options.max) return;
    const v = check(value, scale);
    const band: Band = { rect, value: Math.round(value * 10) / 10, axis, kind, ok: v.ok };
    if (v.suggestion !== undefined) band.suggestion = v.suggestion;
    if (v.token) band.token = v.token;
    bands.push(band);
  };

  for (const box of boxes) {
    const [pt, pr, pb, pl] = box.padding;
    const [bt, br, bb, bl] = box.border;
    // Padding is read from CSS, not measured edge to content: auto margins and
    // centring would otherwise masquerade as padding nobody set.
    const inner = {
      x: box.rect.x + bl, y: box.rect.y + bt,
      w: box.rect.w - bl - br, h: box.rect.h - bt - bb,
    };
    if (inner.w > 0 && inner.h > 0) {
      add({ x: inner.x, y: inner.y, w: pl, h: inner.h }, pl, 'x', 'padding');
      add({ x: inner.x + inner.w - pr, y: inner.y, w: pr, h: inner.h }, pr, 'x', 'padding');
      add({ x: inner.x, y: inner.y, w: inner.w, h: pt }, pt, 'y', 'padding');
      add({ x: inner.x, y: inner.y + inner.h - pb, w: inner.w, h: pb }, pb, 'y', 'padding');
    }

    if (box.children.length < 2) continue;
    if (/space-/.test(box.justify) || /space-/.test(box.align)) continue;

    for (let i = 1; i < box.children.length; i++) {
      const a = box.children[i - 1]!;
      const b = box.children[i]!;
      // Beside: b starts at or after a's right edge, sharing a row.
      if (b.x >= a.x + a.w - MIN && overlapY(a, b)) {
        const gap = b.x - (a.x + a.w);
        const top = Math.max(a.y, b.y);
        const bottom = Math.min(a.y + a.h, b.y + b.h);
        add({ x: a.x + a.w, y: top, w: gap, h: bottom - top }, gap, 'x', 'gap');
      } else if (b.y >= a.y + a.h - MIN && overlapX(a, b)) {
        const gap = b.y - (a.y + a.h);
        const left = Math.max(a.x, b.x);
        const right = Math.min(a.x + a.w, b.x + b.w);
        add({ x: left, y: a.y + a.h, w: right - left, h: gap }, gap, 'y', 'gap');
      }
      // Anything else — a wrapped line, a diagonal, an overlap — has no single
      // gap that someone set, and guessing one would flag noise.
    }
  }

  return { bands, issues: bands.filter((b) => !b.ok).length, scale };
}

/** What an off-scale band says: "14 → --space-4", or "14 → 16" with no token. */
export function bandLabel(band: Band): string {
  const v = String(band.value);
  if (band.ok || band.suggestion === undefined) return v;
  return `${v} → ${band.token ?? band.suggestion}`;
}
