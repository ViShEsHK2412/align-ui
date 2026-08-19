/**
 * Design tokens, written once.
 *
 * Colours are Fluid Functionalism's tokens converted to OKLCH. The panel gets
 * them as CSS `light-dark()` pairs and flips with `color-scheme`; the canvas
 * can't evaluate `light-dark()`, so it resolves the pair in JS instead.
 */
interface Pair {
    light: string;
    dark: string;
}
/** Canvas-side colours, resolved per theme. */
export declare const INK: {
    readonly accent: Pair;
    readonly measure: Pair;
    readonly surface: Pair;
    readonly fg: Pair;
    readonly muted: Pair;
    /** Guides get a hue of their own: measurements are red, selection is blue. */
    readonly guide: Pair;
    /** The ruler gutters: a surface, slightly translucent over the page. */
    readonly rulerBg: Pair;
    readonly rulerLine: Pair;
};
/**
 * The one place colour survives in the box model: each region's label, so the
 * label can't be mistaken for the region above it. Same hue in both themes,
 * with lightness set for contrast against the surface it sits on — L 0.72 on
 * white reads about 2.4:1, under the 4.5:1 floor for text.
 */
export declare const BAND_INK: {
    readonly margin: 'light-dark(oklch(0.44 0.13 70), oklch(0.8 0.13 70))';
    readonly border: 'light-dark(oklch(0.44 0.16 250), oklch(0.8 0.13 250))';
    readonly padding: 'light-dark(oklch(0.44 0.13 150), oklch(0.8 0.13 150))';
    readonly content: 'light-dark(oklch(0.44 0 0), oklch(0.8 0 0))';
};
/**
 * Fluid Functionalism's surface system (rule 6), applied to nested regions.
 *
 * Dark mode is the ladder verbatim: an additive white-opacity climb over
 * #171717, so each nested region reads one step nearer the viewer.
 *
 * Light mode can't be: Fluid's light ladder is flat #FFFFFF from surface-3 up
 * and lets *shadow* carry elevation, which works for a popover floating over a
 * page but gives nested regions inside one card nothing to separate them. So
 * light steps down through the neutral tokens the system already defines —
 * surface-1, --muted, --accent — inverting the direction while keeping the
 * same perceptual step size.
 *
 * Index 0 is the panel itself; 1-4 are margin, border, padding and content.
 */
export declare const NEST: readonly [Pair, Pair, Pair, Pair, Pair];
/** Written once here, read as CSS below. */
export declare const SEMANTIC: {
    readonly fg: Pair;
    readonly muted: Pair;
};
/** A colour pair as a CSS `light-dark()` — the one theming point (rule 7). */
export declare function themed(p: {
    light: string;
    dark: string;
}): string;
/** Background for a nesting level, as CSS. */
export declare const nest: (level: number) => string;
export declare function surfaceShadow(level: number, dark: boolean): string;
/**
 * Inter, with a system fallback that keeps working if the font is blocked.
 * `font-synthesis: none` (set on the panel) means a missing weight fails
 * visibly rather than being faked.
 */
export declare const FONT_STACK: string;
/**
 * Type scale, named by use rather than size. Nothing here goes below 11px, and
 * only the band tags do — everything you actually read a number from is 12px+.
 */
export declare const TYPE: {
    readonly title: 13;
    readonly body: 12;
    readonly tag: 11;
    readonly stack: string;
};
export declare const WEIGHT: {
    readonly regular: 400;
    readonly medium: 500;
    readonly semibold: 600;
};
/**
 * Inter has to be loaded at document level: `@font-face` inside a shadow root
 * is ignored, so a stylesheet in our own shadow CSS would never apply. Injected
 * on first activation rather than at init, so the tool still costs nothing at
 * rest, and removed again on teardown.
 *
 * If the host page blocks it (CSP, offline), the fallback stack takes over and
 * everything still reads correctly — it just isn't Inter.
 */
export declare function loadFont(): void;
export declare function unloadFont(): void;
/** Canvas needs the face resolved before it can measure text with it. */
export declare function whenFontReady(cb: () => void): void;
export type Ink = {
    -readonly [K in keyof typeof INK]: string;
};
/** Resolve every pair for the viewer's current theme. */
export declare function ink(dark: boolean): Ink;
export declare function prefersDark(): boolean;
/** `oklch(...)` → `oklch(... / alpha)`, so alphas stay in the same colour space. */
export declare function alpha(color: string, a: number): string;
export {};
