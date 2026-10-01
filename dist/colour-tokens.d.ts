/**
 * The page's colour tokens, for the picker to offer.
 *
 * A picker that only knows hex hands back `#2563eb`, and a hardcoded colour is
 * how a palette erodes, one "close enough" at a time. Toolcraft's palette
 * control makes the same argument for a design system: pick the token, not the
 * value. The spacing lint already names tokens; the picker should offer them.
 *
 * Custom properties come back from getComputedStyle as written, so an alias
 * reads `var(--blue-600)`, not a colour. Aliases are followed, a few hops
 * deep, so `--primary` shows the blue it actually is. Pure: tokens in, tokens
 * out, with the parsing passed in so the rules can be tested without a DOM.
 */
export interface ColourToken {
    name: string;
    /** The colour it resolves to, as CSS. */
    value: string;
    /** The token it points at, when it is an alias. */
    via?: string;
}
export declare function colourTokens(tokens: readonly {
    name: string;
    value: string;
}[], isColour: (value: string) => boolean): ColourToken[];
/** The token a written value names, if it is exactly `var(--x)`. */
export declare function tokenIn(value: string): string | null;
/** Keep the tokens whose name contains every word typed, in order of the page. */
export declare function filterTokens(list: readonly ColourToken[], query: string): ColourToken[];
