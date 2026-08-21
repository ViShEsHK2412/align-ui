/** A measured element, in viewport coordinates. */
export interface Box {
  el: Element;
  label: string;          // "div.card", "button#submit"
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
  x1: number; y1: number; x2: number; y2: number;
  label: string;
  /** Which way the end caps point. */
  axis: 'x' | 'y';
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
}
