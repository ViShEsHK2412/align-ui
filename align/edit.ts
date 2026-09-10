import {
  looksLikeColour, matchColourTokens, matchTokens, selectorOf, tokensInScope, type Token,
} from './inspect';

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
export function readValue(el: Element, prop: string): string {
  return getComputedStyle(el).getPropertyValue(prop).trim();
}

/** Elements are compared by identity, so a Map keyed on the node is the index. */
type Ledger = Map<Element, Map<string, Original>>;

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
export function tokenFor(value: string, tokens: readonly Token[]): string | null {
  const asNumber = parseFloat(value);
  if (value.endsWith('px') && Number.isFinite(asNumber)) {
    const hit = matchTokens(asNumber, tokens as Token[])[0];
    if (hit) return hit;
  }
  /*
   * Guarded by the cheap syntactic check before the expensive one.
   *
   * `matchColourTokens` parses through a canvas, which is the only parser
   * guaranteed to agree with the one that painted the page — and is far too
   * much machinery to run against `16px`, `auto` or `flex`, which is most of
   * what passes through here.
   */
  if (!looksLikeColour(value)) return null;
  const colour = matchColourTokens(value, tokens as Token[])[0];
  return colour ?? null;
}

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

export function formatPrompt(rows: readonly PromptRow[]): string {
  if (rows.length === 0) return '';

  const bySelector = new Map<string, PromptRow[]>();
  for (const row of rows) {
    const list = bySelector.get(row.selector) ?? [];
    list.push(row);
    bySelector.set(row.selector, list);
  }

  const out: string[] = [
    'These changes were made live in the browser and are not in the source yet.',
    'Apply them, preferring the named token wherever one is given.',
    '',
  ];
  for (const [selector, list] of bySelector) {
    out.push(`${selector} {`);
    for (const row of list) {
      // The token goes in the declaration and the raw value in the comment, so
      // the line can be pasted as-is and still says what it resolves to.
      const value = row.token ? `var(${row.token})` : row.to;
      const note = row.token ? `  /* ${row.to}, was ${row.from} */` : `  /* was ${row.from} */`;
      out.push(`  ${row.prop}: ${value};${note}`);
    }
    out.push('}', '');
  }
  return out.join('\n').trimEnd();
}

export function createEditor(): Editor {
  const ledger: Ledger = new Map();
  let armed = false;

  function entry(el: Element): Map<string, Original> {
    const found = ledger.get(el);
    if (found) return found;
    const made = new Map<string, Original>();
    ledger.set(el, made);
    return made;
  }

  function putBack(el: Element, prop: string, original: Original): void {
    const style = (el as HTMLElement).style;
    // Restoring the *inline* value, not the computed one. The element may have
    // had no inline value at all, in which case writing the computed one back
    // would pin it — the number would be right and the element would have
    // stopped answering to its stylesheet, which is a worse outcome than the
    // edit itself.
    if (original.inline) style.setProperty(prop, original.inline);
    else style.removeProperty(prop);
  }

  return {
    get armed() { return armed; },

    arm() { armed = true; },

    disarm() {
      const n = this.revertAll();
      armed = false;
      return n;
    },

    set(el, prop, value) {
      // Refused rather than queued when disarmed. A write that happens later,
      // silently, is the failure mode this whole design exists to prevent.
      if (!armed) return;
      const props = entry(el);
      // Recorded once, on the first write. A second edit of the same property
      // must not overwrite the original with the tool's own previous value, or
      // reverting returns the element to a state it was never in.
      if (!props.has(prop)) {
        props.set(prop, {
          inline: (el as HTMLElement).style.getPropertyValue(prop),
          computed: readValue(el, prop),
        });
      }
      (el as HTMLElement).style.setProperty(prop, value);
    },

    revert(el, prop) {
      const props = ledger.get(el);
      const original = props?.get(prop);
      if (!props || !original) return;
      putBack(el, prop, original);
      props.delete(prop);
      if (props.size === 0) ledger.delete(el);
    },

    revertAll() {
      let n = 0;
      for (const [el, props] of ledger) {
        for (const [prop, original] of props) {
          putBack(el, prop, original);
          n += 1;
        }
      }
      ledger.clear();
      return n;
    },

    touched(el, prop) {
      return ledger.get(el)?.has(prop) ?? false;
    },

    touchedProps(el) {
      return [...(ledger.get(el)?.keys() ?? [])].sort();
    },

    changes() {
      const out: Change[] = [];
      for (const [el, props] of ledger) {
        for (const [prop, original] of props) {
          out.push({ el, prop, from: original.computed, to: readValue(el, prop) });
        }
      }
      return out;
    },

    asPrompt() {
      const rows: PromptRow[] = [];
      for (const [el, props] of ledger) {
        const tokens = tokensInScope(el);
        const selector = selectorOf(el);
        for (const [prop, original] of props) {
          const to = readValue(el, prop);
          // A property written back to the value it already had is not a
          // change, and a diff that lists it wastes the reader's attention on
          // a line that says nothing.
          if (to === original.computed) continue;
          rows.push({ selector, prop, from: original.computed, to, token: tokenFor(to, tokens) });
        }
      }
      return formatPrompt(rows);
    },
  };
}
