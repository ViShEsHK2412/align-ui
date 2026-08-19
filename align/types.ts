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
