/**
 * A selector that finds this element again: unique now, and still right after
 * a rebuild.
 *
 * `selectorOf` in inspect.ts describes an element the way its author styled it
 * (`a.tab`), which is what a reader wants and what "how many elements are
 * built this way" needs. It is not a locator. Four tabs are all `a.tab`, and in
 * a CSS-modules app the classes are hashes — `_scroll_464at_161` — that change
 * on the next build, so a note pointing at one points at nothing.
 *
 * This writes locators instead, in the order the two other tools that solved
 * this settled on (inspectkit's selectorFor, mesurer's getElementSelector): an
 * id, then the attributes teams add for tests, then a tag that is unique on its
 * own, then a tag:nth-of-type path up to the nearest stable anchor. Classes are
 * never used. Ids and attribute values that a framework generated per mount
 * are not stable either, and are skipped the same way.
 *
 * Open shadow roots are crossed with ` >> `, the separator Playwright uses for
 * chaining, and `resolveStable` follows it back down.
 */
/** Attributes added on purpose to find an element by, in rough order of intent. */
export declare const HOOK_ATTRIBUTES: readonly ['data-testid', 'data-test-id', 'data-test', 'data-qa', 'data-cy', 'data-component', 'data-id'];
/**
 * Was this id or value made by a framework rather than a person?
 *
 * React's useId produces `:r1:` (or `«r1»` since 19), several component
 * libraries number by mount order, and build tools hash. Any of them differs
 * between two loads of the same page, which is the one property a locator
 * cannot have.
 */
export declare function looksGenerated(token: string): boolean;
export declare function stableSelector(el: Element): string;
/** Follow a stable selector back to its element, through open shadow roots. */
export declare function resolveStable(selector: string, doc?: Document): Element | null;
