import { skipSelector, type Config } from './config';
import type { Bands, Box, Guide, Quad, Segment } from './types';

/**
 * Measurement. Everything that reads geometry lives here; the arithmetic is
 * pure so it can be unit-tested without a DOM.
 */

/** 2 decimals, trailing zeros stripped. */
export function fmt(n: number): string {
  return String(Math.round(n * 100) / 100);
}

function label(el: Element): string {
  let s = el.tagName.toLowerCase();
  if (el.id) s += `#${el.id}`;
  const cls = el.classList[0];
  if (cls) s += `.${cls}`;
  return s.length > 32 ? s.slice(0, 31) + '…' : s;
}

/** Measure an element right now — nothing is cached, so nothing goes stale. */
export function boxOf(el: Element): Box {
  const r = el.getBoundingClientRect();
  return {
    el,
    label: label(el),
    left: r.left, right: r.right, top: r.top, bottom: r.bottom,
    width: r.width, height: r.height,
  };
}

/** Up through the tree, crossing out of a shadow root via its host. */
function up(el: Element): Element | null {
  if (el.parentElement) return el.parentElement;
  const root = el.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

/**
 * What's under the cursor, skipping our own overlay and anything the user has
 * opted out. An ignored hit walks up rather than returning nothing.
 *
 * `document.elementFromPoint` stops at a shadow host, so a web component would
 * otherwise only ever measure as one opaque box — no good on a page built from
 * Lit or Shoelace components. Descending through open roots measures the real
 * element instead. Closed roots stay closed, including our own overlay.
 */
export function hitTest(x: number, y: number, cfg: Config): Box | null {
  const skip = skipSelector(cfg);
  let el = document.elementFromPoint(x, y);

  while (el?.shadowRoot) {
    const inner = el.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === el) break;
    el = inner;
  }

  while (el && el.matches(skip)) el = up(el);
  return el && el !== document.documentElement ? boxOf(el) : null;
}

const px = (v: string) => parseFloat(v) || 0;

export function bandsOf(el: Element): Bands {
  const cs = getComputedStyle(el);
  const quad = (a: string, b: string, c: string, d: string): Quad =>
    [px(a), px(b), px(c), px(d)];
  return {
    padding: quad(cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft),
    border: quad(cs.borderTopWidth, cs.borderRightWidth,
                 cs.borderBottomWidth, cs.borderLeftWidth),
    margin: quad(cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft),
  };
}

/** Which of two overlapping boxes is the container? The larger one. Pure. */
function outerOf(a: Box, b: Box): [Box, Box] {
  return a.width * a.height >= b.width * b.height ? [a, b] : [b, a];
}

/**
 * The four edge-to-edge distances between a box and the one around it.
 *
 * Overlapping boxes have no gap, but every edge still has a well-defined
 * distance, and that is the number you want: how much room is around this
 * thing inside that one. Positive is room inside; negative means the inner box
 * spills past that edge, which is usually the most interesting number on the
 * screen. Zeros are kept — flush against an edge is information too. Pure.
 */
export function insetSegments(outer: Box, inner: Box): Segment[] {
  const cx = inner.left + inner.width / 2;
  const cy = inner.top + inner.height / 2;
  return [
    { x1: outer.left, y1: cy, x2: inner.left, y2: cy,
      label: fmt(inner.left - outer.left), axis: 'x' },
    { x1: inner.right, y1: cy, x2: outer.right, y2: cy,
      label: fmt(outer.right - inner.right), axis: 'x' },
    { x1: cx, y1: outer.top, x2: cx, y2: inner.top,
      label: fmt(inner.top - outer.top), axis: 'y' },
    { x1: cx, y1: inner.bottom, x2: cx, y2: outer.bottom,
      label: fmt(outer.bottom - inner.bottom), axis: 'y' },
  ];
}

/**
 * Shortest edge-to-edge distance between two boxes, as drawable segments.
 *
 * Overlapping on an axis means the gap on that axis is zero and no line is
 * drawn for it; boxes diagonal to each other get both, L-shaped. One box
 * inside another has no gap at all, so it reports insets instead. Pure.
 */
