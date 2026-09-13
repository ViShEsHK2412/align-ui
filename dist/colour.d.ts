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
export interface Rgb {
    r: number;
    g: number;
    b: number;
}
/** `#3b6fe0` or `#39f` → channels in 0–255. Null if it isn't a hex colour. */
export declare function parseHex(hex: string): Rgb | null;
export declare function toHex({ r, g, b }: Rgb): string;
export declare function toRgb({ r, g, b }: Rgb): string;
export declare function toHsl({ r, g, b }: Rgb): string;
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
export declare function toOklch(rgb: Rgb): string;
/** Every format the picker offers, in the order it shows them. */
export declare function formats(hex: string): {
    label: string;
    value: string;
}[];
