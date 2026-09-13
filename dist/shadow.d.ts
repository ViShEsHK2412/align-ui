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
/**
 * A new shadow, at rest.
 *
 * Every number is zero, deliberately. This used to open at 0 2px 8px, which is
 * a perfectly nice shadow and exactly the problem: the panel had picked one for
 * you and then showed you its numbers as though you had. You would drag y and
 * be adjusting someone else's 2px rather than setting your own. Zero is the
 * only starting point that is not an opinion - the layer exists, draws nothing,
 * and every pixel after that is yours.
 *
 * The colour is not zero, because a transparent shadow could never become
 * visible by dragging the lengths, and a control that cannot do anything until
 * you find the one field that unlocks it is a trap rather than a default.
 */
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
export type Edge = 'top' | 'right' | 'bottom' | 'left';
/** `all` is the ordinary four-sided shadow, and the absence of confinement. */
export type Side = Edge | 'all';
/**
 * Which edge this shadow actually shows on, derived rather than remembered.
 *
 * Derived, because the four numbers are editable on their own. A side stored
 * as its own field would be a fifth piece of state that the first drag of the
 * y slider makes a lie, and the panel would then be reporting a shadow that
 * is not the one on the page.
 */
export declare function sideOf(s: Shadow): Side;
/**
 * Put a shadow on one edge, keeping as much of it as the geometry allows.
 *
 * The spread is set to the smallest magnitude that can hide three edges, which
 * is half the blur. Tightening it further would only eat into the shadow.
 */
export declare function confineToSide(s: Shadow, side: Side): Shadow;
/**
 * The same confinement, said the way it actually is.
 *
 * Four sides is one too many ideas. Top and bottom are not two settings, they
 * are one axis and the sign of `y`; left and right are the same for `x`. A
 * panel offering all four asks you to choose something you have already
 * chosen, and then disagrees with the slider when you drag it past zero.
 *
 * So the choice is the axis, and the direction stays where it was always
 * legible: on the offset itself. Drag `y` negative and the shadow is above the
 * element, because that is what a negative `y` means everywhere else in CSS.
 */
export type Axis = 'x' | 'y';
export type Confine = Axis | 'all';
/** Which axis this shadow is confined to, derived like `sideOf` is. */
export declare function axisOf(s: Shadow): Confine;
export declare function confineToAxis(s: Shadow, axis: Confine): Shadow;
