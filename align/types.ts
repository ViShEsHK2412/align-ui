export interface Box {
  el: Element;
  label: string;
  /** This box's own index in the Box[] returned by scan(). */
  key: number;          // "div.card", "button#submit" — for display
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  /**
   * Index into the same Box[] of this element's nearest scanned ancestor, or -1.
   * Lets cluster.ts group siblings without touching the DOM (§4 purity rule).
   */
  parentKey: number;
  /**
   * Computed spacing values in px: gap, rowGap, columnGap, padding{Top,Right,
   * Bottom,Left}, margin{Top,Right,Bottom,Left}. Read once in scan.ts pass 2 so
   * the scale-adherence lint (§5.4) stays pure.
   */
  spacing: number[];
}

export const SPACING_PROPS = [
  'gap', 'rowGap', 'columnGap',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
] as const;

export type Axis = 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY';

export const AXES: Axis[] = ['left', 'right', 'top', 'bottom', 'centerX', 'centerY'];

export interface Violation {
  kind: 'align' | 'subpixel' | 'spacing';
  axis?: Axis;
  values: number[];       // distinct values present in the cluster, sorted
  majority: number;       // the value most elements agree on
  spread: number;         // max - min
  boxes: Box[];           // offenders only — boxes NOT at `majority`
  all: Box[];             // every box in the cluster
  message: string;        // pre-rendered human string for the panel
}
