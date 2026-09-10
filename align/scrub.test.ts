import { describe, expect, it } from 'vitest';
import { DRAG_SLOP, formatScrub, parseScrub, scrubbed, SENSITIVITY } from './scrub';

/**
 * The maths behind the badge. What matters here is the rate: a scrub that
 * moves too fast is unusable for a value you are trying to land exactly, and
 * one that moves too slowly is a slider with extra steps.
 */

describe('scrubbed', () => {
  it('moves one unit per two pixels', () => {
    expect(scrubbed(0, 20, 0, 999)).toBe(10);
    expect(SENSITIVITY).toBe(2);
  });

  it('goes both ways', () => {
    expect(scrubbed(50, -40, 0, 999)).toBe(30);
  });

  it('measures from where the drag started, not from the last frame', () => {
    // Accumulating per-move deltas drifts: the same total travel has to land
    // on the same value however many events it arrived in.
    const inOneMove = scrubbed(10, 60, 0, 999);
    const startedSame = scrubbed(10, 60, 0, 999);
    expect(inOneMove).toBe(startedSame);
    expect(inOneMove).toBe(40);
  });

  it('clamps to the range', () => {
    expect(scrubbed(10, -9999, 0, 100)).toBe(0);
    expect(scrubbed(10, 9999, 0, 100)).toBe(100);
  });

  it('lets a negative range through, which margins need', () => {
    expect(scrubbed(0, -40, -64, 128)).toBe(-20);
  });

  it('snaps to the step', () => {
    // A step of 4 on a 10px drag: 5 units, which is not on the grid.
    expect(scrubbed(0, 10, 0, 999, 4)).toBe(4);
  });

  it('leaves no floating-point dust', () => {
    expect(scrubbed(0, 1, 0, 10, 0.1)).toBe(0.5);
  });

  it('is a no-op below the slop, which is what keeps a click a click', () => {
    // The control ignores anything under DRAG_SLOP, so this is the first
    // movement that can register at all.
    expect(DRAG_SLOP).toBe(3);
    expect(scrubbed(10, DRAG_SLOP + 1, 0, 999)).toBe(12);
  });
});

describe('parseScrub', () => {
  it('reads a bare number', () => {
    expect(parseScrub('24', 0, 999)).toBe(24);
    expect(parseScrub('  8.5 ', 0, 999)).toBe(8.5);
  });

  it('accepts a unit and ignores it', () => {
    // The field shows `24` and people type `24px`, because that is what they
    // would write in a stylesheet. Refusing it would be correct and useless.
    expect(parseScrub('24px', 0, 999)).toBe(24);
    expect(parseScrub('2rem', 0, 999)).toBe(2);
    expect(parseScrub('50%', 0, 999)).toBe(50);
  });

  it('reads a negative', () => {
    expect(parseScrub('-12', -64, 128)).toBe(-12);
  });

  it('clamps rather than refusing', () => {
    expect(parseScrub('9999', 0, 100)).toBe(100);
  });

  it('refuses what is not a number', () => {
    for (const text of ['', 'auto', 'abc', '12 34', '1,5', 'px']) {
      expect(parseScrub(text, 0, 999)).toBeNull();
    }
  });
});

describe('formatScrub', () => {
  it('shows whole numbers whole', () => {
    expect(formatScrub(24)).toBe('24');
    expect(formatScrub(0)).toBe('0');
  });

  it('keeps two decimals at most and drops trailing zeros', () => {
    expect(formatScrub(8.5)).toBe('8.5');
    expect(formatScrub(8.567)).toBe('8.57');
    expect(formatScrub(8.0)).toBe('8');
  });

  it('shows a negative as a negative', () => {
    expect(formatScrub(-12)).toBe('-12');
  });
});
