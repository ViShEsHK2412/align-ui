/**
 * CSS colour maths in OKLCH.
 *
 * Ported from DialKit's `src/color.ts` (Josh Puckett, MIT), which is itself
 * the CSS Color 4 conversion code with the D65 reference white. Kept rather
 * than rewritten because the matrices are the specification's and there is no
 * second correct answer for them.
 *
 * Why OKLCH and not the HSV square every native picker shows: in HSV the top
 * and left of the field are wasted, because most of that square is not a
 * colour the display can make at that hue. OKLCH separates perceived
 * lightness from chroma, so the plane can be normalised per row against the
 * chroma actually available there. Every pixel of the field is then a colour
 * you can pick. That is DialKit's idea and it is the reason this file exists
 * at all.
 *
 * The panel's own tokens are already written in `oklch()` (see theme.ts INK),
 * so this is the notation the project uses, not a second one introduced here.
 *
 * `colour.ts` is the other half and the older one: a one-way formatter that
 * turns the eyedropper's hex into four display strings. Its `toOklch` now
 * delegates here, so there is exactly one sRGB-to-OKLCH conversion in the
 * repo. The two routes — Ottosson's direct matrix and the CSS Color 4 path
 * through XYZ — were measured against each other over 3000 random colours
 * and agreed to 5e-5, which is the 4-decimal rounding and nothing else.
 */

export type Colour = { l: number; c: number; h: number; a: number };
export type Format = 'hex' | 'oklch' | 'p3';
export type Space = 'srgb' | 'p3';
type Triple = [number, number, number];

export const clamp = (n: number, min = 0, max = 1): number =>
  Math.max(min, Math.min(max, n));

export const wrapHue = (h: number): number => ((h % 360) + 360) % 360;

const multiply = (m: number[][], v: Triple): Triple =>
  m.map((row) => row.reduce((n, x, i) => n + x * v[i]!, 0)) as Triple;

/** sRGB transfer function, and its inverse. Both are odd, hence the sign. */
const linearize = (v: number): number =>
  Math.abs(v) <= 0.04045
    ? v / 12.92
    : Math.sign(v) * ((Math.abs(v) + 0.055) / 1.055) ** 2.4;

const encode = (v: number): number =>
  Math.abs(v) <= 0.0031308
    ? 12.92 * v
    : Math.sign(v) * (1.055 * Math.abs(v) ** (1 / 2.4) - 0.055);

const RGB_XYZ = [
  [0.4123907993, 0.3575843394, 0.1804807884],
  [0.2126390059, 0.7151686788, 0.0721923154],
  [0.0193308187, 0.1191947798, 0.9505321522],
];
const P3_XYZ = [
  [0.4865709486, 0.2656676932, 0.1982172852],
  [0.2289745641, 0.6917385218, 0.0792869141],
  [0, 0.0451133819, 1.0439443689],
];
const XYZ_RGB = [
  [3.2409699419, -1.5373831776, -0.4986107603],
  [-0.9692436363, 1.8759675015, 0.0415550574],
  [0.0556300797, -0.2039769589, 1.0569715142],
];
const XYZ_P3 = [
  [2.4934969119, -0.9313836179, -0.4027107845],
  [-0.8294889696, 1.7626640603, 0.0236246858],
  [0.0358458302, -0.0761723893, 0.956884524],
];
const XYZ_LMS = [
  [0.819022438, 0.3619062601, -0.1288737815],
  [0.0329836539, 0.9292868616, 0.0361446664],
  [0.0481771894, 0.2642395318, 0.6335478285],
];
const LMS_XYZ = [
  [1.2268798734, -0.5578149966, 0.2813910502],
  [-0.0405757626, 1.1122868294, -0.0717110667],
  [-0.0763729497, -0.421493324, 1.5869240244],
];

export function rgbToColour(rgb: Triple, a = 1, space: Space = 'srgb'): Colour {
  const xyz = multiply(space === 'p3' ? P3_XYZ : RGB_XYZ, rgb.map(linearize) as Triple);
  const [l, m, s] = multiply(XYZ_LMS, xyz).map(Math.cbrt) as Triple;
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(A, B);
  /*
   * Below that epsilon the hue angle is the arctangent of two rounding errors.
   * Reporting 0 keeps grey grey instead of letting it drift to a random hue
   * every time it makes a round trip.
   */
  return {
    l: clamp(L),
    c: c < 1e-7 ? 0 : c,
    h: c < 1e-7 ? 0 : wrapHue((Math.atan2(B, A) * 180) / Math.PI),
    a: clamp(a),
  };
}

export function colourToRgb(colour: Colour, space: Space = 'srgb'): Triple {
  const a = colour.c * Math.cos((colour.h * Math.PI) / 180);
  const b = colour.c * Math.sin((colour.h * Math.PI) / 180);
  const lms: Triple = [
    (colour.l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (colour.l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (colour.l - 0.0894841775 * a - 1.291485548 * b) ** 3,
  ];
  return multiply(space === 'p3' ? XYZ_P3 : XYZ_RGB, multiply(LMS_XYZ, lms))
    .map(encode) as Triple;
}

export function inGamut(colour: Colour, space: Space = 'srgb'): boolean {
  return colourToRgb(colour, space).every((n) => n >= -0.00001 && n <= 1.00001);
}

/**
 * Reduce chroma until the colour fits the gamut, holding lightness and hue.
 *
 * Clipping the RGB channels instead would shift both — a too-vivid blue
 * clipped channel-wise comes back lighter and purpler. Twenty bisections get
 * within 0.5/2^20 of the boundary, which is far below a display step.
 */
export function fitGamut(colour: Colour, space: Space = 'srgb'): Colour {
  if (inGamut(colour, space)) return colour;
  let lo = 0;
  let hi = colour.c;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut({ ...colour, c: mid }, space)) lo = mid;
    else hi = mid;
  }
  return { ...colour, c: lo };
}

