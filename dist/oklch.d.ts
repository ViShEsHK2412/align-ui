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
export type Colour = {
    l: number;
    c: number;
    h: number;
    a: number;
};
export type Format = 'hex' | 'oklch' | 'p3';
export type Space = 'srgb' | 'p3';
type Triple = [number, number, number];
export declare const clamp: (n: number, min?: number, max?: number) => number;
export declare const wrapHue: (h: number) => number;
export declare function rgbToColour(rgb: Triple, a?: number, space?: Space): Colour;
export declare function colourToRgb(colour: Colour, space?: Space): Triple;
export declare function inGamut(colour: Colour, space?: Space): boolean;
/**
 * Reduce chroma until the colour fits the gamut, holding lightness and hue.
 *
 * Clipping the RGB channels instead would shift both — a too-vivid blue
 * clipped channel-wise comes back lighter and purpler. Twenty bisections get
 * within 0.5/2^20 of the boundary, which is far below a display step.
 */
export declare function fitGamut(colour: Colour, space?: Space): Colour;
/** The most chroma this lightness and hue can hold — the plane's right edge. */
export declare function maxChroma(l: number, h: number, space?: Space): number;
export declare function formatOf(value: string): Format;
export declare function formatColour(colour: Colour, format: Format): string;
/**
 * Hex, rgb(), hsl(), oklch() and color(display-p3 ...) — absolute colours only.
 *
 * No DOM, deliberately. The panel already has one colour parser that leans on
 * a canvas, and that one answers in sRGB bytes, which is exactly the precision
 * this picker exists to stop throwing away.
 */
export declare function parseColour(value: string): Colour | null;
/** A CSS colour for painting, always in gamut, always opaque where asked. */
export declare function css(colour: Colour, opaque?: boolean): string;
export {};
