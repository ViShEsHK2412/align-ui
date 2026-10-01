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
export declare function guidesIn(guides: readonly Guide[], rect: Rect, scroll: {
    x: number;
    y: number;
}): number[];
/** Add or remove one guide from a selection. */
export declare function toggle(selection: ReadonlySet<number>, id: number): Set<number>;
/** Drop ids that no longer name a guide, after an undo or a delete. */
export declare function prune(selection: ReadonlySet<number>, guides: readonly Guide[]): Set<number>;
/**
 * Move every selected guide on one axis by `delta`. Arrow keys push lines, so
 * Left and Right move the vertical guides in the selection and leave the
 * horizontal ones where they are. Pinned guides stay put; that is what pinning
 * is for. Whatever a moved guide had snapped to, it is no longer on.
 */
export declare function shift(guides: readonly Guide[], selection: ReadonlySet<number>, axis: Guide['axis'], delta: number): Guide[];
/**
 * Move a dragged group so it stays rigid. The grabbed guide is placed by the
 * pointer, snapping included; every other selected guide on the same axis
 * follows by the same distance, and the ones across it follow the pointer's
 * movement on theirs. `from` holds where each guide was when the drag began.
 */
export declare function dragGroup(guides: readonly Guide[], selection: ReadonlySet<number>, grabbedId: number, from: ReadonlyMap<number, number>, moved: {
    x: number;
    y: number;
}): Guide[];
/** Remove the selected guides that can be removed. Pinned ones survive. */
export declare function removeSelected(guides: readonly Guide[], selection: ReadonlySet<number>): Guide[];
/** Clear every guide on one axis, as Shift+V and Shift+H do. Pinned ones survive. */
export declare function clearAxis(guides: readonly Guide[], axis: Guide['axis']): Guide[];
/**
 * Copies of the given guides, for an Alt-drag: same place, fresh ids, and
 * neither pinned nor locked, since a copy is new and about to move. Returns
 * the copies and a map from each original's id to its copy's.
 */
export declare function duplicate(guides: readonly Guide[], ids: ReadonlySet<number>, nextId: () => number): {
    copies: Guide[];
    map: Map<number, number>;
};
