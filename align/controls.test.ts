import { describe, expect, it } from 'vitest';
import { GROUPS, numberFrom, toHexInput } from './controls';

/**
 * The panel's own arithmetic, and the shape of what it offers.
 *
 * The controls themselves need a document and are exercised on the bench page.
 * What is worth pinning here is the reading of a computed value, which is where
 * a panel quietly starts showing numbers the element does not have.
 */

describe('numberFrom', () => {
  it('reads a length', () => {
    expect(numberFrom('16px')).toBe(16);
    expect(numberFrom('-4px')).toBe(-4);
    expect(numberFrom('1.5')).toBe(1.5);
  });

  it('reads `normal` as zero', () => {
    // What `letter-spacing` computes to when nobody has set it. Zero is the
    // right reading: `normal` tracking is no tracking.
    expect(numberFrom('normal')).toBe(0);
  });

  it('does not turn a keyword into a number', () => {
    for (const value of ['auto', 'inherit', 'none', '']) {
      expect(numberFrom(value)).toBe(0);
    }
  });

  it('takes the first number of a multi-value string', () => {
    // A shorthand read back is several numbers, and a slider bound to one of
    // them has to take the one it is asking about.
    expect(numberFrom('12px 4px')).toBe(12);
  });
});

describe('toHexInput', () => {
  it('converts a computed rgb into what a colour input accepts', () => {
    expect(toHexInput('rgb(13, 153, 255)')).toBe('#0d99ff');
  });

  it('handles the space-separated form too', () => {
    expect(toHexInput('rgb(13 153 255)')).toBe('#0d99ff');
  });

  it('drops the alpha rather than refusing the colour', () => {
    // `<input type=color>` has no alpha channel. Showing the colour without it
    // beats showing black, which is what a stricter parse would give.
    expect(toHexInput('rgba(13, 153, 255, 0.5)')).toBe('#0d99ff');
  });

  it('passes a hex straight through', () => {
    expect(toHexInput('#0d99ff')).toBe('#0d99ff');
  });

  it('falls back to black rather than to an invalid value', () => {
    // A colour input given something it cannot parse silently keeps its old
    // value, which would make the swatch disagree with the element.
    for (const value of ['transparent', 'currentcolor', '', 'not-a-colour']) {
      expect(toHexInput(value)).toBe('#000000');
    }
  });

  it('clamps a channel that is out of range', () => {
    expect(toHexInput('rgb(300, -20, 128)')).toBe('#ff0080');
  });
});

describe('the offered properties', () => {
  const specs = GROUPS.flatMap((g) => g.specs);

  it('never offers the same property twice', () => {
    // Two rows writing one property would disagree the moment either moved.
    const seen = specs.map((s) => s.prop);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it('gives every choice row some options', () => {
    for (const spec of specs.filter((s) => s.kind === 'choice')) {
      expect(spec.options?.length ?? 0).toBeGreaterThan(1);
    }
  });

  it('gives every slider row a range it can move in', () => {
    for (const spec of specs.filter((s) => s.kind === 'length' || s.kind === 'number')) {
      expect(spec.max!).toBeGreaterThan(spec.min!);
      expect(spec.step!).toBeGreaterThan(0);
    }
  });

  it('gives every per-side group exactly four sides', () => {
    for (const spec of specs.filter((s) => s.sides)) {
      expect(spec.sides).toHaveLength(4);
    }
  });

  it('lets margin go negative and never lets padding', () => {
    const margin = specs.find((s) => s.prop === 'margin');
    const padding = specs.find((s) => s.prop === 'padding');
    expect(margin!.min!).toBeLessThan(0);
    expect(padding!.min).toBe(0);
  });

  it('keeps the first screen short enough to scan', () => {
    // The full set is over forty rows. The tiers are a shipping order, not a
    // screen, and a panel nobody can find anything in is worse than a small one.
    const upfront = specs.filter((s) => !s.more);
    expect(upfront.length).toBeLessThanOrEqual(16);
  });

  it('keeps every range plausible for the property it edits', () => {
    // A font-size slider running to 400 spends nine tenths of its travel on
    // sizes nobody sets, which makes the tenth you want unusable.
    const size = specs.find((s) => s.prop === 'font-size');
    expect(size!.max).toBeLessThanOrEqual(128);
    const weight = specs.find((s) => s.prop === 'font-weight');
    expect([weight!.min, weight!.max, weight!.step]).toEqual([100, 900, 100]);
    const opacity = specs.find((s) => s.prop === 'opacity');
    expect([opacity!.min, opacity!.max]).toEqual([0, 1]);
  });
});
