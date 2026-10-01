import { describe, expect, it } from 'vitest';
import {
  addPoint, arrowHead, drawMarks, isMark, MARK_HALO, MARK_INK, toFraction,
  type MarkContext, type Point, type Stroke,
} from './markup';

/** Records what was drawn, in order, instead of drawing it. */
function recorder() {
  const log: string[] = [];
  const ctx = {
    lineWidth: 0, strokeStyle: '', lineCap: 'butt', lineJoin: 'miter',
    save: () => log.push('save'),
    restore: () => log.push('restore'),
    beginPath: () => log.push('begin'),
    moveTo: (x: number, y: number) => log.push(`M${x},${y}`),
    lineTo: (x: number, y: number) => log.push(`L${x},${y}`),
    quadraticCurveTo: (cx: number, cy: number, x: number, y: number) => log.push(`Q${cx},${cy},${x},${y}`),
    stroke() { log.push(`stroke ${this.strokeStyle} ${this.lineWidth}`); },
  };
  return { ctx: ctx as unknown as MarkContext, log };
}

describe('toFraction', () => {
  const box = { x: 100, y: 50, w: 200, h: 100 };

  it('maps a pointer onto the drawing as fractions of it', () => {
    expect(toFraction(200, 100, box)).toEqual({ x: 0.5, y: 0.5 });
  });

  it('keeps a drag that leaves the drawing on its edge', () => {
    expect(toFraction(0, 500, box)).toEqual({ x: 0, y: 1 });
  });

  it('copes with a drawing of no size', () => {
    expect(toFraction(10, 10, { x: 0, y: 0, w: 0, h: 0 })).toEqual({ x: 0, y: 0 });
  });
});

describe('addPoint', () => {
  it('drops points too close to the last to matter', () => {
    const pts: Point[] = [{ x: 0, y: 0 }];
    expect(addPoint(pts, { x: 0.001, y: 0 }, 100, 100)).toBe(false);
    expect(addPoint(pts, { x: 0.05, y: 0 }, 100, 100)).toBe(true);
    expect(pts).toHaveLength(2);
  });

  it('measures the gap in pixels, so a wide drawing is not thinned harder', () => {
    const pts: Point[] = [{ x: 0, y: 0 }];
    // 0.01 of 1000px is 10px: kept. The same fraction of 100px is 1px: dropped.
    expect(addPoint([...pts], { x: 0.01, y: 0 }, 1000, 100)).toBe(true);
    expect(addPoint([...pts], { x: 0.01, y: 0 }, 100, 100)).toBe(false);
  });
});

describe('isMark', () => {
  const arrow = (b: Point): Stroke => ({ kind: 'arrow', points: [{ x: 0, y: 0 }, b], width: 0.01 });

  it('takes a click for a click, not a mark', () => {
    expect(isMark(arrow({ x: 0.01, y: 0 }), 200, 100)).toBe(false);
    expect(isMark({ kind: 'pen', points: [{ x: 0.5, y: 0.5 }], width: 0.01 }, 200, 100)).toBe(false);
  });

  it('keeps a real drag', () => {
    expect(isMark(arrow({ x: 0.2, y: 0 }), 200, 100)).toBe(true);
  });

  it('judges a pen stroke by the distance travelled, not where it ended', () => {
    // Out and back: ends where it started, and is still a scribble.
    const loop: Stroke = { kind: 'pen', width: 0.01, points: [{ x: 0, y: 0 }, { x: 0.2, y: 0 }, { x: 0, y: 0 }] };
    expect(isMark(loop, 200, 100)).toBe(true);
  });
});

describe('arrowHead', () => {
  it('points the barbs back along the shaft, either side of it', () => {
    const [l, r] = arrowHead({ x: 0, y: 0 }, { x: 100, y: 0 }, 2);
    expect(l.x).toBeLessThan(100);
    expect(r.x).toBeLessThan(100);
    expect(Math.sign(l.y)).toBe(-Math.sign(r.y));
    expect(l.x).toBeCloseTo(r.x);
  });

  it('never makes a short arrow all head', () => {
    const [l] = arrowHead({ x: 0, y: 0 }, { x: 10, y: 0 }, 4);
    expect(Math.hypot(10 - l.x, l.y)).toBeLessThanOrEqual(5 + 1e-9);
  });

  it('copes with an arrow of no length', () => {
    expect(arrowHead({ x: 5, y: 5 }, { x: 5, y: 5 }, 2)).toEqual([{ x: 5, y: 5 }, { x: 5, y: 5 }]);
  });
});

describe('drawMarks', () => {
  it('draws each stroke twice, white edge under red, scaled to the surface', () => {
    const { ctx, log } = recorder();
    drawMarks(ctx, [{ kind: 'arrow', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }], width: 0.01 }], 400, 200);
    const strokes = log.filter((l) => l.startsWith('stroke'));
    expect(strokes).toEqual([`stroke ${MARK_HALO} ${4 + 3.2}`, `stroke ${MARK_INK} 4`]);
    expect(log).toContain('M0,0');
    expect(log).toContain('L200,100');
  });

  it('draws the same marks at twice the size on a 2x image, so the thumbnail is what is saved', () => {
    const stroke: Stroke = { kind: 'pen', points: [{ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.2 }, { x: 0.9, y: 0.9 }], width: 0.01 };
    const a = recorder();
    const b = recorder();
    drawMarks(a.ctx, [stroke], 300, 100);
    drawMarks(b.ctx, [stroke], 600, 200);
    const nums = (log: string[]) => log.filter((l) => /^[MLQ]/.test(l)).map((l) => l.slice(1).split(',').map(Number));
    const scaled = nums(a.log).map((xs) => xs.map((v) => v * 2));
    expect(nums(b.log)).toEqual(scaled);
  });

  it('smooths a pen stroke through its points', () => {
    const { ctx, log } = recorder();
    drawMarks(ctx, [{ kind: 'pen', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: 1, y: 1 }], width: 0.01 }], 100, 100);
    expect(log.some((l) => l.startsWith('Q50,0'))).toBe(true);
  });

  it('skips a stroke with a single point, and leaves the context as it found it', () => {
    const { ctx, log } = recorder();
    drawMarks(ctx, [{ kind: 'pen', points: [{ x: 0, y: 0 }], width: 0.01 }], 100, 100);
    expect(log).toEqual(['save', 'restore']);
  });

  it('never draws a hairline, however small the width', () => {
    const { ctx, log } = recorder();
    drawMarks(ctx, [{ kind: 'arrow', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }], width: 0.0001 }], 100, 100);
    expect(log.filter((l) => l.startsWith('stroke'))[1]).toBe(`stroke ${MARK_INK} 1`);
  });
});
