import { skipSelector, type Config } from './config';
import type { Bands, Box, Quad, Segment } from './types';

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

/**
 * What's under the cursor, skipping our own overlay and anything the user has
 * opted out. An ignored hit walks up rather than returning nothing.
 */
export function hitTest(x: number, y: number, cfg: Config): Box | null {
  const skip = skipSelector(cfg);
  let el = document.elementFromPoint(x, y);
  while (el && el.matches(skip)) el = el.parentElement;
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

/**
 * Shortest edge-to-edge distance between two boxes, as drawable segments.
 *
 * Overlapping on an axis means the gap on that axis is zero and no line is
 * drawn for it; boxes diagonal to each other get both, L-shaped. Pure.
 */
export function gapSegments(a: Box, b: Box): Segment[] {
  const out: Segment[] = [];
  const overlapX = a.left < b.right && b.left < a.right;
  const overlapY = a.top < b.bottom && b.top < a.bottom;

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
