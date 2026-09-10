/**
 * Box shadows, and the one filter that is safe to edit.
 *
 * A shadow is the only property on the list that is a *list*. Everything else
 * is one value with one control; this is an ordered stack where the layering is
 * the technique — a single shadow looks flat, and three with increasing blur
 * and decreasing opacity is what depth actually is. So it needs add, remove and
 * reorder, not a row.
 *
 * The parsing is here and pure, because the shape of a computed shadow is the
 * part most likely to be wrong and the part hardest to notice being wrong: the
 * browser normalises what you wrote into its own order, and a parser that
 * assumes the order you wrote it in works until the first time it does not.
 */
export interface Shadow {
    x: number;
    y: number;
    blur: number;
    spread: number;
    colour: string;
    /** Drawn inside the box rather than outside it. */
    inset: boolean;
}
export declare const EMPTY_SHADOW: Shadow;
/**
 * Split on a separator that is not inside brackets.
 *
 * `rgba(0, 0, 0, 0.2)` contains three commas, so splitting a shadow list on
 * every comma tears each colour into pieces and produces four layers where
 * there was one. This is why the naive version of this function is a bug
 * waiting for anyone who uses `rgba` — which is everyone.
 */
export declare function splitTopLevel(value: string, separator: string): string[];
/**
 * One layer, from whatever order the browser wrote it in.
 *
 * The lengths are taken in order and everything else is identified by what it
 * is rather than by where it sits: `inset` is a keyword wherever it appears,
 * and the colour is whatever is left. Chrome puts the colour first, Firefox
 * last, and the spec allows either.
 */
export declare function parseShadow(value: string): Shadow | null;
/** Every layer of a computed `box-shadow`, outermost first as written. */
export declare function parseShadows(value: string): Shadow[];
/** One layer, in the order every stylesheet writes it. */
export declare function formatShadow(s: Shadow): string;
/**
 * The stack, as a value.
 *
 * An empty stack is `none` rather than an empty string: an empty string removes
 * the declaration and lets whatever the stylesheet said come back, which is not
 * what "I deleted every layer" means.
 */
export declare function formatShadows(shadows: readonly Shadow[]): string;
/** Move a layer, for reordering. Out-of-range indices are left alone. */
export declare function moveLayer<T>(list: readonly T[], from: number, to: number): T[];
/**
 * The blur radius out of a `backdrop-filter`.
 *
 * Only blur, and only `backdrop-filter`. `filter` is excluded from the panel
 * on purpose: on an ancestor it creates a containing block and changes how
 * `fixed` children position, so the tool would be able to move things by
 * editing a property that does not look like it moves anything.
 * `backdrop-filter` creates no containing block, so the objection does not
 * reach it — and it is how every glass surface is built.
 */
export declare function parseBackdropBlur(value: string): number;
/**
 * Zero means none, not `blur(0px)`.
 *
 * `blur(0px)` still promotes the element to its own compositing layer and still
 * costs what a backdrop filter costs. A control returning to zero has to
 * actually remove the effect, or the panel leaves behind a performance
 * characteristic the page never had.
 */
export declare function formatBackdropBlur(px: number): string;
