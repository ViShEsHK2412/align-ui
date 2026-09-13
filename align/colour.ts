/**
 * Colour readout, for the eyedropper.
 *
 * The browser's eyedropper only ever hands back an sRGB hex string. Every other
 * format has to be computed, and this turns one hex into the four the card
 * shows. All pure, all testable.
 *
 * One way only. `oklch.ts` is the other half: a real colour space, parsing and
 * formatting in both directions with gamut mapping, which is what the editor's
 * picker needs to read a value off a page and write it back unchanged. This
 * module does the arithmetic it still owns and borrows the rest.
 */

import { rgbToColour } from './oklch';

export interface Rgb { r: number; g: number; b: number }

/** `#3b6fe0` or `#39f` → channels in 0–255. Null if it isn't a hex colour. */
export function parseHex(hex: string): Rgb | null {
  const s = hex.trim().replace(/^#/, '');
  const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function toHex({ r, g, b }: Rgb): string {
  const two = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${two(r)}${two(g)}${two(b)}`;
}

export function toRgb({ r, g, b }: Rgb): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

/** Round to `places`, then drop a trailing `.0`. */
function trim(n: number, places: number): string {
  return String(Number(n.toFixed(places)));
}

export function toHsl({ r, g, b }: Rgb): string {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    // Saturation folds around mid lightness: the same spread of channels is a
    // stronger colour near the middle than it is near black or white.
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return `hsl(${trim(h, 1)} ${trim(s * 100, 1)}% ${trim(l * 100, 1)}%)`;
}


/**
 * OKLCH: perceptual lightness, chroma and hue.
 *
 * The conversion itself lives in `oklch.ts`, which the editor's colour picker
 * needs bidirectionally and with gamut mapping. This used to carry a second
 * copy — Ottosson's direct sRGB matrix rather than the CSS Color 4 route
 * through XYZ. Both are correct, and over 3000 random colours they agreed to
 * 5e-5, which is this function's own rounding. Two right answers to one
 * question is still one too many, so there is now a single implementation and
 * these tests prove it.
 *
 * The formatting stays here, because it is a readout: four decimals of
 * lightness and chroma, two of hue, and no hue at all for a grey.
 */
export function toOklch(rgb: Rgb): string {
  const { l, c, h } = rgbToColour([rgb.r / 255, rgb.g / 255, rgb.b / 255]);
  // A grey has no hue to report, and atan2 on rounding noise invents one.
  if (c < 0.0001) return `oklch(${trim(l, 4)} 0 0)`;
  return `oklch(${trim(l, 4)} ${trim(c, 4)} ${trim(h, 2)})`;
}

/** Every format the picker offers, in the order it shows them. */
export function formats(hex: string): { label: string; value: string }[] {
  const rgb = parseHex(hex);
  if (!rgb) return [];
  return [
    { label: 'hex', value: toHex(rgb) },
    { label: 'rgb', value: toRgb(rgb) },
    { label: 'hsl', value: toHsl(rgb) },
    { label: 'oklch', value: toOklch(rgb) },
  ];
}
