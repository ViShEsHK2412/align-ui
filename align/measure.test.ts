import { describe, expect, it } from 'vitest';
import { chain, chainSegments, fmt, gapSegments } from './measure';
import type { Box } from './types';

function box(left: number, top: number, width = 100, height = 40): Box {
  return {
    el: {} as Element,
    label: 'div.x',
    left, top, width, height,
    right: left + width,
    bottom: top + height,
  };
}

describe('gapSegments', () => {
  it('measures a horizontal gap between boxes on the same row', () => {
    const segs = gapSegments(box(0, 0), box(120, 0));
    expect(segs).toHaveLength(1);
    expect(segs[0]!.axis).toBe('x');
    expect(segs[0]!.label).toBe('20');
  });

  it('measures a vertical gap between stacked boxes', () => {
    const segs = gapSegments(box(0, 0), box(0, 60));
    expect(segs).toHaveLength(1);
    expect(segs[0]!.axis).toBe('y');
    expect(segs[0]!.label).toBe('20');
  });

  it('reads the same either way round', () => {
    expect(gapSegments(box(120, 0), box(0, 0))[0]!.label).toBe('20');
  });

  it('keeps the fraction — rounding here would defeat the point', () => {
    expect(gapSegments(box(0, 0, 80), box(93.5, 0, 80))[0]!.label).toBe('13.5');
  });

  it('draws both, L-shaped, when the boxes are diagonal', () => {
    const segs = gapSegments(box(0, 0), box(200, 200));
    expect(segs.map((s) => s.axis)).toEqual(['x', 'y']);
  });

  it('measures edges rather than a gap when the boxes overlap', () => {
    // Same size, offset by 10: inside by 10 on two edges, past by 10 on the others.
    expect(gapSegments(box(0, 0), box(10, 10)).map((s) => s.label))
      .toEqual(['10', '-10', '10', '-10']);
  });

  it('reports zero for boxes that touch', () => {
    expect(gapSegments(box(0, 0), box(100, 0))[0]!.label).toBe('0');
  });

  it('runs a horizontal line through the rows the boxes share', () => {
    // a spans y 0–40, b spans y 20–60; the shared band is 20–40, midpoint 30.
    const seg = gapSegments(box(0, 0), box(120, 20))[0]!;
    expect(seg.y1).toBe(30);
    expect(seg.y1).toBe(seg.y2);
  });
});

describe('fmt', () => {
  it('strips trailing zeros and keeps the fraction that matters', () => {
    expect(fmt(24)).toBe('24');
    expect(fmt(13.5)).toBe('13.5');
    expect(fmt(25.10)).toBe('25.1');
    expect(fmt(333.141)).toBe('333.14');
  });
});

describe('chain', () => {
  it('orders a row left to right whichever way it was locked', () => {
    const a = box(0, 0, 80, 28), b = box(96, 0, 80, 28), c = box(192, 0, 80, 28);
    expect(chain([c, a, b]).map((x) => x.left)).toEqual([0, 96, 192]);
  });

  it('orders a column top to bottom', () => {
    const a = box(0, 0), b = box(0, 60), c = box(0, 120);
    expect(chain([c, a, b]).map((x) => x.top)).toEqual([0, 60, 120]);
  });

  it('leaves a set of one alone', () => {
    expect(chain([box(5, 5)]).map((x) => x.left)).toEqual([5]);
    expect(chain([])).toEqual([]);
  });
});

describe('chainSegments', () => {
  it('measures every gutter in a locked row at once', () => {
    // Four tags with gutters of 16, 16 and 18 — the case this exists for.
    const tags = [box(0, 0, 80, 28), box(96, 0, 80, 28),
                  box(192, 0, 80, 28), box(290, 0, 80, 28)];
    expect(chainSegments(tags).map((s) => s.label)).toEqual(['16', '16', '18']);
  });

  it('measures adjacent pairs only, not every combination', () => {
    const tags = [box(0, 0, 10, 10), box(20, 0, 10, 10), box(40, 0, 10, 10)];
    expect(chainSegments(tags)).toHaveLength(2);
  });

  it('has nothing to say about fewer than two boxes', () => {
    expect(chainSegments([box(0, 0)])).toEqual([]);
    expect(chainSegments([])).toEqual([]);
  });
});

describe('nested boxes', () => {
  // A 200x100 container with a 100x40 child inset 30 left, 20 top.
  const outer = box(0, 0, 200, 100);
  const inner = box(30, 20, 100, 40);

  it('reports insets rather than nothing', () => {
    const segs = gapSegments(outer, inner);
    expect(segs.map((s) => s.label)).toEqual(['30', '70', '20', '40']);
  });

  it('reads the same whichever way round they are locked', () => {
    expect(gapSegments(inner, outer).map((s) => s.label))
      .toEqual(gapSegments(outer, inner).map((s) => s.label));
  });

  it('keeps a zero, because flush against an edge is information', () => {
    const flush = box(0, 20, 100, 40);           // hard against the left edge
    expect(gapSegments(outer, flush).map((s) => s.label)).toEqual(['0', '100', '20', '40']);
  });

  it('draws two horizontal and two vertical lines', () => {
    expect(gapSegments(outer, inner).map((s) => s.axis)).toEqual(['x', 'x', 'y', 'y']);
  });

  it('measures overflow as a negative rather than saying nothing', () => {
    // 200x80 frame, child inset 102 from the left but 62 past the right edge.
    const frame = box(0, 0, 200, 80);
    const spill = box(102, 16, 160, 40);
    expect(gapSegments(frame, spill).map((s) => s.label))
      .toEqual(['102', '-62', '16', '24']);
  });

  it('treats the larger box as the container when neither encloses', () => {
    const big = box(0, 0, 200, 200);
    const off = box(150, 150, 100, 100);      // hangs off the bottom-right
    expect(gapSegments(big, off).map((s) => s.label))
      .toEqual(['150', '-50', '150', '-50']);
  });

  it('reports all zeros for boxes that coincide exactly', () => {
    expect(gapSegments(outer, box(0, 0, 200, 100)).map((s) => s.label))
      .toEqual(['0', '0', '0', '0']);
  });
});

describe('awkward pairs', () => {
  it('treats the larger box as the container when the child engulfs its parent', () => {
    const parent = box(0, 0, 160, 60);
    const child = box(-18, -8, 200, 80);      // hangs off every side
    expect(gapSegments(parent, child).map((s) => s.label))
      .toEqual(['18', '22', '8', '12']);
  });

  it('measures a clipped child by its real box, not what is visible', () => {
    const clipper = box(0, 0, 160, 60);
    const wide = box(10, 12, 240, 40);
    expect(gapSegments(clipper, wide).map((s) => s.label))
      .toEqual(['10', '-90', '12', '8']);
  });

  it('never prints a negative zero', () => {
    // Edges that coincide can land on -0 through the subtraction.
    const a = box(0, 0, 100, 100);
    const b = box(0, 0.0001, 100, 100);
    for (const seg of gapSegments(a, b)) expect(seg.label).not.toContain('-0');
  });

  it('survives a box with no area', () => {
    const empty = box(50, 50, 0, 0);
    expect(() => gapSegments(box(0, 0, 200, 200), empty)).not.toThrow();
    expect(gapSegments(box(0, 0, 200, 200), empty)).toHaveLength(4);
  });
});
