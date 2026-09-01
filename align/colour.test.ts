import { describe, expect, it } from 'vitest';
import { formats, parseHex, toHex, toHsl, toOklch, toRgb } from './colour';

describe('parseHex', () => {
  it('reads a six-digit hex, with or without the hash', () => {
    expect(parseHex('#3b6fe0')).toEqual({ r: 59, g: 111, b: 224 });
    expect(parseHex('3b6fe0')).toEqual({ r: 59, g: 111, b: 224 });
  });

  it('expands the three-digit form', () => {
    expect(parseHex('#39f')).toEqual({ r: 51, g: 153, b: 255 });
  });

  it('refuses anything that is not a hex colour', () => {
    expect(parseHex('rgb(0 0 0)')).toBe(null);
    expect(parseHex('#12345')).toBe(null);
    expect(parseHex('#gggggg')).toBe(null);
  });
});

describe('toHex and toRgb', () => {
  it('round-trips a colour unchanged', () => {
    expect(toHex(parseHex('#3b6fe0')!)).toBe('#3b6fe0');
  });

  it('pads a channel that needs a leading zero', () => {
    expect(toHex({ r: 0, g: 8, b: 255 })).toBe('#0008ff');
  });

  it('writes rgb in the modern space-separated form', () => {
    expect(toRgb({ r: 59, g: 111, b: 224 })).toBe('rgb(59 111 224)');
  });
});

describe('toHsl', () => {
  it('gives the primaries their textbook hues', () => {
    expect(toHsl({ r: 255, g: 0, b: 0 })).toBe('hsl(0 100% 50%)');
    expect(toHsl({ r: 0, g: 255, b: 0 })).toBe('hsl(120 100% 50%)');
    expect(toHsl({ r: 0, g: 0, b: 255 })).toBe('hsl(240 100% 50%)');
  });

  it('reports no hue and no saturation for a grey', () => {
    expect(toHsl({ r: 128, g: 128, b: 128 })).toBe('hsl(0 0% 50.2%)');
  });

  it('handles black and white without dividing by zero', () => {
    expect(toHsl({ r: 0, g: 0, b: 0 })).toBe('hsl(0 0% 0%)');
    expect(toHsl({ r: 255, g: 255, b: 255 })).toBe('hsl(0 0% 100%)');
  });
});

describe('toOklch', () => {
  it('puts white at lightness 1 with no chroma', () => {
    expect(toOklch({ r: 255, g: 255, b: 255 })).toBe('oklch(1 0 0)');
  });

  it('puts black at lightness 0', () => {
    expect(toOklch({ r: 0, g: 0, b: 0 })).toBe('oklch(0 0 0)');
  });

  it('reports no hue for a grey rather than one invented from rounding', () => {
    expect(toOklch({ r: 128, g: 128, b: 128 })).toMatch(/^oklch\(0\.\d+ 0 0\)$/);
  });

  it('matches the published value for sRGB red', () => {
    // Ottosson's reference: L 0.6279, C 0.2577, h 29.23.
    const m = /oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/.exec(toOklch({ r: 255, g: 0, b: 0 }))!;
    expect(Number(m[1])).toBeCloseTo(0.6279, 3);
    expect(Number(m[2])).toBeCloseTo(0.2577, 3);
    expect(Number(m[3])).toBeCloseTo(29.23, 1);
  });

  it('matches the published value for sRGB blue', () => {
    const m = /oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/.exec(toOklch({ r: 0, g: 0, b: 255 }))!;
    expect(Number(m[1])).toBeCloseTo(0.4520, 3);
    expect(Number(m[2])).toBeCloseTo(0.3132, 3);
    expect(Number(m[3])).toBeCloseTo(264.05, 1);
  });
});

describe('formats', () => {
  it('offers all four, in reading order', () => {
    expect(formats('#3b6fe0').map((f) => f.label)).toEqual(['hex', 'rgb', 'hsl', 'oklch']);
  });

  it('offers nothing for something that is not a colour', () => {
    expect(formats('nonsense')).toEqual([]);
  });
});
