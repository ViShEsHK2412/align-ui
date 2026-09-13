import { describe, expect, it } from 'vitest';
import {
  clamp, fitGamut, formatColour, formatOf, inGamut, maxChroma,
  parseColour, rgbToColour, wrapHue, type Colour,
} from './oklch';

/**
 * The colour space behind the editor's picker.
 *
 * Two things are being proved. That the conversion matches the published
 * reference values, because a colour space nobody checked against the spec is
 * just some matrices. And that a round trip through it is lossless in hex,
 * because the picker reads a page's colour, shows it, and writes it back — and
 * an element that drifts a digit every time the panel looks at it would be the
 * tool changing the page by observing it.
 */

const hex = (c: Colour | null): string => formatColour(c!, 'hex');

describe('parseColour', () => {
  it('round-trips every hex it is given, byte for byte', () => {
    // The tool's own tokens are in here: a drift of one digit in either would
    // show up as the panel rewriting a colour it was only asked to display.
    for (const value of [
      '#000000', '#ffffff', '#1a1a1a', '#fafafa', '#cbd3e1', '#232833',
      '#0d99ff', '#ff0000', '#00ff00', '#0000ff', '#7f3fbf', '#3b6fe0',
    ]) {
      expect(hex(parseColour(value))).toBe(value);
    }
  });

  it('expands the three- and four-digit forms', () => {
    expect(hex(parseColour('#39f'))).toBe('#3399ff');
    expect(hex(parseColour('#39f8'))).toBe('#3399ff88');
  });

  it('matches the published OKLCH for sRGB red', () => {
    // Ottosson's reference: L 0.6279, C 0.2577, h 29.23.
    const red = parseColour('#ff0000')!;
    expect(red.l).toBeCloseTo(0.6279, 3);
    expect(red.c).toBeCloseTo(0.2577, 3);
    expect(red.h).toBeCloseTo(29.23, 1);
  });

  it('matches the published OKLCH for sRGB blue', () => {
    const blue = parseColour('#0000ff')!;
    expect(blue.l).toBeCloseTo(0.4520, 3);
    expect(blue.c).toBeCloseTo(0.3132, 3);
    expect(blue.h).toBeCloseTo(264.05, 1);
  });

  it('puts white at lightness 1 and black at 0, both without chroma', () => {
    expect(parseColour('#ffffff')!.l).toBeCloseTo(1, 4);
    expect(parseColour('#000000')!.l).toBeCloseTo(0, 4);
    expect(parseColour('#ffffff')!.c).toBeLessThan(1e-6);
    expect(parseColour('#000000')!.c).toBeLessThan(1e-6);
  });

  it('reports no hue for a grey rather than one invented from rounding', () => {
    // atan2 of two rounding errors is a uniformly random angle. Left alone, a
    // grey picks up a different hue on every round trip and the hue strip
    // jumps each time the panel re-reads it.
    expect(parseColour('#808080')!.h).toBe(0);
    expect(parseColour('#808080')!.c).toBe(0);
  });

  it('reads every notation a page might already be written in', () => {
    expect(hex(parseColour('rgb(255, 0, 0)'))).toBe('#ff0000');
    expect(hex(parseColour('rgb(255 0 0)'))).toBe('#ff0000');
    expect(hex(parseColour('rgba(255, 0, 0, 0.5)'))).toBe('#ff000080');
    expect(hex(parseColour('rgb(255 0 0 / 50%)'))).toBe('#ff000080');
    expect(hex(parseColour('hsl(120, 100%, 50%)'))).toBe('#00ff00');
    expect(hex(parseColour('hsl(120deg 100% 50%)'))).toBe('#00ff00');
    expect(hex(parseColour('oklch(0.6279 0.2577 29.23)'))).toBe('#ff0000');
    expect(parseColour('color(display-p3 1 0 0)')).not.toBeNull();
  });

  it('reads the hue units CSS allows', () => {
    const deg = parseColour('hsl(180deg 100% 50%)')!;
    for (const same of ['hsl(0.5turn 100% 50%)', 'hsl(200grad 100% 50%)']) {
      expect(parseColour(same)!.h).toBeCloseTo(deg.h, 4);
    }
  });

  it('treats transparent as a colour with no alpha', () => {
    expect(parseColour('transparent')).toEqual({ l: 0, c: 0, h: 0, a: 0 });
  });

  it('refuses anything it cannot read, rather than guessing', () => {
    // The caller writes the result to an element. A wrong guess is a
    // transparent element and the panel would have caused it, so every one of
    // these has to come back null rather than nearly-right.
    for (const bad of [
      '', '   ', 'nonsense', '#12345', '#xyzxyz', 'rgb(1, 2)', 'rgb(1,2,3,4,5)',
      'oklch()', 'hsl(120, 100, 50)', 'rgb(50%, 0, 0)', 'color(srgb 1 0 0)',
      'color(display-p3 1 0)', 'var(--brand)', 'currentColor', 'inherit',
    ]) {
      expect(parseColour(bad)).toBeNull();
    }
  });
});

