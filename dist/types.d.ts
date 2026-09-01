/** A measured element, in viewport coordinates. */
export interface Box {
    el: Element;
    label: string;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
}
/** Top, right, bottom, left — the order every CSS shorthand uses. */
export type Quad = readonly [number, number, number, number];
export interface Bands {
    padding: Quad;
    border: Quad;
    margin: Quad;
}
/** A drawable measurement line with its px label. */
export interface Segment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label: string;
    /** Which way the end caps point. */
    axis: 'x' | 'y';
    /**
     * An extension line: the thin stub that runs from a box's edge out to the
     * measurement line, the way a dimension is drawn on paper. Carries no label
     * and no end caps, and is drawn faintly — it is not the measurement, it is
     * what connects the measurement to the thing it measures.
     */
    extension?: boolean;
    /**
     * Dimmed because the pointer is asking about a different measurement. Set
     * only while something is being pointed at, so the default is undimmed.
     */
    faded?: boolean;
}
/**
 * A line the user placed, in PAGE coordinates — so it stays on the same part of
 * the document as you scroll, rather than floating in the viewport.
 *
 * `x` is a vertical line at page-x; `y` is a horizontal line at page-y.
 */
export interface Guide {
    id: number;
    axis: 'x' | 'y';
    at: number;
    /**
     * A locked guide keeps measuring to every locked box once the pointer has
     * moved off it. Loose guides only measure while hovered.
     */
    locked: boolean;
    /**
     * What the guide snapped onto when it was last placed, e.g. "div.card left",
     * or '' if it landed on nothing. Shown beside its position, because a guide
     * that snapped and one that missed by a pixel look identical otherwise.
     */
    caught: string;
    /** A pinned guide can be selected but not dragged or deleted. */
    pinned: boolean;
}
