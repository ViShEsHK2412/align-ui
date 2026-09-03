/**
 * Colour conversion, for the picker.
 *
 * The browser's eyedropper only ever hands back an sRGB hex string. Every other
 * format has to be computed, and OKLCH is the long one: sRGB → linear → LMS →
 * OKLab → polar. All pure, all testable.
 */

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

/** sRGB's transfer function, undone. Everything below happens in light, not code. */
function linearise(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/**
 * OKLCH: perceptual lightness, chroma and hue.
 *
 * The two matrices are Björn Ottosson's, unchanged. The cube root between them
 * is the whole trick — it is what makes a step in L look like the same step in
 * lightness at every hue, which plain HSL never manages.
 */
export function toOklch(rgb: Rgb): string {
  const r = linearise(rgb.r), g = linearise(rgb.g), b = linearise(rgb.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const chroma = Math.sqrt(A * A + B * B);
  let hue = (Math.atan2(B, A) * 180) / Math.PI;
  if (hue < 0) hue += 360;
  // A grey has no hue to report, and atan2 on rounding noise invents one.
  if (chroma < 0.0001) return `oklch(${trim(L, 4)} 0 0)`;
  return `oklch(${trim(L, 4)} ${trim(chroma, 4)} ${trim(hue, 2)})`;
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
