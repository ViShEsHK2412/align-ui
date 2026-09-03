import { type Config } from './config';
import type { Bands, Box, Guide, Segment } from './types';
/**
 * Measurement. Everything that reads geometry lives here; the arithmetic is
 * pure so it can be unit-tested without a DOM.
 */
/** 2 decimals, trailing zeros stripped. */
export declare function fmt(n: number): string;
/** Measure an element right now — nothing is cached, so nothing goes stale. */
export declare function boxOf(el: Element): Box;
/**
 * The scale two boxes agree on, or 1 when they do not.
 *
 * Two elements inside the same zoomed canvas share its scale, and the distance
 * between them means something in that canvas's units. Two elements in
 * different scaled subtrees share nothing, so the only honest answer is the
 * viewport distance actually on screen. Pure.
 */
export declare function sharedScale(a: Box, b: Box): {
    x: number;
    y: number;
};
/**
 * What's under the cursor, skipping our own overlay and anything the user has
 * opted out. An ignored hit walks up rather than returning nothing.
 *
 * `document.elementFromPoint` stops at a shadow host, so a web component would
 * otherwise only ever measure as one opaque box — no good on a page built from
 * Lit or Shoelace components. Descending through open roots measures the real
 * element instead. Closed roots stay closed, including our own overlay.
 */
export declare function hitTest(x: number, y: number, cfg: Config): Box | null;
export declare function bandsOf(el: Element): Bands;
/**
 * The four edge-to-edge distances between a box and the one around it.
 *
 * Overlapping boxes have no gap, but every edge still has a well-defined
 * distance, and that is the number you want: how much room is around this
 * thing inside that one. Positive is room inside; negative means the inner box
 * spills past that edge, which is usually the most interesting number on the
 * screen. Zeros are kept — flush against an edge is information too. Pure.
 */
export declare function insetSegments(outer: Box, inner: Box): Segment[];
export declare function gapSegments(a: Box, b: Box): Segment[];
/**
 * Order a set of boxes along whichever axis they actually vary on, so a row
 * reads left-to-right and a column top-to-bottom without being told which.
 * Pure.
 */
export declare function chain(boxes: Box[]): Box[];
/**
 * The gaps between each adjacent pair in a locked set — five tags in a row give
 * the four gutters between them, which is the whole point of locking more than
 * one. Pure.
 */
export declare function chainPairs(boxes: Box[]): [Box, Box][];
/** How near the cursor has to be to pick a guide up, in px. */
export declare const GRAB = 5;
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
export declare const SNAP = 8;
/** Viewport position of a guide — page coordinates minus the scroll. */
export declare function guideAt(g: Guide): number;
/** The guide under the cursor, if any. Nearest wins when two overlap. */
export declare function guideUnder(guides: Guide[], x: number, y: number): Guide | null;
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
export declare function snapTo(value: number, candidates: SnapCandidate[], free: boolean): Snapped;
/**
 * Everywhere a guide on this axis could land: the edges and centre of the box
 * under the cursor, and every other guide already placed.
 *
 * Other guides matter because lining one guide up with another is how you check
 * that two things across the page share an edge.
 */
export declare function snapCandidates(box: Box | null, axis: 'x' | 'y', others?: {
    axis: 'x' | 'y';
    at: number;
}[]): SnapCandidate[];
/**
 * The gap between a box and the nearest guide on each axis, as drawable
 * segments. A guide passing through the box reports nothing — there is no gap.
 * Pure: guide positions come in already converted to viewport space.
 */
export declare function guideSegments(box: Box, at: {
    axis: 'x' | 'y';
    pos: number;
}[]): Segment[];
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
export declare function guideGapSegments(active: {
    axis: 'x' | 'y';
    pos: number;
}[], at: {
    x: number;
    y: number;
}): Segment[];
/** A label's box, before anything has been drawn. */
export interface LabelBox {
    x: number;
    y: number;
    w: number;
    h: number;
    /** The axis of the line it belongs to, which decides where it can escape to. */
    axis: 'x' | 'y';
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
export declare function spreadLabels(boxes: LabelBox[], within: {
    w: number;
    h: number;
}, edge?: number): LabelBox[];
export interface Scale {
    x: number;
    y: number;
}
/**
 * Scale factors out of a computed `transform` string. Pure.
 *
 * Taken from the matrix rather than from rect-over-offsetWidth: offsetWidth is
 * rounded to whole pixels, so that ratio invents a scale of 1.0011 on an
 * unscaled 237.26px element. The matrix is exact and says 1 when it means 1.
 */
export declare function scaleFromTransform(t: string): Scale;
/** Every scale between an element and the document, multiplied together. */
export declare function scaleOf(el: Element): Scale;
