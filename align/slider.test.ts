import { describe, expect, it } from 'vitest';
import {
  clickTarget, decimalsForStep, DEAD_ZONE, hashMarkPercents, MAX_STRETCH,
  percentOf, roundValue, rubberStretch, sliderKeyValue, snapToDecile,
  springSettled, springStep, SNAP_SPRING, valueAt,
} from './slider';

/**
 * The maths behind the feel. Each of these is a decision that would be
 * invisible in a screenshot and obvious in the hand.
 */

describe('roundValue', () => {
  it('snaps from the minimum, not from zero', () => {
    // Stepping by 2 from a range starting at 3: the reachable values are
    // 3, 5, 7 — never 4, which a step measured from zero would produce.
    expect(roundValue(4.4, 2, 3, 11)).toBe(5);
    expect(roundValue(3.9, 2, 3, 11)).toBe(3);
  });

  it('keeps both endpoints exactly reachable', () => {
    // 0.3 does not divide 1, so a naive snap can never return the maximum.
    expect(roundValue(1, 0.3, 0, 1)).toBe(1);
    expect(roundValue(0, 0.3, 0, 1)).toBe(0);
  });

  it('clamps outside the range', () => {
    expect(roundValue(99, 1, 0, 10)).toBe(10);
    expect(roundValue(-99, 1, 0, 10)).toBe(0);
  });

  it('does not leave floating-point dust in the value', () => {
    // 0.1 + 0.2 arithmetic is exactly what a slider does hundreds of times.
    expect(roundValue(0.30000000000000004, 0.1, 0, 1)).toBe(0.3);
  });

  it('passes the value through when the step is meaningless', () => {
    expect(roundValue(0.5, 0, 0, 1)).toBe(0.5);
    expect(roundValue(0.5, NaN, 0, 1)).toBe(0.5);
  });
});

describe('decimalsForStep', () => {
  it('shows as many decimals as the step needs', () => {
    expect(decimalsForStep(1, 0, 10)).toBe(0);
    expect(decimalsForStep(0.01, 0, 1)).toBe(2);
  });

  it('takes the range into account, not only the step', () => {
    // A whole-number step over a fractional range still has to render 0.5.
    expect(decimalsForStep(1, 0.5, 10)).toBe(1);
  });

  it('handles a step written in scientific notation', () => {
    expect(decimalsForStep(1e-3, 0, 1)).toBe(3);
  });
});

describe('snapToDecile', () => {
  it('pulls to the nearest tenth from inside the pull radius', () => {
    // 0.32 is 0.02 from 0.3, inside 0.03125.
    expect(snapToDecile(0.32, 0, 1)).toBeCloseTo(0.3, 10);
  });

  it('leaves a value alone once it is outside the pull radius', () => {
    // 0.35 is 0.05 away from both neighbours — deliberately chosen, so it is
    // not snapped in either direction.
    expect(snapToDecile(0.35, 0, 1)).toBe(0.35);
  });

  it('scales the pull radius with the range', () => {
    // On 0..200 the radius is 6.25 units, so 55 is pulled to 60 and 52 is not:
    // the magnetism is a fraction of the track, not a fixed number of units.
    expect(snapToDecile(55, 0, 200)).toBeCloseTo(60, 10);
    expect(snapToDecile(52, 0, 200)).toBe(52);
    // Exactly between two tenths, so neither can claim it.
    expect(snapToDecile(70, 0, 200)).toBe(70);
  });
});

describe('clickTarget', () => {
  it('lands on a step when the steps are countable', () => {
    // 5 positions: every one is a target you can see and aim at.
    expect(clickTarget(3.4, 0, 10, 2)).toBe(4);
  });

  it('falls back to decile magnetism when they are not', () => {
    // 100 positions: snapping to each would make the magnetism meaningless.
    expect(clickTarget(0.32, 0, 1, 0.01)).toBeCloseTo(0.3, 10);
    expect(clickTarget(0.35, 0, 1, 0.01)).toBe(0.35);
  });
});

describe('rubberStretch', () => {
  it('gives nothing at all inside the dead zone', () => {
    expect(rubberStretch(DEAD_ZONE, 1)).toBe(0);
    expect(rubberStretch(DEAD_ZONE - 1, 1)).toBe(0);
  });

  it('never exceeds the maximum however far you drag', () => {
    expect(rubberStretch(10_000, 1)).toBeCloseTo(MAX_STRETCH, 10);
  });

  it('carries the sign of the edge it was dragged past', () => {
    expect(rubberStretch(10_000, -1)).toBeCloseTo(-MAX_STRETCH, 10);
  });

  it('resists rather than stretches: the first half of the travel does most of the work', () => {
    // The square root is the whole point. Linear would put the halfway
    // position at half the stretch; rooted puts it at ~71%.
    const half = rubberStretch(DEAD_ZONE + 100, 1);
    expect(half / MAX_STRETCH).toBeGreaterThan(0.7);
  });
});