export function gapSegments(a: Box, b: Box): Segment[] {
  const out: Segment[] = [];
  const overlapX = a.left < b.right && b.left < a.right;
  const overlapY = a.top < b.bottom && b.top < a.bottom;

  if (overlapX && overlapY) {
    // Enclosure is not required. Each edge has an honest distance whether the
    // inner box sits inside it or spills past it, and refusing to draw three
    // good numbers because a fourth is negative hides the overflow that is
    // usually the thing worth knowing about.
    const [outer, inner] = outerOf(a, b);
    return insetSegments(outer, inner);
  }

  if (!overlapX) {
    const [l, r] = a.right <= b.left ? [a, b] : [b, a];
    // Run the line through a row both boxes share where there is one, so it
    // reads as the gap between them rather than a line floating in space.
    const y = overlapY
      ? (Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2
      : (a.top + a.height / 2 + b.top + b.height / 2) / 2;
    out.push({ x1: l.right, y1: y, x2: r.left, y2: y,
               label: `${fmt(r.left - l.right)}`, axis: 'x' });
  }
  if (!overlapY) {
    const [t, btm] = a.bottom <= b.top ? [a, b] : [b, a];
    const x = overlapX
      ? (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2
      : (a.left + a.width / 2 + b.left + b.width / 2) / 2;
    out.push({ x1: x, y1: t.bottom, x2: x, y2: btm.top,
               label: `${fmt(btm.top - t.bottom)}`, axis: 'y' });
  }
  return out;
}

/**
 * Order a set of boxes along whichever axis they actually vary on, so a row
 * reads left-to-right and a column top-to-bottom without being told which.
 * Pure.
 */
export function chain(boxes: Box[]): Box[] {
  if (boxes.length < 2) return [...boxes];
  const spread = (get: (b: Box) => number) => {
    const vs = boxes.map(get);
    return Math.max(...vs) - Math.min(...vs);
  };
  const horizontal = spread((b) => b.left + b.width / 2) >=
                     spread((b) => b.top + b.height / 2);
  return [...boxes].sort((a, b) => horizontal ? a.left - b.left : a.top - b.top);
}

/**
 * The gaps between each adjacent pair in a locked set — five tags in a row give
 * the four gutters between them, which is the whole point of locking more than
 * one. Pure.
 */
export function chainSegments(boxes: Box[]): Segment[] {
  const ordered = chain(boxes);
  const out: Segment[] = [];
  for (let i = 1; i < ordered.length; i++) {
    out.push(...gapSegments(ordered[i - 1]!, ordered[i]!));
  }
  return out;
}

// ── Guides ──────────────────────────────────────────────────────────────────

/** How near the cursor has to be to pick a guide up, in px. */
export const GRAB = 5;
/** How near an edge a guide has to be to snap onto it, in px. */
export const SNAP = 4;

/** Viewport position of a guide — page coordinates minus the scroll. */
export function guideAt(g: Guide): number {
  return g.axis === 'x' ? g.at - scrollX : g.at - scrollY;
}

/** The guide under the cursor, if any. Nearest wins when two overlap. */
export function guideUnder(guides: Guide[], x: number, y: number): Guide | null {
  let best: Guide | null = null;
  let bestGap = GRAB;
  for (const g of guides) {
    const gap = Math.abs(guideAt(g) - (g.axis === 'x' ? x : y));
    if (gap <= bestGap) { best = g; bestGap = gap; }
  }
  return best;
}

/**
 * Pull a guide onto a nearby edge. A guide meant to sit on a card's edge has to
 * sit *on* it — a pixel off is a guide that quietly lies to you. Pure.
 */
export function snapTo(value: number, edges: number[], free: boolean): number {
  if (free) return value;
  let best = value;
  let bestGap = SNAP;
  for (const e of edges) {
    const gap = Math.abs(e - value);
    if (gap < bestGap) { best = e; bestGap = gap; }
  }
  return best;
}

/** The edges a guide on this axis could snap to, from the box under the cursor. */
export function snapEdges(box: Box | null, axis: 'x' | 'y'): number[] {
  if (!box) return [];
  return axis === 'x' ? [box.left, box.right] : [box.top, box.bottom];
}

/**
 * The gap between a box and the nearest guide on each axis, as drawable
 * segments. A guide passing through the box reports nothing — there is no gap.
 * Pure: guide positions come in already converted to viewport space.
 */
export function guideSegments(box: Box, at: { axis: 'x' | 'y'; pos: number }[]): Segment[] {
  const out: Segment[] = [];
  for (const axis of ['x', 'y'] as const) {
    const near = at
      .filter((g) => g.axis === axis)
      .map((g) => ({
        pos: g.pos,
        gap: axis === 'x'
          ? (g.pos < box.left ? box.left - g.pos : g.pos > box.right ? g.pos - box.right : -1)
          : (g.pos < box.top ? box.top - g.pos : g.pos > box.bottom ? g.pos - box.bottom : -1),
      }))
      .filter((g) => g.gap >= 0)
      .sort((a, b) => a.gap - b.gap)[0];
    if (!near) continue;

    if (axis === 'x') {
      const y = box.top + box.height / 2;
      const from = near.pos < box.left ? near.pos : box.right;
      const to = near.pos < box.left ? box.left : near.pos;
      out.push({ x1: from, y1: y, x2: to, y2: y, label: fmt(near.gap), axis: 'x' });
    } else {
      const x = box.left + box.width / 2;
      const from = near.pos < box.top ? near.pos : box.bottom;
      const to = near.pos < box.top ? box.top : near.pos;
      out.push({ x1: x, y1: from, x2: x, y2: to, label: fmt(near.gap), axis: 'y' });
    }
  }
  return out;
}

// ── Scale ───────────────────────────────────────────────────────────────────

export interface Scale { x: number; y: number }

/**
 * Scale factors out of a computed `transform` string. Pure.
 *
 * Taken from the matrix rather than from rect-over-offsetWidth: offsetWidth is
 * rounded to whole pixels, so that ratio invents a scale of 1.0011 on an
 * unscaled 237.26px element. The matrix is exact and says 1 when it means 1.
 */
export function scaleFromTransform(t: string): Scale {
  const m = /matrix(3d)?\(([^)]+)\)/.exec(t || '');
  if (!m) return { x: 1, y: 1 };
  const v = m[2]!.split(',').map((n) => parseFloat(n));
  // matrix(a,b,c,d,..) and matrix3d(m11,m12,..,m21,m22,..) hold the 2D terms
  // in different slots. hypot rather than the raw term, so a rotation does not
  // read as a squash.
  const [a, b, c, d] = m[1]
    ? [v[0], v[1], v[4], v[5]]
    : [v[0], v[1], v[2], v[3]];
  return {
    x: Math.hypot(a ?? 1, b ?? 0) || 1,
    y: Math.hypot(c ?? 0, d ?? 1) || 1,
  };
}

/** Every scale between an element and the document, multiplied together. */
export function scaleOf(el: Element): Scale {
  let x = 1, y = 1;
  for (let n: Element | null = el; n; n = up(n)) {
    const s = scaleFromTransform(getComputedStyle(n).transform);
    x *= s.x;
    y *= s.y;
  }
  return { x, y };
}
