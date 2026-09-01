/**
 * Reading a element's type, and checking its numbers against the design tokens
 * that are actually in scope.
 *
 * The arithmetic here is pure so it can be tested; only `typographyOf` and
 * `tokensInScope` touch the DOM, and each is one `getComputedStyle` call.
 */
/** One line of the typography readout. */
export interface TypeRow {
    label: string;
    value: string;
    /** The number behind the value, for token matching. NaN when there isn't one. */
    px: number;
}
/** A custom property in scope, resolved to its value. */
export interface Token {
    name: string;
    value: string;
    px: number;
}
/** `"Inter", sans-serif` → `Inter`. The rest is the fallback chain. */
export declare function firstFamily(stack: string): string;
/** 400 → `400 regular`, so the number and the name are both there. */
export declare function weightName(weight: string): string;
/**
 * The type of an element, as rows.
 *
 * Computed values arrive resolved, so `line-height: 1.5` on 16px text reads as
 * 24px — which is the number you would measure, and the reason this belongs in
 * a measuring tool at all. `normal` survives as a keyword on both line-height
 * and letter-spacing, so neither can be blindly parsed.
 */
export declare function typographyOf(el: Element): TypeRow[];
/** The text an element holds itself, ignoring anything its children hold. */
export declare function ownText(el: Element): string;
/**
 * Every custom property visible from this element, resolved.
 *
 * Computed style enumerates custom properties, inherited ones included — a
 * token declared on `:root` is readable from a div ten levels down, which is
 * exactly the set a design system defines.
 */
export declare function tokensInScope(el: Element): Token[];
/**
 * Which tokens hold this exact number.
 *
 * This compares values. It does not claim the number *came from* the token —
 * a hardcoded `padding: 16px` matches `--space-4` just as well as one that
 * uses it. That is why the readout says *matches*, and why it is worth having:
 * a hardcoded value sitting exactly on the scale is one you probably meant to
 * write as the token.
 */
export declare function matchTokens(value: number, tokens: Token[]): string[];
/**
 * The distinct numbers an element is built from, in the order you would read
 * them. Zero is dropped: every box has zeros and none of them are decisions.
 */
export declare function distinctValues(nums: number[]): number[];
/**
 * One line summarising which of an element's numbers are on the token scale.
 * A number with no match is the interesting one, so it is named rather than
 * dropped.
 */
export declare function tokenSummary(values: number[], tokens: Token[]): string;
/** Where a measured gap between two siblings actually came from. */
export interface GapFact {
    px: number;
    /** The parent's CSS gap on that axis, or null when the parent sets none. */
    cssGap: number | null;
    /** The two facing margins, added. */
    margins: number;
    /** Provenance only means anything between siblings. */
    siblings: boolean;
}
/**
 * Account for a gap: how much of it is the parent's `gap`, how much is the two
 * facing margins.
 *
 * This is the question a bare number leaves open. Twenty-four pixels between
 * two cards is a different problem depending on whether it came from a flex
 * `gap`, from margins, or from both at once, and knowing which is the
 * difference between a measurement you have to go investigate and one you can
 * act on.
 */
export declare function gapFactOf(a: Element, b: Element, gap: number, axis: 'x' | 'y'): GapFact;
/**
 * A gap fact as one line. Pure.
 *
 * When the parts do not add up to the measurement the remainder is named
 * rather than hidden — that is `justify-content`, an auto margin, or a
 * float, and a reader who sees `gap 0 · margins 0` on a 24px space would
 * otherwise conclude the tool is broken.
 */
export declare function describeGap(f: GapFact): string;
/**
 * How many gaps came out at each size, commonest first: `24 ×3 · 18 ×1`.
 *
 * The distribution is a fact. GuideFrame appends a verdict — "inconsistent" —
 * and that is the judgement this tool deliberately does not make.
 */
export declare function gapDistribution(values: number[]): string;
