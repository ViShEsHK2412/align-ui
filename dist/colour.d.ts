/**
 * Colour conversion, for the picker.
 *
 * The browser's eyedropper only ever hands back an sRGB hex string. Every other
 * format has to be computed, and OKLCH is the long one: sRGB → linear → LMS →
 * OKLab → polar. All pure, all testable.
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
 * The two matrices are Björn Ottosson's, unchanged. The cube root between them
 * is the whole trick — it is what makes a step in L look like the same step in
 * lightness at every hue, which plain HSL never manages.
 */
export declare function toOklch(rgb: Rgb): string;
/** Every format the picker offers, in the order it shows them. */
export declare function formats(hex: string): {
    label: string;
    value: string;
}[];
