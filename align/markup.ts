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

export interface Point { x: number; y: number }

export interface Stroke {
  kind: 'arrow' | 'pen';
  /** Fractions of the image, 0–1. An arrow has two: tail, then tip. */
  points: Point[];
  /** Line width as a fraction of the image width. */
  width: number;
}

/** Red that reads on light and dark pages alike, with a white edge for the rest. */
export const MARK_INK = '#ff3b30';
export const MARK_HALO = 'rgba(255, 255, 255, 0.92)';

/** Line width on screen, in CSS px, whatever size the thumbnail is shown at. */
export const MARK_WIDTH = 2.5;

/** A drag shorter than this, in CSS px, was a click, not a mark. */
export const MIN_MARK = 4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Where a pointer lands on the drawing, as fractions of it, kept inside it. */
export function toFraction(clientX: number, clientY: number, box: { x: number; y: number; w: number; h: number }): Point {
  if (box.w <= 0 || box.h <= 0) return { x: 0, y: 0 };
  return { x: clamp01((clientX - box.x) / box.w), y: clamp01((clientY - box.y) / box.h) };
}

/**
 * Add a pen point, unless it is too close to the last one to matter.
 *
 * Pointer events arrive several times a pixel on a fast machine. Keeping them
 * all makes a stroke heavier to draw and no smoother to look at. `minGap` is in
 * the drawing's own pixels.
 */
export function addPoint(points: Point[], p: Point, w: number, h: number, minGap = 1.5): boolean {
  const last = points[points.length - 1];
  if (last && Math.hypot((p.x - last.x) * w, (p.y - last.y) * h) < minGap) return false;
  points.push(p);
  return true;
}

/** How far a stroke travels, in the drawing's pixels. */
export function strokeLength(s: Stroke, w: number, h: number): number {
  let d = 0;
  for (let i = 1; i < s.points.length; i++) {
    d += Math.hypot((s.points[i]!.x - s.points[i - 1]!.x) * w, (s.points[i]!.y - s.points[i - 1]!.y) * h);
  }
  return d;
}

/** Whether a finished stroke is a mark at all, measured on screen. */
export function isMark(s: Stroke, w: number, h: number): boolean {
  if (s.points.length < 2) return false;
  if (s.kind === 'arrow') {
    const [a, b] = s.points;
    return Math.hypot((b!.x - a!.x) * w, (b!.y - a!.y) * h) >= MIN_MARK;
  }
  return strokeLength(s, w, h) >= MIN_MARK;
}

/**
 * The two barbs of an arrowhead at `tip`, pointing away from `tail`.
 *
 * Sized from the line width so a thick arrow keeps its shape, and never more
 * than half the shaft, so a short arrow is not all head.
 */
export function arrowHead(tail: Point, tip: Point, lineWidth: number): [Point, Point] {
  const dx = tip.x - tail.x;
  const dy = tip.y - tail.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return [tip, tip];
  const size = Math.min(Math.max(lineWidth * 4, 8), len / 2);
  const angle = Math.atan2(dy, dx);
  const spread = Math.PI / 6.5;
  return [
    { x: tip.x - size * Math.cos(angle - spread), y: tip.y - size * Math.sin(angle - spread) },
    { x: tip.x - size * Math.cos(angle + spread), y: tip.y - size * Math.sin(angle + spread) },
  ];
}

/** The parts of the canvas API the drawing uses, so a test can stand in. */
export type MarkContext = Pick<CanvasRenderingContext2D,
  'save' | 'restore' | 'beginPath' | 'moveTo' | 'lineTo' | 'quadraticCurveTo' | 'stroke'>
  & { lineWidth: number; strokeStyle: string | CanvasGradient | CanvasPattern;
    lineCap: CanvasLineCap; lineJoin: CanvasLineJoin };

function trace(ctx: MarkContext, s: Stroke, w: number, h: number, lineWidth: number): void {
  const pts = s.points.map((p) => ({ x: p.x * w, y: p.y * h }));
  ctx.beginPath();
  if (s.kind === 'arrow') {
    const [tail, tip] = pts as [Point, Point];
    const [l, r] = arrowHead(tail, tip, lineWidth);
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.lineTo(r.x, r.y);
  } else {
    // Through the midpoints, with each point as the control: smooth without
    // inventing a shape the hand did not draw.
    ctx.moveTo(pts[0]!.x, pts[0]!.y);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i]!.x + pts[i + 1]!.x) / 2;
      const my = (pts[i]!.y + pts[i + 1]!.y) / 2;
      ctx.quadraticCurveTo(pts[i]!.x, pts[i]!.y, mx, my);
    }
    const last = pts[pts.length - 1]!;
    ctx.lineTo(last.x, last.y);
  }
  ctx.stroke();
}

/**
 * Draw every stroke onto a surface `w` by `h` pixels.
 *
 * Twice per stroke: a white edge first, then the red. Red alone vanishes on a
 * red button and goes muddy on a dark one; the edge keeps it legible on
 * anything a page can paint.
 */
export function drawMarks(ctx: MarkContext, strokes: readonly Stroke[], w: number, h: number): void {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const s of strokes) {
    if (s.points.length < 2) continue;
    const lw = Math.max(1, s.width * w);
    ctx.strokeStyle = MARK_HALO;
    ctx.lineWidth = lw + Math.max(2, lw * 0.8);
    trace(ctx, s, w, h, lw);
    ctx.strokeStyle = MARK_INK;
    ctx.lineWidth = lw;
    trace(ctx, s, w, h, lw);
  }
  ctx.restore();
}

/**
 * The screenshot with the marks drawn into it, as a new PNG.
 *
 * Returns the original when there is nothing to draw, and throws when the
 * browser cannot decode or encode: the caller keeps the unmarked picture then,
 * since a note without its arrows still beats a note without its screenshot.
 */
export async function burn(blob: Blob, strokes: readonly Stroke[]): Promise<Blob> {
  if (strokes.length === 0) return blob;
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    ctx.drawImage(bitmap, 0, 0);
    drawMarks(ctx, strokes, bitmap.width, bitmap.height);
    const out = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!out) throw new Error('encode failed');
    return out;
  } finally {
    bitmap.close();
  }
}
