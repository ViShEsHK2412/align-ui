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
/**
 * Does this look like a colour, before we ask the browser to parse it?
 *
 * A cheap syntactic filter, so a scale of eighty tokens is not eighty canvas
 * round-trips. Pure, and wrong only in the safe direction: anything it lets
 * through is still verified by the parser below.
 */
export declare function looksLikeColour(value: string): boolean;
/**
 * Which tokens hold this colour.
 *
 * The same *matches, never from* rule as the numbers: this compares resolved
 * colours, so a hardcoded `#6ea8fe` matches `--brand` exactly as well as one
 * that uses it. That is the point — an agent writing a colour one notch off
 * your brand blue is invisible by eye and obvious to a comparison.
 */
export declare function matchColourTokens(value: string, tokens: Token[]): string[];
/** The colours an element actually paints with, skipping the invisible ones. */
export declare function coloursOf(el: Element): {
    label: string;
    value: string;
}[];
/**
 * A selector that finds this element's kind. Pure: the DOM reading is done by
 * the caller so the shape of the selector can be tested on its own.
 *
 * An id is unique by definition, so it short-circuits: counting how many
 * elements share an id answers a question nobody asked.
 */
export declare function buildSelector(tag: string, id: string, classes: string[]): string;
export declare function selectorOf(el: Element): string;
/**
 * How many elements on the page are built the same way.
 *
 * A number that is only interesting above one: it is the difference between a
 * value you can change locally and one that seven other places share. From
 * InterfaceKit, which shows it before you edit rather than after.
 */
export declare function similarCount(el: Element): number;
/** A rule that matches the element and sets something we measure. */
export interface RuleSource {
    selector: string;
    /** The stylesheet, shortened to the part that identifies it. */
    file: string;
}
/**
 * `http://localhost:5173/src/styles/cards.css?t=1` -> `src/styles/cards.css`.
 *
 * A dev server serves CSS from its real path, so the tail of the URL is the
 * file you would open. The query is a cache-buster and never part of it. Pure.
 */
export declare function shortFile(href: string | null): string;
/**
 * Every rule that matches this element and sets one of the things we measure.
 *
 * These are **candidates**, in document order, and deliberately not a verdict.
 * Naming the winning rule would mean re-implementing the cascade — specificity,
 * `!important`, source order, layers — which is what Mesurer does and what
 * `:is()`, `:where()`, `@layer` and `@scope` each break. A short list of places
 * to look is honest and is what you actually need.
 *
 * Cross-origin stylesheets throw on `.cssRules` and are skipped: their rules
 * are unreadable by design, not missing.
 */
export declare function stylingRules(el: Element): RuleSource[];
/** One line of the layout readout. */
export interface LayoutRow {
    label: string;
    value: string;
}
export interface LayoutFact {
    /** The parent's `display`, already resolved. */
    display: string;
    /** How the parent lays its children out, and how this one is placed in it. */
    rows: LayoutRow[];
}
/**
 * Resolved grid tracks, in px: `"232px 232px 232px"` → `[232, 232, 232]`.
 *
 * The computed value of `grid-template-columns` is the *used* value, so `1fr`
 * arrives already turned into the pixels it won. That is most of the value of
 * reading it at all — what a fraction became is the thing you cannot work out
 * by looking. `none`, and any track that is not a plain length (a subgrid, an
 * unresolved `auto` on a display:none parent), yields nothing rather than a
 * guess. Pure.
 */
export declare function parseTracks(value: string): number[];
/**
 * Which track an offset falls in, 0-based, or -1 for none.
 *
 * An item in a gutter answers with the track it starts inside, because a grid
 * item cannot begin in a gutter — if the offset lands in one, the item has been
 * moved by a margin or a transform and the honest answer is the track it
 * belongs to. Offsets past the last track answer -1: that is an implicit track,
 * which the computed template does not list. Pure.
 */
export declare function trackIndex(tracks: number[], gap: number, offset: number): number;
/**
 * How this element's parent places it.
 *
 * A box model tells you an element's own numbers. It does not tell you why the
 * element is where it is, and for anything inside a flex or grid container that
 * is the actual question — the child's own CSS often says nothing at all, and
 * the answer lives one level up. Reported as facts, with no verdict.
 *
 * Returns null when there is no parent to report on.
 */
export declare function parentLayoutOf(el: Element): LayoutFact | null;
