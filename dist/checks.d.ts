/**
 * A check the agent can run, appended to what it is handed.
 *
 * Every pasted change says what a property should become, so whether it did is
 * a question with an answer, and the answer should not be "the agent says so".
 * Toolcraft's rule for agents is the same one: prove the outcome on the real
 * page, not in prose or by eye from a screenshot. This turns the expected
 * values into a console snippet that finds each element and compares what it
 * computes to, and prints exactly what is still off.
 *
 * Computed values on both sides, so a token is fine: `var(--space-4)` written
 * in source still computes to the 16px that was checked for.
 *
 * Pure: strings in, a string out.
 */
export interface Check {
    /** A selector the tool wrote; ` >> ` steps into a shadow root. */
    selector: string;
    /** CSS property, kebab case. */
    prop: string;
    /** What it should compute to. */
    value: string;
}
/**
 * The snippet, for one page. It is self-contained and has no dependencies, so
 * it runs in DevTools, in a Playwright `evaluate`, or in any agent's browser
 * tool alike. Nothing found is reported as missing rather than throwing, since
 * a renamed element is exactly the kind of thing the check exists to catch.
 */
export declare function checkScript(path: string, checks: readonly Check[]): string;
