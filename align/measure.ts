import { fmt } from './cluster';
import type { Segment } from './overlay';
import type { Box } from './types';

/**
 * Alt+hover measurement (§6). Reads the DOM only for hit-testing and box-model
 * bands; the geometry itself is pure so it can be reasoned about and tested.
 */

/** Top, right, bottom, left — the order every CSS shorthand uses. */
export type Quad = readonly [number, number, number, number];

export interface Bands {
  padding: Quad;
  border: Quad;
  margin: Quad;
}

/** Walk up from a hit element to the nearest one present in the scan set. */
export function nearestScanned(el: Element | null, byEl: Map<Element, Box>): Box | null {
  let node: Element | null = el;
  while (node) {
    const box = byEl.get(node);
    if (box) return box;
    node = node.parentElement ??
      (node.getRootNode() instanceof ShadowRoot
        ? (node.getRootNode() as ShadowRoot).host
        : null);
  }
  return null;
}

export function bandsOf(el: Element): Bands {
  const cs = getComputedStyle(el);
  const px = (v: string) => parseFloat(v) || 0;
  return {
    padding: [px(cs.paddingTop), px(cs.paddingRight), px(cs.paddingBottom), px(cs.paddingLeft)],
    border: [px(cs.borderTopWidth), px(cs.borderRightWidth),
             px(cs.borderBottomWidth), px(cs.borderLeftWidth)],
    margin: [px(cs.marginTop), px(cs.marginRight), px(cs.marginBottom), px(cs.marginLeft)],
  };
}

/**
 * Shortest edge-to-edge distance between two boxes, as drawable segments.
 *
 * Overlapping on an axis means the gap on that axis is zero and no line is
 * drawn for it; boxes that are diagonal to each other get both, L-shaped.
 */
export function gapSegments(a: Box, b: Box): Segment[] {
  const out: Segment[] = [];
  const overlapX = a.left < b.right && b.left < a.right;
  const overlapY = a.top < b.bottom && b.top < a.bottom;

  if (!overlapX) {
    const [l, r] = a.right <= b.left ? [a, b] : [b, a];
    // Run the line through a row both boxes share where possible, so it reads
    // as the gap between them rather than a line floating off in space.
    const y = overlapY
      ? (Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2
      : (a.centerY + b.centerY) / 2;
    out.push({ x1: l.right, y1: y, x2: r.left, y2: y, label: `${fmt(r.left - l.right)}px` });
  }
  if (!overlapY) {
    const [t, btm] = a.bottom <= b.top ? [a, b] : [b, a];
    const x = overlapX
      ? (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2
      : (a.centerX + b.centerX) / 2;
    out.push({ x1: x, y1: t.bottom, x2: x, y2: btm.top, label: `${fmt(btm.top - t.bottom)}px` });
  }
  return out;
}
