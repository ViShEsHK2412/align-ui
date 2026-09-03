import { describe, expect, it } from 'vitest';
import {
  chain, chainPairs, fmt, snapCandidates, snapTo, gapSegments, guideGapSegments, scaleFromTransform,
  spreadLabels, type LabelBox,
} from './measure';
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
    // Extension lines come too; the measurements are the labelled ones.
    const segs = gapSegments(box(0, 0), box(200, 200)).filter((s) => !s.extension);
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

describe('chainPairs', () => {
  const labels = (boxes: Box[]) =>
    chainPairs(boxes).flatMap(([a, b]) => gapSegments(a, b)).map((s) => s.label);

  it('measures every gutter in a locked row at once', () => {
    // Four tags with gutters of 16, 16 and 18 — the case this exists for.
    const tags = [box(0, 0, 80, 28), box(96, 0, 80, 28),
                  box(192, 0, 80, 28), box(290, 0, 80, 28)];
    expect(labels(tags)).toEqual(['16', '16', '18']);
  });

  it('measures adjacent pairs only, not every combination', () => {
    const tags = [box(0, 0, 10, 10), box(20, 0, 10, 10), box(40, 0, 10, 10)];
    expect(chainPairs(tags)).toHaveLength(2);
  });

  it('has nothing to say about fewer than two boxes', () => {
    expect(chainPairs([box(0, 0)])).toEqual([]);
    expect(chainPairs([])).toEqual([]);
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

describe('scaleFromTransform', () => {
  it('reads 1 when there is no transform', () => {
    expect(scaleFromTransform('none')).toEqual({ x: 1, y: 1 });
    expect(scaleFromTransform('')).toEqual({ x: 1, y: 1 });
  });

  it('ignores a pure translate — the case that started this', () => {
    // Exactly what the reported toolbar had; it is not scaled at all.
    expect(scaleFromTransform('matrix(1, 0, 0, 1, -118.631, 0)'))
      .toEqual({ x: 1, y: 1 });
  });

  it('reads a scale', () => {
    expect(scaleFromTransform('matrix(0.8, 0, 0, 0.8, 0, 0)'))
      .toEqual({ x: 0.8, y: 0.8 });
  });

  it('reads each axis separately', () => {
    expect(scaleFromTransform('matrix(2, 0, 0, 0.5, 0, 0)'))
      .toEqual({ x: 2, y: 0.5 });
  });

  it('does not mistake a rotation for a squash', () => {
    // 45 degrees: every term is 0.707, but nothing is scaled.
    const s = scaleFromTransform('matrix(0.7071, 0.7071, -0.7071, 0.7071, 0, 0)');
    expect(s.x).toBeCloseTo(1, 3);
    expect(s.y).toBeCloseTo(1, 3);
  });

  it('handles matrix3d', () => {
    const s = scaleFromTransform(
      'matrix3d(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    expect(s).toEqual({ x: 0.5, y: 0.5 });
  });
});

describe('guideGapSegments', () => {
  const mid = { x: 500, y: 300 };
  const g = (axis: 'x' | 'y', pos: number) => ({ axis, pos });

  it('measures the gap between two guides on the same axis', () => {
    const [seg] = guideGapSegments([g('y', 100), g('y', 340)], mid);
    expect(seg?.label).toBe('240');
    expect(seg?.axis).toBe('y');
    expect(seg?.y1).toBe(100);
    expect(seg?.y2).toBe(340);
    expect(seg?.x1).toBe(500);      // drawn down the middle of the viewport
  });

  it('measures neighbour to neighbour, not every pair', () => {
    // Three guides are two gaps. The 0-to-300 span is the sum of the other
    // two, so reporting it as well would be noise.
    const out = guideGapSegments([g('x', 0), g('x', 100), g('x', 300)], mid);
    expect(out.map((s) => s.label)).toEqual(['100', '200']);
  });

  it('sorts before pairing, so drop order does not matter', () => {
    const out = guideGapSegments([g('x', 300), g('x', 0), g('x', 100)], mid);
    expect(out.map((s) => s.label)).toEqual(['100', '200']);
  });

  it('never pairs across axes, because those guides cross', () => {
    expect(guideGapSegments([g('x', 100), g('y', 400)], mid)).toEqual([]);
  });

  it('says nothing about a single guide', () => {
    expect(guideGapSegments([g('x', 100)], mid)).toEqual([]);
    expect(guideGapSegments([], mid)).toEqual([]);
  });

  it('skips two guides sitting in the same place', () => {
    expect(guideGapSegments([g('y', 100), g('y', 100)], mid)).toEqual([]);
  });

  it('handles both axes at once', () => {
    const out = guideGapSegments([g('x', 0), g('x', 60), g('y', 10), g('y', 90)], mid);
    expect(out.map((s) => `${s.axis}:${s.label}`)).toEqual(['x:60', 'y:80']);
  });
});

describe('spreadLabels', () => {
  const lab = (x: number, y: number, axis: 'x' | 'y' = 'x'): LabelBox =>
    ({ x, y, w: 40, h: 20, axis });
  /** Room to move, so these cases are about collisions and nothing else. */
  const ROOM = { w: 4000, h: 4000 };

  it('leaves labels that do not touch exactly where they were', () => {
    const input = [lab(100, 100), lab(300, 100), lab(100, 300)];
    expect(spreadLabels(input, ROOM)).toEqual(input);
  });

  it('moves the second of an overlapping pair, never the first', () => {
    // Stability matters more than tight packing: the first label of a pile
    // holding still keeps the layout from churning frame to frame.
    const [first, second] = spreadLabels([lab(100, 100), lab(110, 105)], ROOM);
    expect(first).toEqual(lab(100, 100));
    expect(second!.y).toBeLessThan(105);
  });

  it('sends the label of a horizontal measurement upward', () => {
    const [, second] = spreadLabels([lab(100, 100), lab(100, 100)], ROOM);
    expect(second!.y).toBe(100 - 20 - 3);   // clear above the first
    expect(second!.x).toBe(100);            // and still over its own line
  });

  it('sends the label of a vertical measurement sideways', () => {
    const [, second] = spreadLabels([lab(100, 100, 'y'), lab(100, 100, 'y')], ROOM);
    expect(second!.x).toBe(100 + 40 + 3);
    expect(second!.y).toBe(100);
  });

  it('separates a whole pile, not just the first collision', () => {
    const out = spreadLabels([lab(100, 200), lab(100, 200), lab(100, 200), lab(100, 200)], ROOM);
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i]!, b = out[j]!;
        const clash = a.x < b.x + b.w && b.x < a.x + a.w
                   && a.y < b.y + b.h && b.y < a.y + a.h;
        expect(clash).toBe(false);
      }
    }
  });

  it('gives up rather than marching a label off the screen', () => {
    // Sixteen tries is the cap; a hundred labels in one spot cannot all fit,
    // and settling for an overlap beats scrolling off into nowhere.
    const out = spreadLabels(Array.from({ length: 100 }, () => lab(100, 2000)), ROOM);
    expect(out).toHaveLength(100);
    expect(Math.min(...out.map((b) => b.y))).toBeGreaterThan(2000 - 100 * 23);
  });

  it('does not mutate what it was given', () => {
    const input = [lab(100, 100), lab(100, 100)];
    spreadLabels(input, ROOM);
    expect(input[1]).toEqual(lab(100, 100));
  });

  it('handles an empty list', () => {
    expect(spreadLabels([], ROOM)).toEqual([]);
  });

  it('escapes the other way when the window is in the way', () => {
    // Four labels against the right rim. Pushing right does nothing there —
    // they all clamp to the same pixel and pile up, which is the bug this
    // guards. They have to go left instead.
    const tight = { w: 200, h: 400 };
    const out = spreadLabels(
      Array.from({ length: 4 }, () => ({ x: 150, y: 100, w: 40, h: 20, axis: 'y' as const })),
      tight,
    );
    const xs = out.map((b) => b.x).sort((a, b) => a - b);
    expect(new Set(xs).size).toBe(4);           // four distinct places
    expect(xs[0]).toBeLessThan(150);            // and some of them moved left
  });

  it('keeps every label inside the window', () => {
    const tight = { w: 300, h: 200 };
    const out = spreadLabels(
      Array.from({ length: 8 }, () => ({ x: 280, y: 20, w: 40, h: 20, axis: 'x' as const })),
      tight,
    );
    for (const b of out) {
      expect(b.x).toBeGreaterThanOrEqual(12);
      expect(b.y).toBeGreaterThanOrEqual(12);
      expect(b.x + b.w).toBeLessThanOrEqual(tight.w - 12);
      expect(b.y + b.h).toBeLessThanOrEqual(tight.h - 12);
    }
  });

  it('pulls a label that starts outside back into the window', () => {
    const [wayOut] = spreadLabels([lab(-500, -500)], { w: 300, h: 300 });
    expect(wayOut!.x).toBe(12);
    expect(wayOut!.y).toBe(12);
    const [wayIn] = spreadLabels([lab(9999, 9999)], { w: 300, h: 300 });
    expect(wayIn!.x + wayIn!.w).toBe(300 - 12);   // the whole box, not its corner
    expect(wayIn!.y + wayIn!.h).toBe(300 - 12);
  });
});

describe('snapCandidates', () => {
  const b = box(100, 50, 200, 80);   // left 100, right 300, top 50, bottom 130

  it('offers both edges and the centre of the box under the cursor', () => {
    const out = snapCandidates(b, 'x');
    expect(out.map((c) => c.at)).toEqual([100, 300, 200]);
    expect(out.map((c) => c.what.split(' ').pop())).toEqual(['left', 'right', 'centre']);
  });

  it('ranks an edge above a centre, so a tie lands on the edge', () => {
    const out = snapCandidates(b, 'x');
    const edge = out.find((c) => c.what.endsWith('left'))!;
    const centre = out.find((c) => c.what.endsWith('centre'))!;
    expect(edge.rank).toBeLessThan(centre.rank);
  });

  it('uses the other axis for a horizontal guide', () => {
    expect(snapCandidates(b, 'y').map((c) => c.at)).toEqual([50, 130, 90]);
  });

  it('offers other guides on the same axis, and never the other axis', () => {
    const others = [{ axis: 'x' as const, at: 640 }, { axis: 'y' as const, at: 12 }];
    const out = snapCandidates(null, 'x', others);
    expect(out).toEqual([{ at: 640, what: 'guide', rank: 2 }]);
  });

  it('has nothing to offer over empty space', () => {
    expect(snapCandidates(null, 'x')).toEqual([]);
  });
});

describe('snapTo', () => {
  const at = (n: number, what = 'edge', rank = 0) => ({ at: n, what, rank });

  it('catches a candidate within range and names it', () => {
    expect(snapTo(302, [at(300, 'div.card right')], false))
      .toEqual({ at: 300, what: 'div.card right' });
  });

  it('leaves the value alone when nothing is near, and says so', () => {
    expect(snapTo(500, [at(300)], false)).toEqual({ at: 500, what: '' });
  });

  it('takes the nearer of two', () => {
    expect(snapTo(302, [at(300, 'near'), at(305, 'far')], false).what).toBe('near');
  });

  it('settles an exact tie by rank, so an edge beats a centre', () => {
    // 200 sits the same distance from both; the edge is the meaningful one.
    const out = snapTo(200, [at(198, 'centre', 1), at(202, 'edge', 0)], false);
    expect(out.what).toBe('edge');
  });

  it('does nothing at all when the drag asked to be free', () => {
    expect(snapTo(302, [at(300)], true)).toEqual({ at: 302, what: '' });
  });

  it('ignores a candidate further away than the snap radius', () => {
    expect(snapTo(400, [at(300)], false)).toEqual({ at: 400, what: '' });
  });

  it('reaches eight pixels, the tolerance tldraw and Excalidraw both ship', () => {
    // Ours was four, which made snapping feel broken: you had to be almost
    // exactly on the edge before it would take.
    expect(snapTo(307, [at(300, 'edge')], false).what).toBe('edge');
    expect(snapTo(309, [at(300, 'edge')], false).what).toBe('');
  });
});

describe('extension lines', () => {
  const meas = (segs: ReturnType<typeof gapSegments>) => segs.filter((s) => !s.extension);
  const ext = (segs: ReturnType<typeof gapSegments>) => segs.filter((s) => s.extension);

  it('draws none when the boxes share a row', () => {
    // Side by side, same vertical span: the line already crosses both.
    const out = gapSegments(box(0, 0, 100, 50), box(140, 0, 100, 50));
    expect(meas(out).map((s) => s.label)).toEqual(['40']);
    expect(ext(out)).toEqual([]);
  });

  it('joins both boxes when they share no row', () => {
    // Diagonal: the gap line runs level with neither box.
    const out = gapSegments(box(0, 0, 100, 50), box(140, 300, 100, 50));
    expect(ext(out)).toHaveLength(4);          // two per axis
    for (const e of ext(out)) expect(e.label).toBe('');
  });

  it('reaches from the near edge to the measurement line', () => {
    const a = box(0, 0, 100, 50);              // right 100, spans y 0..50
    const b = box(140, 300, 100, 50);          // left 140, spans y 300..350
    const line = gapSegments(a, b).find((s) => s.label === '40')!;
    const stub = ext(gapSegments(a, b)).find((s) => s.x1 === 100 && s.axis === 'y')!;
    expect(stub.y1).toBe(50);                  // a's bottom, its nearest edge
    expect(stub.y2).toBe(line.y1);             // out to the line
  });

  it('never labels an extension, so it cannot enter the label layout', () => {
    const out = gapSegments(box(0, 0, 40, 40), box(200, 200, 40, 40));
    expect(out.filter((s) => s.label !== '').every((s) => !s.extension)).toBe(true);
  });
});
