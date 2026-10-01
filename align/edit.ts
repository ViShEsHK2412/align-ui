import {
  looksLikeColour, matchColourTokens, matchTokens, selectorOf, tokensInScope, type Token,
} from './inspect';
import { stableSelector } from './selector';
import { checkScript } from './checks';

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
  /**
   * Everything written between these is one step of undo: a slider dragged
   * across forty values is one thing you did. Called around a press on the
   * panel; writes outside a press group themselves (see `set`).
   */
  beginGesture(): void;
  endGesture(): void;
  /** Step back one gesture. Returns the elements it touched, or [] for none. */
  undo(): Element[];
  /** Step forward again, after an undo. */
  redo(): Element[];
  canUndo(): boolean;
  canRedo(): boolean;
  /** When the newest undo step last changed, to order it against guide undo. */
  lastAt(): number | null;
  /**
   * Fold every step since `t` into one, when they all touched only `el`.
   * A double-click to reset is two clicks first, and each click on a slider
   * moves it: without this, undoing the reset would land on the half-clicked
   * value instead of where you were before you double-clicked.
   */
  collapseSince(t: number, el: Element): void;
}

/** One property's move inside an undo step: inline values and ledger entries either side. */
interface Step {
  el: Element;
  prop: string;
  before: string;
  after: string;
  /** The ledger's record before the step: null when the tool had not touched it yet. */
  original: Original | null;
  originalAfter: Original | null;
}

interface UndoEntry {
  steps: Map<Element, Map<string, Step>>;
  at: number;
  /** Set while it belongs to an open press, so every write in it lands here. */
  gesture: number;
}

/** How long a run of keyboard writes to the same property counts as one step. */
const KEY_IDLE = 1000;
/** Steps remembered. Each is a few strings per property touched. */
const UNDO_LIMIT = 100;

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
  /**
   * A selector that finds this one element. Rows are grouped by it, not by
   * the readable selector: four tabs are all `a.tab`, and grouping on that
   * printed edits to different tabs as one block whose values contradicted
   * each other.
   */
  locator?: string;
  prop: string;
  from: string;
  to: string;
  /** A token holding the same value, when one exists. */
  token: string | null;
}

/**
 * @param path the page the changes were made on. With it, the prompt ends in a
 *   check the agent runs there to prove each value landed.
 */
export function formatPrompt(rows: readonly PromptRow[], path?: string): string {
  if (rows.length === 0) return '';

  const bySelector = new Map<string, PromptRow[]>();
  for (const row of rows) {
    const key = row.locator ?? row.selector;
    const list = bySelector.get(key) ?? [];
    list.push(row);
    bySelector.set(key, list);
  }

  const out: string[] = [
    'These changes were made live in the browser and are not in the source yet.',
    'Apply them, preferring the named token wherever one is given.',
    '',
  ];
  for (const [, list] of bySelector) {
    const { selector, locator } = list[0]!;
    // The readable selector opens the block, because it is what the
    // stylesheet says; the locator says which element, when they differ.
    out.push(locator && locator !== selector ? `${selector} { /* ${locator} */` : `${selector} {`);
    for (const row of list) {
      // The token goes in the declaration and the raw value in the comment, so
      // the line can be pasted as-is and still says what it resolves to.
      const value = row.token ? `var(${row.token})` : row.to;
      const note = row.token ? `  /* ${row.to}, was ${row.from} */` : `  /* was ${row.from} */`;
      out.push(`  ${row.prop}: ${value};${note}`);
    }
    out.push('}', '');
  }
  if (path) {
    out.push(checkScript(path, rows.map((r) => ({ selector: r.locator ?? r.selector, prop: r.prop, value: r.to }))));
  }
  return out.join('\n').trimEnd();
}