describe('sliderKeyValue', () => {
  it('takes the ends', () => {
    expect(sliderKeyValue('Home', 5, 0, 10, 1)).toBe(0);
    expect(sliderKeyValue('End', 5, 0, 10, 1)).toBe(10);
  });

  it('steps by one, and by ten with Shift or Page', () => {
    expect(sliderKeyValue('ArrowRight', 5, 0, 100, 1)).toBe(6);
    expect(sliderKeyValue('ArrowRight', 5, 0, 100, 1, true)).toBe(15);
    expect(sliderKeyValue('PageUp', 5, 0, 100, 1)).toBe(15);
  });

  it('pulls an off-step value onto the grid rather than carrying the error', () => {
    // From 5.4 with a step of 1, right goes to 6 and not to 6.4.
    expect(sliderKeyValue('ArrowRight', 5.4, 0, 100, 1)).toBe(6);
    expect(sliderKeyValue('ArrowLeft', 5.4, 0, 100, 1)).toBe(5);
  });

  it('moves by exactly one step from a value already on the grid', () => {
    // The float epsilon exists for this: without it one press does nothing.
    expect(sliderKeyValue('ArrowRight', 0.3, 0, 1, 0.1)).toBeCloseTo(0.4, 10);
    expect(sliderKeyValue('ArrowLeft', 0.3, 0, 1, 0.1)).toBeCloseTo(0.2, 10);
  });

  it('clamps at the ends', () => {
    expect(sliderKeyValue('ArrowRight', 10, 0, 10, 1)).toBe(10);
    expect(sliderKeyValue('ArrowLeft', 0, 0, 10, 1)).toBe(0);
  });

  it('declines keys that are not its own', () => {
    expect(sliderKeyValue('a', 5, 0, 10, 1)).toBeUndefined();
    expect(sliderKeyValue('Enter', 5, 0, 10, 1)).toBeUndefined();
  });
});

describe('hashMarkPercents', () => {
  it('marks every step when they are countable', () => {
    // 5 steps means 4 interior marks.
    expect(hashMarkPercents(0, 10, 2)).toEqual([20, 40, 60, 80]);
  });

  it('falls back to tenths when they are not', () => {
    expect(hashMarkPercents(0, 1, 0.01)).toHaveLength(9);
  });

  it('never draws a mark on top of an end', () => {
    for (const pct of hashMarkPercents(0, 10, 2)) {
      expect(pct).toBeGreaterThan(0);
      expect(pct).toBeLessThan(100);
    }
  });
});

describe('percentOf and valueAt round-trip', () => {
  it('agree with each other', () => {
    expect(valueAt(percentOf(30, 0, 200) / 100, 0, 200)).toBeCloseTo(30, 10);
  });

  it('clamp a fraction outside the track', () => {
    expect(valueAt(-1, 0, 10)).toBe(0);
    expect(valueAt(2, 0, 10)).toBe(10);
  });

  it('survive a zero-width range without dividing by zero', () => {
    expect(percentOf(5, 5, 5)).toBe(0);
  });
});

describe('the spring', () => {
  it('reaches its target and stops', () => {
    let x = 0;
    let v = 0;
    let frames = 0;
    while (!springSettled(x, v, 100) && frames < 600) {
      ({ x, v } = springStep(x, v, 100, 1 / 60, SNAP_SPRING));
      frames += 1;
    }
    expect(frames).toBeLessThan(600);
    expect(x).toBeCloseTo(100, 0);
  });

  it('is visually finished in about 300ms, and fully settled soon after', () => {
    let x = 0;
    let v = 0;
    let arrived = 0;
    let settled = 0;
    for (let f = 1; f <= 600; f++) {
      ({ x, v } = springStep(x, v, 100, 1 / 60, SNAP_SPRING));
      if (!arrived && Math.abs(x - 100) < 1) arrived = f;
      if (!settled && springSettled(x, v, 100)) { settled = f; break; }
    }
    // Within a pixel of the target is when the eye calls it done: ~18 frames.
    expect(arrived).toBeGreaterThan(0);
    expect(arrived).toBeLessThan(20);
    // The last hundredth takes a few frames more, which is the tail that makes
    // it feel sprung rather than stopped.
    expect(settled).toBeLessThan(40);
  });

  it('overshoots a little, which is what makes it feel sprung', () => {
    let x = 0;
    let v = 0;
    let peak = 0;
    for (let i = 0; i < 120; i++) {
      ({ x, v } = springStep(x, v, 100, 1 / 60, SNAP_SPRING));
      peak = Math.max(peak, x);
    }
    expect(peak).toBeGreaterThan(100);
    // But not so much that it reads as a bounce.
    expect(peak).toBeLessThan(112);
  });

  it('does not explode on a long frame', () => {
    // The caller clamps dt for exactly this reason; the guard is worth a test
    // because the failure is a value thrown thousands of percent off the track.
    let { x, v } = springStep(0, 0, 100, 1 / 30, SNAP_SPRING);
    for (let i = 0; i < 200; i++) ({ x, v } = springStep(x, v, 100, 1 / 30, SNAP_SPRING));
    expect(Number.isFinite(x)).toBe(true);
    expect(x).toBeCloseTo(100, 0);
  });
});
