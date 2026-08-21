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
/**
 * Shortest edge-to-edge distance between two boxes, as drawable segments.
 *
 * Overlapping on an axis means the gap on that axis is zero and no line is
 * drawn for it; boxes diagonal to each other get both, L-shaped. One box
 * inside another has no gap at all, so it reports insets instead. Pure.
 */
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
/** How near an edge a guide has to be to snap onto it, in px. */
export declare const SNAP = 4;
/** Viewport position of a guide — page coordinates minus the scroll. */
export declare function guideAt(g: Guide): number;
/** The guide under the cursor, if any. Nearest wins when two overlap. */
export declare function guideUnder(guides: Guide[], x: number, y: number): Guide | null;
/**
 * Pull a guide onto a nearby edge. A guide meant to sit on a card's edge has to
 * sit *on* it — a pixel off is a guide that quietly lies to you. Pure.
 */
export declare function snapTo(value: number, edges: number[], free: boolean): number;
/** The edges a guide on this axis could snap to, from the box under the cursor. */
export declare function snapEdges(box: Box | null, axis: 'x' | 'y'): number[];
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