export function createEditor(now: () => number = Date.now): Editor {
  const ledger: Ledger = new Map();
  let armed = false;

  const undoStack: UndoEntry[] = [];
  const redoStack: UndoEntry[] = [];
  /** The open press, if any; 0 when none. */
  let gesture = 0;
  let gestures = 0;
  /** The entry the current synchronous run of writes is going into. */
  let burst: UndoEntry | null = null;

  const inlineOf = (el: Element, prop: string) => (el as HTMLElement).style.getPropertyValue(prop);
  function setInline(el: Element, prop: string, value: string): void {
    const style = (el as HTMLElement).style;
    if (value) style.setProperty(prop, value);
    else style.removeProperty(prop);
  }
  function setOriginal(el: Element, prop: string, original: Original | null): void {
    if (original) {
      entry(el).set(prop, original);
      return;
    }
    const props = ledger.get(el);
    props?.delete(prop);
    if (props && props.size === 0) ledger.delete(el);
  }

  /**
   * The step a write belongs to. A press groups everything inside it; outside
   * one, writes from the same synchronous run share a step (a linked padding
   * writes four sides at once), and a held arrow key on one property keeps
   * extending the step it started.
   */
  function stepFor(el: Element, prop: string): UndoEntry {
    const t = now();
    const top = undoStack[undoStack.length - 1];
    let target: UndoEntry | null = null;
    if (gesture && top && top.gesture === gesture) target = top;
    else if (!gesture && burst && burst === top) target = burst;
    else if (!gesture && top && !top.gesture && t - top.at <= KEY_IDLE && top.steps.get(el)?.has(prop)) target = top;
    if (!target) {
      target = { steps: new Map(), at: t, gesture };
      undoStack.push(target);
      if (undoStack.length > UNDO_LIMIT) undoStack.shift();
    }
    target.at = t;
    if (!gesture) {
      burst = target;
      queueMicrotask(() => { if (burst === target) burst = null; });
    }
    return target;
  }

  function record(target: UndoEntry, el: Element, prop: string, before: string, original: Original | null): Step {
    let props = target.steps.get(el);
    if (!props) { props = new Map(); target.steps.set(el, props); }
    let step = props.get(prop);
    if (!step) {
      step = { el, prop, before, after: before, original, originalAfter: original };
      props.set(prop, step);
    }
    return step;
  }

  function stepsOf(e: UndoEntry): Step[] {
    return [...e.steps.values()].flatMap((m) => [...m.values()]);
  }
  function elementsOf(e: UndoEntry): Element[] {
    return [...e.steps.keys()];
  }

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
      // Disarming is the end of the session's edits: nothing is left to step
      // through, and a later undo would write to a page the tool promised to
      // leave alone.
      undoStack.length = 0;
      redoStack.length = 0;
      gesture = 0;
      burst = null;
      return n;
    },

    set(el, prop, value) {
      // Refused rather than queued when disarmed. A write that happens later,
      // silently, is the failure mode this whole design exists to prevent.
      if (!armed) return;
      const step = record(stepFor(el, prop), el, prop, inlineOf(el, prop), ledger.get(el)?.get(prop) ?? null);
      redoStack.length = 0;
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
      step.after = inlineOf(el, prop);
      step.originalAfter = props.get(prop) ?? null;
    },

    revert(el, prop) {
      const props = ledger.get(el);
      const original = props?.get(prop);
      if (!props || !original) return;
      if (armed) {
        // Its own step, so a revert you did not mean can be undone.
        const target: UndoEntry = { steps: new Map(), at: now(), gesture: 0 };
        const step = record(target, el, prop, inlineOf(el, prop), original);
        step.after = original.inline;
        step.originalAfter = null;
        undoStack.push(target);
        redoStack.length = 0;
      }
      putBack(el, prop, original);
      props.delete(prop);
      if (props.size === 0) ledger.delete(el);
    },

    revertAll() {
      let n = 0;
      if (armed && ledger.size) {
        // One step for the lot, so Revert all is not the one action you cannot take back.
        const target: UndoEntry = { steps: new Map(), at: now(), gesture: 0 };
        for (const [el, props] of ledger) {
          for (const [prop, original] of props) {
            const step = record(target, el, prop, inlineOf(el, prop), original);
            step.after = original.inline;
            step.originalAfter = null;
          }
        }
        undoStack.push(target);
        redoStack.length = 0;
      }
      for (const [el, props] of ledger) {
        for (const [prop, original] of props) {
          putBack(el, prop, original);
          n += 1;
        }
      }
      ledger.clear();
      return n;
    },

    beginGesture() {
      gesture = ++gestures;
    },
    endGesture() {
      gesture = 0;
    },

    undo() {
      if (!armed) return [];
      const e = undoStack.pop();
      if (!e) return [];
      // Backwards, so a property written twice inside a step lands on its first value.
      for (const s of stepsOf(e).reverse()) {
        s.after = inlineOf(s.el, s.prop);
        setInline(s.el, s.prop, s.before);
        setOriginal(s.el, s.prop, s.original);
      }
      redoStack.push(e);
      burst = null;
      return elementsOf(e);
    },

    redo() {
      if (!armed) return [];
      const e = redoStack.pop();
      if (!e) return [];
      for (const s of stepsOf(e)) {
        setInline(s.el, s.prop, s.after);
        setOriginal(s.el, s.prop, s.originalAfter);
      }
      e.at = now();
      e.gesture = 0;
      undoStack.push(e);
      burst = null;
      return elementsOf(e);
    },

    collapseSince(t, el) {
      let i = undoStack.length;
      while (i > 0) {
        const e = undoStack[i - 1]!;
        if (e.at < t || e.steps.size !== 1 || !e.steps.has(el)) break;
        i -= 1;
      }
      const run = undoStack.splice(i);
      if (run.length < 2) {
        undoStack.push(...run);
        return;
      }
      // Earliest "before" wins, latest "after" wins, per property.
      const merged: UndoEntry = { steps: new Map(), at: run[run.length - 1]!.at, gesture: 0 };
      for (const e of run) {
        for (const s of stepsOf(e)) {
          const step = record(merged, s.el, s.prop, s.before, s.original);
          step.after = s.after;
          step.originalAfter = s.originalAfter;
        }
      }
      undoStack.push(merged);
      burst = null;
    },

    canUndo: () => armed && undoStack.length > 0,
    canRedo: () => armed && redoStack.length > 0,
    lastAt: () => (armed ? undoStack[undoStack.length - 1]?.at ?? null : null),

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
        const locator = stableSelector(el);
        for (const [prop, original] of props) {
          const to = readValue(el, prop);
          // A property written back to the value it already had is not a
          // change, and a diff that lists it wastes the reader's attention on
          // a line that says nothing.
          if (to === original.computed) continue;
          rows.push({ selector, locator, prop, from: original.computed, to, token: tokenFor(to, tokens) });
        }
      }
      return formatPrompt(rows, location.pathname);
    },
  };
}
