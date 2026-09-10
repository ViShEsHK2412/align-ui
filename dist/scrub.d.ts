import { type IconName } from './icons';
/**
 * A number you scrub.
 *
 * The second number control, and it exists because the first one is wrong for
 * half the panel. A slider shows where a value sits in a range, which is what
 * you want for opacity, a font weight or a colour channel — all of which have
 * ends that mean something. Padding does not. There is no maximum padding, so
 * a slider has to invent one, spend most of its travel on values nobody sets,
 * and take a hundred and fifty pixels doing it. Four of those in a 320px panel
 * is why the box section felt cramped no matter how it was spaced.
 *
 * This is the control Figma uses for the same job, and interface-kit's
 * `BoxSpacingControl` is the same idea: a compact badge showing the number,
 * dragged sideways to change it and clicked to type one. It takes the width of
 * its own digits, it has no invented range, and the gesture is unbounded — you
 * keep dragging and it keeps going.
 *
 * Two details worth keeping from theirs:
 *
 *  - **The drag axis follows the edge.** The top and bottom fields scrub
 *    vertically, the left and right ones horizontally, so the pointer moves
 *    the way the padding grows. The cursor says which before you press.
 *  - **A drag is not a click.** Past three pixels the gesture is a scrub and
 *    the click that follows is swallowed, or every scrub would end by opening
 *    a text field.
 */
/** Pointer pixels per unit. Two is interface-kit's, and it feels right. */
export declare const SENSITIVITY = 2;
/** Past this, the gesture is a drag and never becomes a click. */
export declare const DRAG_SLOP = 3;
/** Where a scrub lands, given where it started and how far the pointer moved. */
export declare function scrubbed(start: number, deltaPx: number, min: number, max: number, step?: number): number;
/**
 * A typed value, or null when it is not one.
 *
 * Units are accepted and ignored rather than refused: the field shows `24` and
 * people type `24px` because that is what they would write in a stylesheet.
 * Refusing that would be correct and useless.
 */
export declare function parseScrub(text: string, min: number, max: number): number | null;
/** Two decimals at most, and no trailing zeros: `24`, not `24.00`. */
export declare function formatScrub(value: number): string;
export interface ScrubOptions {
    /** Named for a screen reader; the glyph carries it visually. */
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    /** Which way the pointer moves to increase it. */
    axis?: 'x' | 'y';
    /** The edge glyph, when there is one. */
    glyph?: IconName;
    /** Shown instead of a glyph, for the corners. */
    text?: string;
    onChange: (value: number) => void;
    onCommit?: (value: number) => void;
}
export interface Scrub {
    el: HTMLElement;
    set(value: number): void;
    destroy(): void;
}
export declare const SCRUB_CSS: string;
export declare function ensureScrubStyle(root: ShadowRoot): void;
export declare function createScrub(root: ShadowRoot, options: ScrubOptions): Scrub;
