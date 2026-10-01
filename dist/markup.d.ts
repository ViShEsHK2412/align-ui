/**
 * Marks on a note's screenshot: an arrow at the thing, a ring around it.
 *
 * Words say what to change; an arrow says where, faster and without the
 * ambiguity of "the second one from the left". The marks are drawn on the
 * thumbnail in the composer and burned into the full-resolution image on save,
 * so the agent sees exactly what was drawn, on the picture it opens.
 *
 * Points are kept as fractions of the image, not pixels, so one set of strokes
 * draws the same on a 268px thumbnail and on the 2x PNG behind it. The width
 * is a fraction of the image width for the same reason: what you see on the
 * thumbnail is what is saved, only sharper.
 *
 * Pure apart from `burn`, which needs a browser to decode and encode a PNG.
 */
export interface Point {
    x: number;
    y: number;
}
export interface Stroke {
    kind: 'arrow' | 'pen';
    /** Fractions of the image, 0–1. An arrow has two: tail, then tip. */
    points: Point[];
    /** Line width as a fraction of the image width. */
    width: number;
}
/** Red that reads on light and dark pages alike, with a white edge for the rest. */
export declare const MARK_INK = "#ff3b30";
export declare const MARK_HALO = "rgba(255, 255, 255, 0.92)";
/** Line width on screen, in CSS px, whatever size the thumbnail is shown at. */
export declare const MARK_WIDTH = 2.5;
/** A drag shorter than this, in CSS px, was a click, not a mark. */
export declare const MIN_MARK = 4;
/** Where a pointer lands on the drawing, as fractions of it, kept inside it. */
export declare function toFraction(clientX: number, clientY: number, box: {
    x: number;
    y: number;
    w: number;
    h: number;
}): Point;
/**
 * Add a pen point, unless it is too close to the last one to matter.
 *
 * Pointer events arrive several times a pixel on a fast machine. Keeping them
 * all makes a stroke heavier to draw and no smoother to look at. `minGap` is in
 * the drawing's own pixels.
 */
export declare function addPoint(points: Point[], p: Point, w: number, h: number, minGap?: number): boolean;
/** How far a stroke travels, in the drawing's pixels. */
export declare function strokeLength(s: Stroke, w: number, h: number): number;
/** Whether a finished stroke is a mark at all, measured on screen. */
export declare function isMark(s: Stroke, w: number, h: number): boolean;
/**
 * The two barbs of an arrowhead at `tip`, pointing away from `tail`.
 *
 * Sized from the line width so a thick arrow keeps its shape, and never more
 * than half the shaft, so a short arrow is not all head.
 */
export declare function arrowHead(tail: Point, tip: Point, lineWidth: number): [Point, Point];
/** The parts of the canvas API the drawing uses, so a test can stand in. */
export type MarkContext = Pick<CanvasRenderingContext2D, 'save' | 'restore' | 'beginPath' | 'moveTo' | 'lineTo' | 'quadraticCurveTo' | 'stroke'> & {
    lineWidth: number;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
};
/**
 * Draw every stroke onto a surface `w` by `h` pixels.
 *
 * Twice per stroke: a white edge first, then the red. Red alone vanishes on a
 * red button and goes muddy on a dark one; the edge keeps it legible on
 * anything a page can paint.
 */
export declare function drawMarks(ctx: MarkContext, strokes: readonly Stroke[], w: number, h: number): void;
/**
 * The screenshot with the marks drawn into it, as a new PNG.
 *
 * Returns the original when there is nothing to draw, and throws when the
 * browser cannot decode or encode: the caller keeps the unmarked picture then,
 * since a note without its arrows still beats a note without its screenshot.
 */
export declare function burn(blob: Blob, strokes: readonly Stroke[]): Promise<Blob>;
