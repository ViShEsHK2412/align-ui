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
/**
 * The stub joining one box's edge to a measurement line that runs past it.
 *
 * A gap between two boxes that share no row is drawn between them, level with
 * neither — so without this the line floats in space beside both things it
 * claims to measure. Returns nothing when the line already crosses the box.
 */
function extension(
  at: number, spanFrom: number, spanTo: number, level: number, axis: 'x' | 'y',
): Segment[] {
  const from = level < spanFrom ? spanFrom : level > spanTo ? spanTo : null;
  if (from === null) return [];
  return [axis === 'x'
    ? { x1: at, y1: from, x2: at, y2: level, label: '', axis: 'y', extension: true }
    : { x1: from, y1: at, x2: level, y2: at, label: '', axis: 'x', extension: true }];
}

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
    out.push(...extension(l.right, l.top, l.bottom, y, 'x'));
    out.push(...extension(r.left, r.top, r.bottom, y, 'x'));
  }
  if (!overlapY) {
    const [t, btm] = a.bottom <= b.top ? [a, b] : [b, a];
    const x = overlapX
      ? (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2
      : (a.left + a.width / 2 + b.left + b.width / 2) / 2;
    out.push({ x1: x, y1: t.bottom, x2: x, y2: btm.top,
               label: `${fmt(btm.top - t.bottom)}`, axis: 'y' });
    out.push(...extension(t.bottom, t.left, t.right, x, 'y'));
    out.push(...extension(btm.top, btm.left, btm.right, x, 'y'));
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
export function chainPairs(boxes: Box[]): [Box, Box][] {
  const ordered = chain(boxes);
  const out: [Box, Box][] = [];
  for (let i = 1; i < ordered.length; i++) out.push([ordered[i - 1]!, ordered[i]!]);
  return out;
}

// ── Guides ──────────────────────────────────────────────────────────────────

/** How near the cursor has to be to pick a guide up, in px. */
export const GRAB = 5;
/**
 * How near a candidate a guide has to be to snap onto it, in px.
 *
 * Eight is the field consensus, not a guess: tldraw ships
 * `snapThreshold: 8` and Excalidraw `SNAP_DISTANCE = 8`, both applied as
 * `8 / zoom` so the tolerance stays constant on screen; Penpot is the
 * outlier at 10. Four was ours, and it made snapping feel like it was not
 * working — you had to be almost exactly on the edge already.
 *
 * The `/ zoom` half of that formula waits for there to be a zoom.
 */
export const SNAP = 8;

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
 * Somewhere a guide could usefully land, and what to call it.
 *
 * `rank` breaks ties at equal distance: an edge is a more meaningful place to
 * put a guide than a centre, and a centre more than another guide, so a guide
 * dropped exactly between two candidates takes the one that means more.
 */
export interface SnapCandidate {
  at: number;
  what: string;
  rank: number;
}

/** Where a guide ended up, and what it caught — `what` is '' if it caught nothing. */
export interface Snapped {
  at: number;
  what: string;
}

/**
 * Pull a guide onto a nearby candidate. A guide meant to sit on a card's edge
 * has to sit *on* it — a pixel off is a guide that quietly lies to you.
 *
 * It also has to *say* what it caught. Without that a snapped guide and a guide
 * that missed by a pixel look identical, which is the exact failure snapping
 * exists to prevent. Pure.
 */
export function snapTo(value: number, candidates: SnapCandidate[], free: boolean): Snapped {
  if (free) return { at: value, what: '' };
  let best: SnapCandidate | null = null;
  let bestGap = SNAP;
  for (const c of candidates) {
    const gap = Math.abs(c.at - value);
    if (gap > bestGap) continue;
    // Strictly nearer wins; equally near is settled by rank.
    if (gap < bestGap - 0.001 || (best !== null && c.rank < best.rank)) {
      best = c;
      bestGap = gap;
    }
  }
  return best ? { at: best.at, what: best.what } : { at: value, what: '' };
}

/**
 * Everywhere a guide on this axis could land: the edges and centre of the box
 * under the cursor, and every other guide already placed.
 *
 * Other guides matter because lining one guide up with another is how you check
 * that two things across the page share an edge.
 */
export function snapCandidates(
  box: Box | null,
  axis: 'x' | 'y',
  others: { axis: 'x' | 'y'; at: number }[] = [],
): SnapCandidate[] {
  const out: SnapCandidate[] = [];

  if (box) {
    const near = axis === 'x' ? box.left : box.top;
    const far = axis === 'x' ? box.right : box.bottom;
    out.push({ at: near, what: `${box.label} ${axis === 'x' ? 'left' : 'top'}`, rank: 0 });
    out.push({ at: far, what: `${box.label} ${axis === 'x' ? 'right' : 'bottom'}`, rank: 0 });
    out.push({ at: (near + far) / 2, what: `${box.label} centre`, rank: 1 });
  }

  for (const g of others) {
    if (g.axis === axis) out.push({ at: g.at, what: 'guide', rank: 2 });
  }

  return out;
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

/**
 * The gaps between guides on the same axis, as drawable segments.
 *
 * Neighbour to neighbour once sorted, never every pair: three guides give two
 * gaps, which is what you want to read. Guides on different axes cross rather
 * than sit apart, so they are never paired.
 *
 * `at` is where along the guides to draw — they span the whole viewport, so the
 * line has to be put somewhere, and the middle is as good as anywhere. Pure:
 * positions come in already converted to viewport space.
 */
export function guideGapSegments(
  active: { axis: 'x' | 'y'; pos: number }[],
  at: { x: number; y: number },
): Segment[] {
  const out: Segment[] = [];
  for (const axis of ['x', 'y'] as const) {
    const line = active.filter((g) => g.axis === axis).map((g) => g.pos).sort((a, b) => a - b);
    for (let i = 1; i < line.length; i++) {
      const from = line[i - 1]!, to = line[i]!;
      const gap = to - from;
      if (gap < 0.01) continue;          // two guides in the same place
      if (axis === 'x') {
        out.push({ x1: from, y1: at.y, x2: to, y2: at.y, label: fmt(gap), axis: 'x' });
      } else {
        out.push({ x1: at.x, y1: from, x2: at.x, y2: to, label: fmt(gap), axis: 'y' });
      }
    }
  }
  return out;
}

// ── Labels ──────────────────────────────────────────────────────────────────

/** A label's box, before anything has been drawn. */
export interface LabelBox {
  x: number; y: number; w: number; h: number;
  /** The axis of the line it belongs to, which decides where it can escape to. */
  axis: 'x' | 'y';
}

/** Breathing room between two labels that had to be separated, in px. */
const LABEL_GAP = 3;

function overlaps(a: LabelBox, b: LabelBox): boolean {
  return a.x < b.x + b.w + LABEL_GAP && b.x < a.x + a.w + LABEL_GAP
      && a.y < b.y + b.h + LABEL_GAP && b.y < a.y + a.h + LABEL_GAP;
}

/**
 * Nudge labels off each other, keeping each one on its own line.
 *
 * Four elements measured at once put their numbers in much the same place, and
 * a number underneath another number is not a measurement any more. Each label
 * escapes perpendicular to its own line — a horizontal measurement's label
 * climbs, a vertical one's steps sideways — so it stays anchored to the line it
 * describes instead of drifting off toward somebody else's.
 *
 * Greedy and in order: the first label of a pile keeps its place and later ones
 * move. That makes the layout stable frame to frame, which matters more here
 * than finding the tightest possible packing. Pure.
 */
export function spreadLabels(
  boxes: LabelBox[],
  within: { w: number; h: number },
  edge = 12,
): LabelBox[] {
  // The whole box has to land inside, not just its corner — a label clamped by
  // its left edge alone hangs off the rim, and then the drawing code clamps it
  // somewhere else and the layout stops describing what you see.
  const clampX = (x: number, w: number) => Math.min(Math.max(x, edge), within.w - w - edge);
  const clampY = (y: number, h: number) => Math.min(Math.max(y, edge), within.h - h - edge);

  const placed: LabelBox[] = [];
  for (const box of boxes) {
    const b = { ...box, x: clampX(box.x, box.w), y: clampY(box.y, box.h) };
    // Which way this label escapes. It flips once the preferred direction runs
    // into the edge of the window: a label near the right rim cannot move any
    // further right, and pushing it there anyway lands every one of them on
    // the same clamped pixel — a pile, which is what this is here to prevent.
    let flipped = false;

    // Bounded: a label in an impossible pile settles for overlapping rather
    // than marching off the screen.
    for (let tries = 0; tries < 16; tries++) {
      const blocker = placed.find((p) => overlaps(p, b));
      if (!blocker) break;

      const was = b.axis === 'x' ? b.y : b.x;
      if (b.axis === 'x') {
        b.y = clampY(flipped ? blocker.y + blocker.h + LABEL_GAP : blocker.y - b.h - LABEL_GAP, b.h);
      } else {
        b.x = clampX(flipped ? blocker.x - b.w - LABEL_GAP : blocker.x + blocker.w + LABEL_GAP, b.w);
      }

      if ((b.axis === 'x' ? b.y : b.x) !== was) continue;
      if (flipped) break;              // pinned both ways: settle for the overlap
      flipped = true;
    }
    placed.push(b);
  }
  return placed;
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
