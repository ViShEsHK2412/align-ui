// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { gridColumns } from './measure';
import { contentBoxes, gridShapes, MAX_SCOPED, normalizeGrids, type GridLayer } from './grid';

const VIEW = { top: 0, bottom: 800 };
const PAGE = { x: 0, y: 0, w: 1200, h: 800 };

describe('normalizeGrids', () => {
  it('reads the old single-grid shape as one columns layer', () => {
    expect(normalizeGrids({ columns: 12, gutter: 24, margin: 24, maxWidth: 1200 })).toEqual([
      { type: 'columns', count: 12, gutter: 24, margin: 24, maxWidth: 1200 },
    ]);
  });

  it('takes one layer or a list, in order', () => {
    expect(normalizeGrids({ type: 'baseline', size: 4 })).toEqual([{ type: 'baseline', size: 4, offset: 0 }]);
    const list = normalizeGrids([
      { type: 'columns', count: 4, gutter: 16, selector: '.card' },
      { type: 'rows', height: 48, gutter: 8 },
      { type: 'baseline', size: 8, offset: 2, color: 'teal' },
    ]);
    expect(list.map((l) => l.type)).toEqual(['columns', 'rows', 'baseline']);
    expect(list[0]).toMatchObject({ selector: '.card' });
    expect(list[2]).toMatchObject({ color: 'teal', offset: 2 });
  });

  it('is nothing for nothing', () => {
    expect(normalizeGrids(null)).toEqual([]);
    expect(normalizeGrids(undefined)).toEqual([]);
    expect(normalizeGrids([])).toEqual([]);
  });

  it('drops what it cannot draw rather than throwing', () => {
    expect(normalizeGrids([
      null, 'grid', 7, {}, { type: 'hexagons' },
      { type: 'columns', count: 0 }, { type: 'columns', count: NaN }, { columns: -3, gutter: 1, margin: 0, maxWidth: 0 },
      { type: 'rows' }, { type: 'rows', count: 0, height: -10 },
      { type: 'baseline', size: 0 }, { type: 'baseline', size: 1 }, { type: 'baseline', size: Infinity },
    ])).toEqual([]);
  });

  it('treats bad optional numbers as their defaults, not as reasons to drop the layer', () => {
    expect(normalizeGrids({ type: 'columns', count: 3, gutter: -4, margin: 'wide', maxWidth: NaN })).toEqual([
      { type: 'columns', count: 3, gutter: 0, margin: 0, maxWidth: 0 },
    ]);
  });

  it('ignores a blank selector or colour, and trims a real one', () => {
    const [l] = normalizeGrids({ type: 'baseline', size: 4, selector: '   ', color: '' });
    expect(l).not.toHaveProperty('selector');
    expect(l).not.toHaveProperty('color');
    expect(normalizeGrids({ type: 'baseline', size: 4, selector: ' .card ' })[0]!.selector).toBe('.card');
  });

  it('caps absurd counts', () => {
    expect((normalizeGrids({ type: 'columns', count: 1e9 })[0] as { count: number }).count).toBe(100);
  });
});

describe('gridShapes: columns', () => {
  it('matches the old grid exactly, so the page grid does not move', () => {
    const spec = { columns: 12, gutter: 24, margin: 24, maxWidth: 900 };
    const [layer] = normalizeGrids(spec);
    const old = gridColumns(spec, 1200);
    const { fills } = gridShapes(layer!, PAGE, VIEW);
    expect(fills.map((f) => [f.x, f.w])).toEqual(old.map((c) => [c.left, c.width]));
  });

  it('divides an element\'s box, not the window', () => {
    const { fills } = gridShapes({ type: 'columns', count: 4, gutter: 10 }, { x: 100, y: 50, w: 430, h: 200 }, VIEW);
    expect(fills).toHaveLength(4);
    expect(fills[0]).toEqual({ x: 100, y: 50, w: 100, h: 200 });
    expect(fills[3]!.x + fills[3]!.w).toBe(530);
  });

  it('only fills the part of a tall area that is on screen', () => {
    const { fills } = gridShapes({ type: 'columns', count: 2 }, { x: 0, y: -5000, w: 200, h: 20000 }, VIEW);
    expect(fills[0]).toMatchObject({ y: 0, h: 800 });
  });

  it('gives nothing for an area off screen or of no size', () => {
    expect(gridShapes({ type: 'columns', count: 2 }, { x: 0, y: 900, w: 200, h: 100 }, VIEW).fills).toEqual([]);
    expect(gridShapes({ type: 'columns', count: 2 }, { x: 0, y: 0, w: 0, h: 100 }, VIEW).fills).toEqual([]);
  });

  it('gives nothing rather than negative columns when the gutters do not fit', () => {
    expect(gridShapes({ type: 'columns', count: 12, gutter: 40 }, { x: 0, y: 0, w: 300, h: 100 }, VIEW).fills).toEqual([]);
  });
});