/** The most chroma this lightness and hue can hold — the plane's right edge. */
export function maxChroma(l: number, h: number, space: Space = 'srgb'): number {
  if (l <= 0 || l >= 1) return 0;
  return fitGamut({ l, c: 0.5, h, a: 1 }, space).c;
}

export function formatOf(value: string): Format {
  const v = value.trim();
  return /^oklch\(/i.test(v) ? 'oklch' : /^color\(display-p3\s/i.test(v) ? 'p3' : 'hex';
}

const round = (v: number, digits = 4): number => Number(v.toFixed(digits));

export function formatColour(colour: Colour, format: Format): string {
  const alpha = colour.a < 1 ? ` / ${round(colour.a)}` : '';
  if (format === 'oklch') {
    return `oklch(${round(colour.l)} ${round(colour.c)} ${round(colour.h, 2)}${alpha})`;
  }
  const space: Space = format === 'p3' ? 'p3' : 'srgb';
  const rgb = colourToRgb(fitGamut(colour, space), space);
  if (format === 'p3') {
    return `color(display-p3 ${rgb.map((n) => round(clamp(n), 5)).join(' ')}${alpha})`;
  }
  const bytes = rgb.map((n) => Math.round(clamp(n) * 255));
  if (colour.a < 1) bytes.push(Math.round(colour.a * 255));
  return '#' + bytes.map((n) => n.toString(16).padStart(2, '0')).join('');
}

const NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?(%|deg|grad|rad|turn)?$/i;

function number(value: string, percentScale = 1, hue = false): number | null {
  const match = value.match(NUMBER);
  if (!match) return null;
  const n = parseFloat(value);
  if (!Number.isFinite(n)) return null;
  const unit = match[1]?.toLowerCase();
  if (hue) {
    return unit === 'rad' ? (n * 180) / Math.PI
      : unit === 'turn' ? n * 360
      : unit === 'grad' ? n * 0.9
      : !unit || unit === 'deg' ? n
      : null;
  }
  return unit === '%' ? (n * percentScale) / 100 : !unit ? n : null;
}

/**
 * Hex, rgb(), hsl(), oklch() and color(display-p3 ...) — absolute colours only.
 *
 * No DOM, deliberately. The panel already has one colour parser that leans on
 * a canvas, and that one answers in sRGB bytes, which is exactly the precision
 * this picker exists to stop throwing away.
 */
export function parseColour(value: string): Colour | null {
  const text = value.trim().toLowerCase();
  if (text === 'transparent') return { l: 0, c: 0, h: 0, a: 0 };
  if (/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/.test(text)) {
    let hex = text.slice(1);
    if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('');
    const bytes = hex.match(/../g)!.map((c) => parseInt(c, 16) / 255);
    return rgbToColour(bytes.slice(0, 3) as Triple, bytes[3] ?? 1);
  }
  const match = text.match(/^(oklch|rgb|rgba|hsl|hsla|color)\(([^()]*)\)$/);
  if (!match) return null;
  const kind = match[1]!;
  let body = match[2]!.trim();
  const p3 = kind === 'color';
  if (p3) {
    if (!body.startsWith('display-p3 ')) return null;
    body = body.slice(11).trim();
  }
  const legacy = body.includes(',');
  if (legacy && (p3 || kind === 'oklch' || body.includes('/'))) return null;
  const parts = legacy ? body.split(',').map((x) => x.trim()) : body.split(/\s*\/\s*/);
  if (!legacy && parts.length > 2) return null;
  const channels = legacy ? parts.slice(0, 3) : parts[0]!.split(/\s+/);
  if (channels.length !== 3) return null;
  if (legacy && parts.length !== 3 && parts.length !== 4) return null;
  // rgb() forbids mixing percentages and bytes.
  if (legacy && kind.startsWith('rgb')
    && channels.some((c) => c.endsWith('%')) && !channels.every((c) => c.endsWith('%'))) {
    return null;
  }
  const alphaText = legacy ? parts[3] : parts[1];
  const alpha = alphaText === undefined ? 1 : number(alphaText);
  if (alpha === null) return null;
  if (kind === 'oklch') {
    const l = number(channels[0]!);
    const c = number(channels[1]!, 0.4);
    const h = number(channels[2]!, 1, true);
    if (l === null || c === null || h === null) return null;
    return { l: clamp(l), c: Math.max(0, c), h: wrapHue(h), a: clamp(alpha) };
  }
  if (kind.startsWith('hsl')) {
    const h = number(channels[0]!, 1, true);
    const s = number(channels[1]!);
    const l = number(channels[2]!);
    if (h === null || s === null || l === null) return null;
    if (!channels[1]!.endsWith('%') || !channels[2]!.endsWith('%')) return null;
    const sat = clamp(s);
    const light = clamp(l);
    const k0 = sat * Math.min(light, 1 - light);
    const f = (n: number): number => {
      const k = (n + wrapHue(h) / 30) % 12;
      return light - k0 * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return rgbToColour([f(0), f(8), f(4)], alpha);
  }
  const values = channels.map((c) => number(c, p3 ? 1 : 255));
  if (values.some((n) => n === null)) return null;
  return rgbToColour(
    values.map((n) => (p3 ? n! : clamp(n! / 255))) as Triple,
    alpha,
    p3 ? 'p3' : 'srgb',
  );
}

/** A CSS colour for painting, always in gamut, always opaque where asked. */
export function css(colour: Colour, opaque = false): string {
  return formatColour(opaque ? { ...colour, a: 1 } : colour, 'oklch');
}
