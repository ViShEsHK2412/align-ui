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
export const HOOK_ATTRIBUTES = [
  'data-testid', 'data-test-id', 'data-test', 'data-qa', 'data-cy', 'data-component', 'data-id',
] as const;

/** Libraries that number their ids by mount order. */
const GENERATED_PREFIX = /^(radix-|headlessui-|mui-|react-aria|reach-|ember\d|yui_|ext-gen|downshift-|rc-tabs-|floating-ui-)/i;

/**
 * Was this id or value made by a framework rather than a person?
 *
 * React's useId produces `:r1:` (or `«r1»` since 19), several component
 * libraries number by mount order, and build tools hash. Any of them differs
 * between two loads of the same page, which is the one property a locator
 * cannot have.
 */
export function looksGenerated(token: string): boolean {
  if (!token) return true;
  if (/[:«»]/.test(token)) return true;
  if (GENERATED_PREFIX.test(token)) return true;
  if (/\d{4,}/.test(token)) return true;
  /*
   * A hash: five or more characters mixing letters and digits. People write a
   * word then a small number (col12, step2, h1); hashes mix freely and often
   * lead with digits (CSS modules emit _name_464at_161).
   */
  for (const run of token.split(/[-_]/)) {
    if (run.length >= 5 && /\d/.test(run) && /[a-z]/i.test(run) && !/^[a-z]+\d{1,3}$/i.test(run)) return true;
  }
  return false;
}

const esc = (s: string): string =>
  (typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape(s)
    : s.replace(/[^\w-]/g, (c) => `\\${c}`));

type Scope = Document | ShadowRoot;

function count(scope: Scope, selector: string): number {
  try {
    return scope.querySelectorAll(selector).length;
  } catch {
    return 0;
  }
}

/** A selector naming this element on its own, if it has one that is stable and unique. */
function anchorOf(el: Element, scope: Scope): string | null {
  if (el.id && !looksGenerated(el.id)) {
    const s = `#${esc(el.id)}`;
    if (count(scope, s) === 1) return s;
  }
  for (const attr of HOOK_ATTRIBUTES) {
    const v = el.getAttribute(attr);
    if (!v || looksGenerated(v)) continue;
    const s = `[${attr}="${v.replace(/["\\]/g, '\\$&')}"]`;
    if (count(scope, s) === 1) return s;
  }
  return null;
}

function step(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const parent = el.parentElement;
  const siblings = parent
    ? Array.from(parent.children)
    : Array.from((el.getRootNode() as ParentNode).children ?? []);
  const same = siblings.filter((s) => s.tagName === el.tagName);
  return same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(el) + 1})` : tag;
}

/**
 * Landmarks are stable enough to anchor to when there is only one of them.
 * A unique div is luck; a unique main is structure.
 */
const LANDMARKS = new Set(['main', 'nav', 'header', 'footer', 'aside', 'form', 'dialog', 'h1']);

function anchorOrLandmark(el: Element, scope: Scope): string | null {
  const own = anchorOf(el, scope);
  if (own) return own;
  const tag = el.tagName.toLowerCase();
  return LANDMARKS.has(tag) && count(scope, tag) === 1 ? tag : null;
}

function within(el: Element, scope: Scope): string {
  const own = anchorOrLandmark(el, scope);
  if (own) return own;
  const tag = el.tagName.toLowerCase();

  /*
   * Climb to the nearest stable ancestor and write the path down from it.
   * Anchored is preferred over shortest: a:nth-of-type(2) may be unique on the
   * page today and match a different link the moment one is added, while
   * #tabs > a:nth-of-type(2) stays right as long as the tabs do.
   */
  const steps: string[] = [];
  let at: Element | null = el;
  for (let depth = 0; at && depth < 12; depth++) {
    if (depth > 0) {
      const anchor = anchorOrLandmark(at, scope);
      if (anchor) {
        const anchored = [anchor, ...steps].join(' > ');
        if (count(scope, anchored) === 1) return anchored;
        break;
      }
    }
    if (at.tagName === 'HTML' || at.tagName === 'BODY') break;
    steps.unshift(step(at));
    at = at.parentElement;
  }

  // No anchor above it: the shortest suffix of the path that is unique, then
  // the tag on its own, then the whole path as the best there is.
  for (let n = 1; n <= steps.length; n++) {
    const candidate = steps.slice(-n).join(' > ');
    if (count(scope, candidate) === 1) return candidate;
  }
  if (count(scope, tag) === 1) return tag;
  return steps.join(' > ') || tag;
}

export function stableSelector(el: Element): string {
  const root = el.getRootNode();
  if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) {
    return `${stableSelector(root.host)} >> ${within(el, root)}`;
  }
  return within(el, (root as Document).querySelectorAll ? (root as Document) : document);
}

/** Follow a stable selector back to its element, through open shadow roots. */
export function resolveStable(selector: string, doc: Document = document): Element | null {
  const parts = selector.split(' >> ');
  let scope: Scope | null = doc;
  let found: Element | null = null;
  for (const part of parts) {
    if (!scope) return null;
    try {
      found = scope.querySelector(part);
    } catch {
      return null;
    }
    if (!found) return null;
    scope = found.shadowRoot;
  }
  return found;
}