describe('gridShapes: rows', () => {
  it('stretches a count of rows down the area, with gutters and margins', () => {
    const { fills } = gridShapes({ type: 'rows', count: 3, gutter: 10, margin: 20 }, { x: 0, y: 0, w: 100, h: 360 }, VIEW);
    expect(fills.map((f) => [f.y, f.h])).toEqual([[20, 100], [130, 100], [240, 100]]);
  });

  it('repeats rows of a fixed height to the bottom of the area', () => {
    const { fills } = gridShapes({ type: 'rows', height: 40, gutter: 10 }, { x: 0, y: 0, w: 100, h: 200 }, VIEW);
    expect(fills.map((f) => f.y)).toEqual([0, 50, 100, 150]);
    // The last row is cut by the area, not drawn past it.
    expect(fills[3]!.h).toBe(40);
  });

  it('stops after count rows when it has a height too', () => {
    const { fills } = gridShapes({ type: 'rows', height: 40, count: 2 }, { x: 0, y: 0, w: 100, h: 400 }, VIEW);
    expect(fills).toHaveLength(2);
  });

  it('starts at the first visible row on a long scrolled page, without walking from the top', () => {
    // A page 100 000px tall, scrolled to 50 000: rows begin at the screen.
    const area = { x: 0, y: -50_000, w: 1200, h: 100_000 };
    const { fills } = gridShapes({ type: 'rows', height: 40, gutter: 10 }, area, VIEW);
    expect(fills.length).toBeLessThanOrEqual(Math.ceil(800 / 50) + 1);
    expect(fills[0]!.y).toBeGreaterThanOrEqual(0);
    expect(fills[0]!.y).toBeLessThan(50);
    // Still on the page's rhythm: 50 000 is a multiple of 50, so a row starts at the top of the screen.
    expect(fills[0]!.y).toBe(0);
  });
});

describe('gridShapes: baseline', () => {
  it('draws a hairline every size pixels from the offset', () => {
    const { lines, fills } = gridShapes({ type: 'baseline', size: 8, offset: 4 }, { x: 10, y: 0, w: 100, h: 40 }, VIEW);
    expect(fills).toEqual([]);
    expect(lines.map((l) => l.y)).toEqual([4, 12, 20, 28, 36]);
    expect(lines[0]).toMatchObject({ x: 10, w: 100, h: 1 });
  });

  it('keeps the page rhythm through a scroll', () => {
    // Document top scrolled 13px off screen: lines at 8k - 13 that are on screen.
    const { lines } = gridShapes({ type: 'baseline', size: 8 }, { x: 0, y: -13, w: 100, h: 5000 }, { top: 0, bottom: 30 });
    expect(lines.map((l) => l.y)).toEqual([3, 11, 19, 27]);
  });

  it('costs only what is on screen on a very long page', () => {
    const { lines } = gridShapes({ type: 'baseline', size: 4 }, { x: 0, y: -1e7, w: 100, h: 2e7 }, VIEW);
    expect(lines).toHaveLength(200);
  });
});

describe('contentBoxes', () => {
  function layout(el: Element, x: number, y: number, w: number, h: number) {
    el.getBoundingClientRect = () => ({ x, y, left: x, top: y, width: w, height: h, right: x + w, bottom: y + h, toJSON() {} }) as DOMRect;
  }

  it('gives the box inside padding and border', () => {
    document.body.innerHTML = '<div class="card" style="padding: 16px; border: 2px solid"></div>';
    layout(document.querySelector('.card')!, 100, 100, 300, 200);
    expect(contentBoxes('.card')).toEqual([{ x: 118, y: 118, w: 264, h: 164 }]);
  });

  it('skips what is off screen or has no size, and stops at the cap', () => {
    document.body.innerHTML = Array.from({ length: MAX_SCOPED + 10 }, () => '<i class="c"></i>').join('') + '<b class="c"></b><u class="c"></u>';
    for (const el of document.querySelectorAll('i')) layout(el, 0, 0, 10, 10);
    layout(document.querySelector('b')!, 0, 5000, 10, 10);
    layout(document.querySelector('u')!, 0, 0, 0, 0);
    expect(contentBoxes('.c')).toHaveLength(MAX_SCOPED);
  });

  it('matches nothing for a selector that does not parse', () => {
    expect(contentBoxes('>>>nope[')).toEqual([]);
  });
});

it('every layer type is handled', () => {
  const layers: GridLayer[] = [{ type: 'columns', count: 1 }, { type: 'rows', count: 1 }, { type: 'baseline', size: 4 }];
  for (const l of layers) {
    const s = gridShapes(l, PAGE, VIEW);
    expect(s.fills.length + s.lines.length).toBeGreaterThan(0);
  }
});
