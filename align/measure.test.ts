import { describe, expect, it } from 'vitest';
import { fmt, gapSegments } from './measure';
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

  it('draws nothing when the boxes overlap on both axes', () => {
    expect(gapSegments(box(0, 0), box(10, 10))).toEqual([]);
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
