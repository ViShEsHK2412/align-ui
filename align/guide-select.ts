/**
 * Working on several guides at once: select, move, nudge, delete, duplicate.
 *
 * A layout has guides in sets — the two edges of a column, the three lines of
 * a baseline step — and moving them one by one undoes the very alignment they
 * were put down to record. These operate on a selection and return new lists,
 * leaving undo to the caller, so each gesture is one step back however many
 * guides it touched.
 *
 * Pure: guides in, guides out, positions in page pixels as stored.
 */

import type { Guide } from './types';
import type { Rect } from './notes';

/**
 * Guides whose line crosses a rectangle drawn on screen. A vertical guide
 * crosses it when its x falls inside; a horizontal one when its y does. Edges
 * count, so a marquee drawn snug to a guide still catches it.
 *
 * `scroll` turns the stored page positions into the viewport ones the
 * rectangle was drawn in.
 */
export function guidesIn(guides: readonly Guide[], rect: Rect, scroll: { x: number; y: number }): number[] {
  const x0 = Math.min(rect.x, rect.x + rect.w);
  const x1 = Math.max(rect.x, rect.x + rect.w);
  const y0 = Math.min(rect.y, rect.y + rect.h);
  const y1 = Math.max(rect.y, rect.y + rect.h);
  return guides
    .filter((g) => {
      const at = g.axis === 'x' ? g.at - scroll.x : g.at - scroll.y;
      return g.axis === 'x' ? at >= x0 && at <= x1 : at >= y0 && at <= y1;
    })
    .map((g) => g.id);
}

/** Add or remove one guide from a selection. */
export function toggle(selection: ReadonlySet<number>, id: number): Set<number> {
  const next = new Set(selection);
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
}

/** Drop ids that no longer name a guide, after an undo or a delete. */
export function prune(selection: ReadonlySet<number>, guides: readonly Guide[]): Set<number> {
  const live = new Set(guides.map((g) => g.id));
  return new Set([...selection].filter((id) => live.has(id)));
}

/**
 * Move every selected guide on one axis by `delta`. Arrow keys push lines, so
 * Left and Right move the vertical guides in the selection and leave the
 * horizontal ones where they are. Pinned guides stay put; that is what pinning
 * is for. Whatever a moved guide had snapped to, it is no longer on.
 */
export function shift(guides: readonly Guide[], selection: ReadonlySet<number>, axis: Guide['axis'], delta: number): Guide[] {
  return guides.map((g) => (selection.has(g.id) && g.axis === axis && !g.pinned
    ? { ...g, at: g.at + delta, caught: '' }
    : g));
}

/**
 * Move a dragged group so it stays rigid. The grabbed guide is placed by the
 * pointer, snapping included; every other selected guide on the same axis
 * follows by the same distance, and the ones across it follow the pointer's
 * movement on theirs. `from` holds where each guide was when the drag began.
 */
export function dragGroup(
  guides: readonly Guide[], selection: ReadonlySet<number>, grabbedId: number,
  from: ReadonlyMap<number, number>, moved: { x: number; y: number },
): Guide[] {
  const grabbed = guides.find((g) => g.id === grabbedId);
  if (!grabbed) return [...guides];
  const start = from.get(grabbedId) ?? grabbed.at;
  const along = grabbed.at - start;
  return guides.map((g) => {
    if (g.id === grabbedId || !selection.has(g.id) || g.pinned) return g;
    const origin = from.get(g.id);
    if (origin === undefined) return g;
    const d = g.axis === grabbed.axis ? along : (g.axis === 'x' ? moved.x : moved.y);
    return { ...g, at: origin + d, caught: '' };
  });
}

/** Remove the selected guides that can be removed. Pinned ones survive. */
export function removeSelected(guides: readonly Guide[], selection: ReadonlySet<number>): Guide[] {
  return guides.filter((g) => g.pinned || !selection.has(g.id));
}

/** Clear every guide on one axis, as Shift+V and Shift+H do. Pinned ones survive. */
export function clearAxis(guides: readonly Guide[], axis: Guide['axis']): Guide[] {
  return guides.filter((g) => g.pinned || g.axis !== axis);
}

/**
 * Copies of the given guides, for an Alt-drag: same place, fresh ids, and
 * neither pinned nor locked, since a copy is new and about to move. Returns
 * the copies and a map from each original's id to its copy's.
 */
export function duplicate(
  guides: readonly Guide[], ids: ReadonlySet<number>, nextId: () => number,
): { copies: Guide[]; map: Map<number, number> } {
  const copies: Guide[] = [];
  const map = new Map<number, number>();
  for (const g of guides) {
    if (!ids.has(g.id)) continue;
    const id = nextId();
    copies.push({ ...g, id, pinned: false, locked: false });
    map.set(g.id, id);
  }
  return { copies, map };
}
