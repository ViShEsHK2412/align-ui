/**
 * The spacing lint: every gap and every padding on screen, checked against
 * your scale, and the ones that miss named with the token that would fix them.
 *
 * inspectkit showed the shape of this — shade what is on the scale, call out
 * what is not, count the problems — but it can only check against a multiple
 * of eight, so its fix reads "14 → 16". This reads the design tokens the page
 * actually defines, so the fix reads "14 → --space-4": the token to write, not
 * a number to hardcode. A number that happens to match is still drift.
 *
 * Everything in this file is pure. The DOM walk that feeds it lives with the
 * caller, so the judgement calls — what counts as spacing, what the nearest
 * fix is — are tested without a browser.
 */
import type { Rect } from './notes';
import type { Quad } from './types';
export interface ScaleToken {
    name: string;
    value: string;
    px: number;
}
export interface Scale {
    /** On-scale values in px, ascending. */
    values: number[];
    /** The token holding each value, when the scale came from tokens. */
    tokens: Map<number, string>;
    /** Where the scale came from, so the readout can say. */
    source: 'tokens' | 'base';
}
export interface LintOptions {
    /** Fallback when the page defines no spacing tokens: multiples of this. */
    base: number;
    /** Extra values that are fine in the fallback scale. */
    allow: number[];
    /** Anything wider is layout, not spacing, and is left alone. */
    max: number;
}
export declare const LINT_DEFAULTS: LintOptions;
/**
 * The spacing scale the page defines, or a numeric one when it defines none.
 *
 * A token counts when its name says spacing and its value is a length. Names
 * decide, not values: `--radius-md: 8px` holds a spacing-shaped number and is
 * not spacing. Three distinct values are needed before it is trusted as a
 * scale; one stray `--gap: 12px` is a token, not a system.
 */
export declare function scaleFrom(tokens: readonly ScaleToken[], options?: LintOptions, rootFontPx?: number): Scale;
export interface Verdict {
    ok: boolean;
    /** Nearest on-scale value, when not ok. */
    suggestion?: number;
    /** The token holding that value, when the scale has one. */
    token?: string;
}
/**
 * Is this value on the scale, and if not, what is the nearest that is?
 *
 * Fractional values are never on the scale: 15.5 is a layout accident, not a
 * spacing decision, however close it is. Ties go to the larger value, which is
 * the conventional reading of a spacing scale and what inspectkit chose too.
 */
export declare function check(value: number, scale: Scale): Verdict;
/** One container, as the DOM walk measured it. */
export interface LintBox {
    rect: Rect;
    padding: Quad;
    border: Quad;
    /** justify-content and align-content: space-* distributes, nobody chose it. */
    justify: string;
    align: string;
    /** In-flow children, in document order. */
    children: Rect[];
}
export interface Band {
    rect: Rect;
    value: number;
    axis: 'x' | 'y';
    kind: 'gap' | 'padding';
    ok: boolean;
    suggestion?: number;
    token?: string;
}
export interface LintResult {
    bands: Band[];
    issues: number;
    scale: Scale;
}
export declare function analyze(boxes: readonly LintBox[], scale: Scale, options?: LintOptions): LintResult;
/** What an off-scale band says: "14 → --space-4", or "14 → 16" with no token. */
export declare function bandLabel(band: Band): string;
