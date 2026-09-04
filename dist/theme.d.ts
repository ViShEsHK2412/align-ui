/**
 * Design tokens, written once.
 *
 * Two colour systems, because there are two kinds of surface.
 *
 * The **canvas** draws over someone else's page, so its colours are solid hues
 * with fixed meanings — red is a measurement, blue a selection, cyan a guide —
 * resolved per theme in JS, since canvas cannot evaluate `light-dark()`.
 *
 * The **panels** are our own surfaces, and they are built as a film of alpha
 * laid over an opaque ground, the way Agentation builds its toolbar. The film
 * is what makes one set of numbers work in both themes: white over a dark
 * ground, black over a light one, same alphas. Fluid Functionalism's ladder,
 * which this replaces, could not do that — its light ladder is flat white from
 * surface-3 up and lets shadow carry elevation, which leaves nested regions
 * inside one card with nothing to separate them, so light mode had to be
 * hand-inverted. Alpha removes that whole problem.
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
    /**
     * The pixel texture. Its own pair rather than a faded `rulerLine`, because
     * `alpha()` appends a slash-alpha and cannot fade a colour that already has
     * one — `oklch(... / 0.28 / 0.5)` does not parse, and canvas answers an
     * unparseable colour by silently keeping the last one it was given.
     */
    readonly pixelLine: Pair;
};
/**
 * Colours we author in OKLCH already render in the widest gamut the display
 * offers, so Agentation's explicit `color(display-p3 …)` block — which it needs
 * because it authors in hex — would be redundant here. The benefit is taken;
 * the code for it is not.
 */
/** A colour pair as a CSS `light-dark()` — the one theming point. */
export declare function themed(p: {
    light: string;
    dark: string;
}): string;
/** What every panel sits on. Everything else is a film laid over this. */
export declare const GROUND: string;
export declare function surface(level: number): string;
/**
 * Three text levels rather than two. A panel with a header, band labels,
 * numbers, a type readout and a token line has more than two things to say,
 * and dialkit's system is explicit that three is where it settles.
 */
export declare const TEXT: {
    readonly primary: string;
    readonly secondary: string;
    readonly tertiary: string;
};
/** A hairline of the same film, for rules between sections. */
export declare const HAIRLINE: string;
/**
 * Agentation's shadow: two soft layers, no ring. Depth comes from the surface
 * ladder, so the shadow only has to lift the panel off the page.
 */
export declare const SHADOW = "0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)";
/** While dragging, it lifts. */
export declare const SHADOW_LIFTED = "0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)";
/** The ruler gutter's thickness, shared by what draws it and what dodges it. */
export declare const RULER = 22;
/** One row height, so the toolbar and the panel share a rhythm. */
export declare const ROW = 36;
/** Agentation's spacing: 2, 4, 8. Nothing between, nothing beyond. */
export declare const SPACE: readonly [2, 4, 8];
/**
 * Motion, from Agentation's toolbar. The expand curve is expo-out, which lands
 * a width change without the tail an ease-out leaves; the entrance overshoots
 * a little, which is the only place in the tool anything does.
 */
export declare const MOTION: {
    readonly expand: '400ms cubic-bezier(0.19, 1, 0.22, 1)';
    readonly enter: '500ms cubic-bezier(0.34, 1.2, 0.64, 1)';
    /** Slow in, faster out: an exit is not a reversed entrance. */
    readonly exit: '160ms cubic-bezier(0.3, 0, 1, 1)';
    /**
     * The tier Agentation does not have, because it does not need it.
     *
     * `enter` overshoots over half a second, which is right for a toolbar that
     * unfolds once. The box model appears on every single lock, dozens of times
     * a minute, and at that frequency an overshoot stops reading as character
     * and starts reading as lag. Critically damped, and inside Apple's 0.3-0.4s
     * response band for something you touch directly.
     */
    readonly ui: '160ms cubic-bezier(0.2, 0, 0, 1)';
};
/**
 * Inter, with a system fallback that keeps working if the font is blocked.
 * `font-synthesis: none` (set on the panel) means a missing weight fails
 * visibly rather than being faked.
 */
export declare const FONT_STACK: string;
/**
 * Type scale, named by use rather than size.
 *
 * Agentation's scale bottoms out at 10px. Ours stops at 11, and that is
 * deliberate: everything you read a number from is 12px or larger, and a
 * measuring tool whose numbers are hard to read has failed at the only thing
 * it does.
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
/**
 * Is the page we are drawing over dark?
 *
 * Not the same question as `prefers-color-scheme`, and asking that one instead
 * is a mistake worth spelling out: a page is free to be dark on a machine set
 * to light, and plenty are — a docs site with its own toggle, a product whose
 * brand is dark, a demo that simply hard-codes it. Trust the media query and
 * you draw light-theme ink on a dark page, where a 14% black hairline is
 * invisible and every reading you came for is unreadable.
 *
 * Three sources, strongest first:
 *
 *  1. An explicit `color-scheme` on the root. A page that says `dark` has
 *     stated its intent, and the browser has already believed it.
 *  2. The background actually painted behind the page — body's if it has one,
 *     otherwise the root's. This is what the eye sees, so it is what the
 *     overlay has to contrast against.
 *  3. The media query, when the page is transparent and says nothing.
 */
export declare function pageIsDark(): boolean;
/** `oklch(...)` → `oklch(... / alpha)`, so alphas stay in the same colour space. */
export declare function alpha(color: string, a: number): string;
export {};