describe('formatColour', () => {
  it('emits each format in its own notation', () => {
    const red = parseColour('#ff0000')!;
    expect(formatColour(red, 'hex')).toBe('#ff0000');
    expect(formatColour(red, 'oklch')).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
    expect(formatColour(red, 'p3')).toMatch(/^color\(display-p3 [\d.]+ [\d.]+ [\d.]+\)$/);
  });

  it('only writes an alpha when there is one to write', () => {
    const red = parseColour('#ff0000')!;
    expect(formatColour(red, 'hex')).toBe('#ff0000');
    expect(formatColour({ ...red, a: 0.5 }, 'hex')).toBe('#ff000080');
    expect(formatColour({ ...red, a: 0.5 }, 'oklch')).toContain(' / 0.5');
    expect(formatColour(red, 'oklch')).not.toContain('/');
  });

  it('survives a round trip through oklch notation', () => {
    for (const value of ['#3b6fe0', '#cbd3e1', '#232833']) {
      const asOklch = formatColour(parseColour(value)!, 'oklch');
      expect(hex(parseColour(asOklch))).toBe(value);
    }
  });
});

describe('formatOf', () => {
  it('names the notation a value is written in', () => {
    expect(formatOf('#ff0000')).toBe('hex');
    expect(formatOf('oklch(0.5 0.1 264)')).toBe('oklch');
    expect(formatOf('color(display-p3 1 0 0)')).toBe('p3');
    // Anything else is shown as hex, which is the one every browser accepts.
    expect(formatOf('rgb(255 0 0)')).toBe('hex');
  });
});

describe('maxChroma', () => {
  it('leaves no unusable column in the picker plane', () => {
    // The whole reason the plane is OKLCH rather than an HSV square: every row
    // is normalised to the chroma available at that lightness, so the right
    // edge is always a real colour instead of a band of clipping.
    for (let l = 0.05; l < 1; l += 0.05) {
      expect(maxChroma(l, 264)).toBeGreaterThan(0);
    }
  });

  it('peaks in the middle of the ramp and vanishes at both ends', () => {
    expect(maxChroma(0, 264)).toBe(0);
    expect(maxChroma(1, 264)).toBe(0);
    const mid = maxChroma(0.5, 264);
    expect(mid).toBeGreaterThan(maxChroma(0.1, 264));
    expect(mid).toBeGreaterThan(maxChroma(0.9, 264));
  });

  it('gives Display P3 more room than sRGB', () => {
    expect(maxChroma(0.5, 264, 'p3')).toBeGreaterThan(maxChroma(0.5, 264, 'srgb'));
  });
});

describe('fitGamut', () => {
  const wild: Colour = { l: 0.7, c: 0.4, h: 264, a: 1 };

  it('holds lightness and hue while it cuts chroma', () => {
    // Clipping the RGB channels instead shifts both: a too-vivid blue comes
    // back lighter and purpler, which is a different colour, not a nearer one.
    const fitted = fitGamut(wild, 'srgb');
    expect(fitted.l).toBe(wild.l);
    expect(fitted.h).toBe(wild.h);
    expect(fitted.c).toBeLessThan(wild.c);
    expect(inGamut(fitted, 'srgb')).toBe(true);
  });

  it('leaves a colour that already fits completely alone', () => {
    const inside = parseColour('#3b6fe0')!;
    expect(fitGamut(inside, 'srgb')).toBe(inside);
  });

  it('lands on the boundary rather than well inside it', () => {
    const fitted = fitGamut(wild, 'srgb');
    // Twenty bisections; anything past the edge must fail.
    expect(inGamut({ ...fitted, c: fitted.c + 0.002 }, 'srgb')).toBe(false);
  });
});

describe('the small helpers', () => {
  it('clamps', () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(2)).toBe(1);
    expect(clamp(5, 0, 360)).toBe(5);
  });

  it('wraps a hue into one turn, in both directions', () => {
    expect(wrapHue(0)).toBe(0);
    expect(wrapHue(360)).toBe(0);
    expect(wrapHue(400)).toBe(40);
    expect(wrapHue(-40)).toBe(320);
  });

  it('takes rgb channels as fractions, not bytes', () => {
    expect(rgbToColour([1, 1, 1]).l).toBeCloseTo(1, 4);
    expect(rgbToColour([0, 0, 0]).l).toBeCloseTo(0, 4);
  });
});

describe('purity', () => {
  it('touches no DOM, so the picker can be reasoned about without one', () => {
    // Same guard cluster.ts carries. The panel has one colour reader that
    // leans on a canvas, and that one answers in sRGB bytes — which is exactly
    // the precision this module exists to stop throwing away.
    const source = new URL('./oklch.ts', import.meta.url);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const text = require('node:fs').readFileSync(source, 'utf8') as string;
    // Comments stripped first. The file explains at length why it avoids the
    // DOM, and a guard that cannot tell an explanation from a call would fail
    // on the very sentence promising it does not make one.
    const code = text
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
    for (const forbidden of ['document', 'window', 'getComputedStyle', 'canvas']) {
      expect(code).not.toContain(forbidden);
    }
  });
});
