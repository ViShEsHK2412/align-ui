import { type Token } from './inspect';
/**
 * Edit mode.
 *
 * This is the one part of the tool that writes to the page, and it exists
 * behind a switch for that reason.
 *
 * The tool's promise is that it measures and leaves the page as it found it —
 * it refuses to patch page timers on exactly those grounds. Writing styles
 * breaks that promise unless the breaking is explicit, so:
 *
 *  - **Off by default.** Nothing here runs until it is armed.
 *  - **Visibly armed.** The toolbar shows it, because a tool that can change
 *    the page while looking like one that cannot is worse than no tool.
 *  - **Everything reverts on disarm.** Not most things, not the ones you did
 *    not overwrite twice — everything, exactly as it was.
 *
 * That last one is what makes the box model trustworthy while this is on. The
 * panel reports numbers read from the page; once the tool can write, some of
 * those numbers exist because the tool put them there. `touched()` is how the
 * panel knows which, so it can say so rather than presenting them as findings.
 */
/** One property on one element, as it was before anything was written. */
export interface Original {
    /** The inline value the element had, or '' when it had none of its own. */
    inline: string;
    /** What it computed to, which is what the value actually looked like. */
    computed: string;
}
export interface Change {
    el: Element;
    /** A CSS property name, in kebab case. */
    prop: string;
    from: string;
    to: string;
}
export interface Editor {
    readonly armed: boolean;
    arm(): void;
    /** Puts every edit back and returns how many there were. */
    disarm(): number;
    set(el: Element, prop: string, value: string): void;
    revert(el: Element, prop: string): void;
    revertAll(): number;
    /** Has this property on this element been written by the tool? */
    touched(el: Element, prop: string): boolean;
    /** Every property the tool has written on this element. */
    touchedProps(el: Element): string[];
    changes(): Change[];
    /** The ledger, as something you can paste at a coding agent. */
    asPrompt(): string;
}
/**
 * A property's current value, preferring what it computes to.
 *
 * Computed rather than inline, because a control has to open showing what the
 * element actually looks like — an element styled entirely from a stylesheet
 * has no inline value at all, and seeding a control from '' would show zero
 * for every property on the page.
 */
export declare function readValue(el: Element, prop: string): string;
/**
 * How a value should be written down, given what is in scope.
 *
 * A number that matches a token is emitted as the token. This is the whole
 * argument for building this rather than using something else: a tool that
 * does not read your scale can only ever hand you `13px`, and `13px` is how a
 * design system erodes. `--radius-control` is a fix; `13px` is drift.
 *
 * It says *matches*, not *came from*, and the distinction is kept honest: a
 * hardcoded value sitting exactly on the scale matches too, which is precisely
 * the case worth being told about.
 */
export declare function tokenFor(value: string, tokens: readonly Token[]): string | null;
/**
 * The ledger as a diff, grouped by the element it belongs to.
 *
 * Pure, so the formatting can be tested without a DOM: it is handed rows that
 * already carry their selector and their token, rather than elements to look
 * them up from.
 */
export interface PromptRow {
    selector: string;
    prop: string;
    from: string;
    to: string;
    /** A token holding the same value, when one exists. */
    token: string | null;
}
export declare function formatPrompt(rows: readonly PromptRow[]): string;
export declare function createEditor(): Editor;
