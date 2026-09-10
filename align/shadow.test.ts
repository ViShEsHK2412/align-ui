import { describe, expect, it } from 'vitest';
import {
  formatBackdropBlur, formatShadow, formatShadows, moveLayer,
  parseBackdropBlur, parseShadow, parseShadows, splitTopLevel,
} from './shadow';

/**
 * The shape of a computed shadow is the part most likely to be wrong and the
 * hardest to notice being wrong: the browser normalises what you wrote into its
 * own order, so a parser that assumes your order works until it does not.
 */

describe('splitTopLevel', () => {
  it('does not split inside a function', () => {
    // The naive version tears `rgba(0, 0, 0, 0.2)` into four pieces and
    // reports four shadow layers where there is one.
    expect(splitTopLevel('rgba(0, 0, 0, 0.2) 0px 2px', ',')).toHaveLength(1);
  });

  it('splits between layers', () => {
    const parts = splitTopLevel('rgba(0, 0, 0, 0.2) 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px', ',');
    expect(parts).toHaveLength(2);
  });

  it('drops empty pieces rather than producing blank layers', () => {
    expect(splitTopLevel('a, , b', ',')).toEqual(['a', 'b']);
  });
});

describe('parseShadow', () => {
  it('reads the form Chrome hands back, colour first', () => {
    expect(parseShadow('rgba(0, 0, 0, 0.2) 0px 2px 8px 0px')).toEqual({
      x: 0, y: 2, blur: 8, spread: 0, colour: 'rgba(0, 0, 0, 0.2)', inset: false,
    });
  });

  it('reads the form a stylesheet is written in, colour last', () => {
    // The spec allows either order and engines disagree, so position cannot be
    // what identifies the colour.
    expect(parseShadow('0px 2px 8px 0px rgba(0, 0, 0, 0.2)')?.colour)
      .toBe('rgba(0, 0, 0, 0.2)');
  });

  it('fills in the lengths that were left out', () => {
    // Two lengths is legal: blur and spread default to zero.
    expect(parseShadow('#000 1px 2px')).toEqual({
      x: 1, y: 2, blur: 0, spread: 0, colour: '#000', inset: false,
    });
  });

  it('finds inset wherever it sits', () => {
    expect(parseShadow('inset 0 2px 4px #000')?.inset).toBe(true);
    expect(parseShadow('0 2px 4px #000 inset')?.inset).toBe(true);
    expect(parseShadow('0 2px 4px #000')?.inset).toBe(false);
  });

  it('does not mistake a colour containing the letters for inset', () => {
    // A hex or a custom property could contain the substring; the keyword has
    // to be a whole word.
    expect(parseShadow('0 2px 4px #1ffe75')?.inset).toBe(false);
  });

  it('survives the space-and-slash colour syntax', () => {
    // `rgb(0 0 0 / 20%)` has no commas and would be torn apart by a naive
    // whitespace split.
    const s = parseShadow('rgb(0 0 0 / 20%) 0px 2px 8px');
    expect(s?.colour).toBe('rgb(0 0 0 / 20%)');
    expect([s?.x, s?.y, s?.blur]).toEqual([0, 2, 8]);
  });

  it('reads negative offsets and spreads', () => {
    const s = parseShadow('#000 -2px -4px 6px -1px');
    expect([s?.x, s?.y, s?.spread]).toEqual([-2, -4, -1]);
  });

  it('refuses what is not a shadow', () => {
    expect(parseShadow('none')).toBeNull();
    expect(parseShadow('')).toBeNull();
    // One length is not enough to place anything.
    expect(parseShadow('#000 4px')).toBeNull();
  });
});

describe('parseShadows', () => {
  it('reads a layered stack in order', () => {
    const list = parseShadows(
      'rgba(0, 0, 0, 0.16) 0px 1px 2px 0px, rgba(0, 0, 0, 0.1) 0px 12px 28px 0px',
    );
    expect(list).toHaveLength(2);
    expect(list[0]?.blur).toBe(2);
    expect(list[1]?.blur).toBe(28);
  });

  it('reads no shadow as no layers', () => {
    expect(parseShadows('none')).toEqual([]);
    expect(parseShadows('')).toEqual([]);
  });
});

describe('formatting round-trips', () => {
  it('survives a parse and a format', () => {
    const original = 'rgba(0, 0, 0, 0.2) 0px 2px 8px 1px';
    const once = formatShadows(parseShadows(original));
    const twice = formatShadows(parseShadows(once));
    expect(twice).toBe(once);
  });

  it('writes inset in the position a stylesheet uses', () => {
    expect(formatShadow({ x: 0, y: 2, blur: 4, spread: 0, colour: '#000', inset: true }))
      .toBe('inset 0px 2px 4px 0px #000');
  });

  it('writes an empty stack as none, not as nothing', () => {
    // An empty string removes the declaration and lets the stylesheet's own
    // shadow come back, which is not what deleting every layer means.
    expect(formatShadows([])).toBe('none');
  });
});

describe('moveLayer', () => {
  it('reorders', () => {
    expect(moveLayer(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveLayer(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
  });

  it('leaves the list alone for an index that is not there', () => {
    expect(moveLayer(['a', 'b'], -1, 0)).toEqual(['a', 'b']);
    expect(moveLayer(['a', 'b'], 0, 5)).toEqual(['a', 'b']);
  });

  it('does not mutate what it was given', () => {
    const before = ['a', 'b'];
    moveLayer(before, 0, 1);
    expect(before).toEqual(['a', 'b']);
  });
});

describe('backdrop blur', () => {
  it('reads the radius out of a filter', () => {
    expect(parseBackdropBlur('blur(20px)')).toBe(20);
    expect(parseBackdropBlur('blur(2.5px)')).toBe(2.5);
  });

  it('reads no filter as no blur', () => {
    expect(parseBackdropBlur('none')).toBe(0);
    expect(parseBackdropBlur('')).toBe(0);
  });

  it('ignores a filter that is not a blur', () => {
    expect(parseBackdropBlur('saturate(180%)')).toBe(0);
  });

  it('finds the blur among other filters', () => {
    expect(parseBackdropBlur('saturate(180%) blur(12px)')).toBe(12);
  });

  it('writes zero as none rather than as blur(0px)', () => {
    // blur(0px) still promotes the element to its own compositing layer and
    // still costs what a backdrop filter costs. Returning to zero has to
    // actually remove the effect.
    expect(formatBackdropBlur(0)).toBe('none');
    expect(formatBackdropBlur(-1)).toBe('none');
    expect(formatBackdropBlur(12)).toBe('blur(12px)');
  });
});
