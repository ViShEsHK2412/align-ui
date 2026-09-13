import { describe, expect, it } from 'vitest';
import { EMPTY_SHADOW, confineToSide, sideOf, type Edge, type Shadow } from './shadow';

/**
 * One-sided shadows.
 *
 * `box-shadow` draws all four sides and there is no property that says
 * otherwise, so a one-sided shadow is geometry: a negative spread hides three
 * edges behind the element and the offset pushes the fourth out. These tests
 * are the geometry, checked independently of the arithmetic in shadow.ts.
 */

const s = (p: Partial<Shadow>): Shadow => ({ ...EMPTY_SHADOW, ...p });

const EDGES: Edge[] = ['top', 'right', 'bottom', 'left'];

/**
 * Where the shadow reaches, worked out from the drawing rules rather than from
 * the function under test: inset the element rect by the spread, move it by the
 * offset, then let the blur reach half its radius further out.
 */
function escapes(sh: Shadow, W = 200, H = 100): Edge[] {
  const m = -sh.spread;
  const r = sh.blur / 2;
  const left = m + sh.x - r;
  const right = W - m + sh.x + r;
  const top = m + sh.y - r;
  const bottom = H - m + sh.y + r;
  const out: Edge[] = [];
  if (top < 0) out.push('top');
  if (right > W) out.push('right');
  if (bottom > H) out.push('bottom');
  if (left < 0) out.push('left');
  return out;
}

describe('sideOf', () => {
  it('calls an ordinary shadow four-sided', () => {
    expect(sideOf(s({ y: 4, blur: 8 }))).toBe('all');
    expect(sideOf(s({ x: 2, y: 4, blur: 8, spread: 2 }))).toBe('all');
  });

  it('calls a shadow with no offset at all four-sided', () => {
    expect(sideOf(s({ blur: 8 }))).toBe('all');
  });

  it('reads the recipe people actually paste', () => {
    // `0 8px 8px -8px` is the one that circulates. It should read as bottom.
    expect(sideOf(s({ x: 0, y: 8, blur: 8, spread: -8 }))).toBe('bottom');
  });

  it('agrees with the drawing rules on every side', () => {
    for (const edge of EDGES) {
      const shadow = confineToSide(s({ y: 6, blur: 10 }), edge);
      expect(sideOf(shadow)).toBe(edge);
      expect(escapes(shadow)).toEqual([edge]);
    }
  });

  it('will not claim a side when the spread cannot hide the blur', () => {
    // Slack is negative here, so the blur escapes on all four sides at once
    // no matter how far the offset goes.
    expect(sideOf(s({ y: 20, blur: 20, spread: -2 }))).toBe('all');
  });

  it('treats a shadow hidden entirely behind its element as unconfined', () => {
    // Every slider is free to move out of this state, and naming a side it is
    // not on would be worse than naming none.
    expect(sideOf(s({ x: 0, y: 0, blur: 4, spread: -20 }))).toBe('all');
  });
});

describe('confineToSide', () => {
  it('puts the shadow on the named edge and nowhere else', () => {
    for (const edge of EDGES) {
      for (const blur of [0, 1, 3, 8, 9, 24]) {
        const out = confineToSide(s({ y: 4, blur }), edge);
        expect(escapes(out)).toEqual([edge]);
      }
    }
  });

  it('survives an odd blur, where half of it is not a whole pixel', () => {
    const out = confineToSide(s({ blur: 9, y: 2 }), 'bottom');
    expect(escapes(out)).toEqual(['bottom']);
    expect(sideOf(out)).toBe('bottom');
  });

  it('shows something even at zero blur', () => {
    const out = confineToSide(s({ blur: 0 }), 'bottom');
    expect(out.y).toBeGreaterThan(0);
    expect(escapes(out)).toEqual(['bottom']);
  });

  it('keeps how far the shadow sits when moving it round', () => {
    const tuned = confineToSide(s({ blur: 8, y: 12 }), 'bottom');
    const moved = confineToSide(tuned, 'right');
    expect(Math.abs(moved.x)).toBe(Math.abs(tuned.y));
    expect(moved.y).toBe(0);
    expect(escapes(moved)).toEqual(['right']);
  });

  it('keeps the colour and the inset flag', () => {
    const out = confineToSide(
      s({ blur: 8, colour: 'rgb(0 0 0 / 40%)', inset: true }), 'top',
    );
    expect(out.colour).toBe('rgb(0 0 0 / 40%)');
    expect(out.inset).toBe(true);
  });

  it('round-trips: every side it sets, it reads back', () => {
    for (const edge of EDGES) {
      for (const start of [s({}), s({ y: 4, blur: 8 }), s({ x: -3, y: 9, blur: 2, spread: 5 })]) {
        expect(sideOf(confineToSide(start, edge))).toBe(edge);
      }
    }
  });

  it('releases the spread that was holding three sides back', () => {
    const confined = confineToSide(s({ blur: 8, y: 6 }), 'bottom');
    expect(confined.spread).toBeLessThan(0);
    const released = confineToSide(confined, 'all');
    expect(released.spread).toBe(0);
    expect(sideOf(released)).toBe('all');
  });

  it('leaves a positive spread alone when releasing', () => {
    // A spread someone chose is theirs; only the negative one is machinery.
    expect(confineToSide(s({ spread: 6, y: 4, blur: 8 }), 'all').spread).toBe(6);
  });
});
