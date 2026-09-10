import { createEditor, readValue, tokenFor } from '../../align/edit';
import { tokensInScope } from '../../align/inspect';

/**
 * Edit mode's contract, checked against a page that is really cascading.
 *
 * The unit tests cover the parts that can be reasoned about without a DOM.
 * These are the parts that cannot: whether a revert actually returns an element
 * to the stylesheet's answer rather than to a pinned copy of it, and whether a
 * colour resolves to one of your tokens.
 *
 * Each check states what it asserts, and the page shows the result. A failure
 * here is a failure of the promise the tool makes about leaving pages alone.
 */

interface Check {
  name: string;
  why: string;
  run: () => { pass: boolean; detail: string };
}

const target = document.getElementById('subject') as HTMLElement;
const inline = document.getElementById('subject-inline') as HTMLElement;

function eq(a: string, b: string): boolean {
  return a.trim() === b.trim();
}

const CHECKS: Check[] = [
  {
    name: 'Disarmed, nothing is written',
    why: 'A write that happens while the tool says it cannot write is the whole failure this design exists to prevent.',
    run() {
      const editor = createEditor();
      const before = readValue(target, 'padding-top');
      editor.set(target, 'padding-top', '99px');
      const after = readValue(target, 'padding-top');
      return { pass: eq(before, after), detail: `${before} then ${after}` };
    },
  },
  {
    name: 'Armed, the write lands',
    why: 'The obvious half. Included so a failure elsewhere cannot be mistaken for this working.',
    run() {
      const editor = createEditor();
      editor.arm();
      editor.set(target, 'padding-top', '41px');
      const after = readValue(target, 'padding-top');
      editor.disarm();
      return { pass: eq(after, '41px'), detail: after };
    },
  },
  {
    name: 'Revert returns the element to its stylesheet',
    why: 'The element has no inline padding of its own. Restoring the computed value instead would pin the number and stop the element answering to its stylesheet, which is worse than the edit.',
    run() {
      const editor = createEditor();
      editor.arm();
      editor.set(target, 'padding-top', '41px');
      editor.disarm();
      const restored = readValue(target, 'padding-top');
      const stillInline = target.style.getPropertyValue('padding-top');
      return {
        pass: eq(restored, '24px') && stillInline === '',
        detail: `computed ${restored}, inline "${stillInline}"`,
      };
    },
  },
  {
    name: 'Revert keeps an inline value the page already had',
    why: 'The second element does carry its own inline style. Reverting must give that back, not strip it.',
    run() {
      const editor = createEditor();
      editor.arm();
      editor.set(inline, 'padding-top', '41px');
      editor.disarm();
      const back = inline.style.getPropertyValue('padding-top');
      return { pass: back === '7px', detail: `inline "${back}"` };
    },
  },
  {
    name: 'Editing twice still reverts to the original',
    why: 'The original is recorded on the first write only. Recording it every time would return the element to the tool’s own previous value, which is a state the page was never in.',
    run() {
      const editor = createEditor();
      editor.arm();
      editor.set(target, 'padding-top', '41px');
      editor.set(target, 'padding-top', '55px');
      editor.set(target, 'padding-top', '3px');
      editor.disarm();
      const restored = readValue(target, 'padding-top');
      return { pass: eq(restored, '24px'), detail: restored };
    },
  },
  {
    name: 'Disarm reports how much it put back',
    why: 'Pressing the button asks a question, and the count is the answer.',
    run() {
      const editor = createEditor();
      editor.arm();
      editor.set(target, 'padding-top', '41px');
      editor.set(target, 'color', 'rgb(255, 0, 0)');
      editor.set(inline, 'padding-top', '41px');
      const n = editor.disarm();
      return { pass: n === 3, detail: `${n} reverted` };
    },
  },
  {
    name: 'touched() names what the tool wrote',
    why: 'Once the tool can write, some of what the panel reports exists because the tool put it there. The panel has to be able to tell those apart.',
    run() {
      const editor = createEditor();
      editor.arm();
      editor.set(target, 'padding-top', '41px');
      const named = editor.touched(target, 'padding-top');
      const notNamed = editor.touched(target, 'margin-top');
      const props = editor.touchedProps(target).join(',');
      editor.disarm();
      return { pass: named && !notNamed && props === 'padding-top', detail: `[${props}]` };
    },
  },
  {
    name: 'A value on the scale is written down as its token',
    why: 'This is the argument for building it. A tool that cannot read your scale can only hand you a number, and a number is how a design system erodes.',
    run() {
      const tokens = tokensInScope(target);
      const hit = tokenFor('16px', tokens);
      return { pass: hit === '--space-4', detail: String(hit) };
    },
  },
  {
    name: 'A colour on the scale resolves through the canvas parser',
    why: 'Colours are compared after resolving, so a hardcoded hex matches the token holding the same colour. This is the path the unit tests cannot reach.',
    run() {
      const tokens = tokensInScope(target);
      const hit = tokenFor('#0d99ff', tokens);
      return { pass: hit === '--brand', detail: String(hit) };
    },
  },
  {
    name: 'A value off the scale is written down as itself',
    why: 'The tool must not claim a token that does not hold the value.',
    run() {
      const tokens = tokensInScope(target);
      const hit = tokenFor('13px', tokens);
      return { pass: hit === null, detail: String(hit) };
    },
  },
  {
    name: 'The prompt names the token and keeps the raw value',
    why: 'The line has to be pasteable as-is and still say what it resolves to and what it replaced.',
    run() {
      const editor = createEditor();
      editor.arm();
      editor.set(target, 'padding-top', '16px');
      const prompt = editor.asPrompt();
      editor.disarm();
      const ok = prompt.includes('var(--space-4)') && prompt.includes('was 24px');
      return { pass: ok, detail: prompt.split('\n').filter((l) => l.includes('padding-top'))[0] ?? '(no row)' };
    },
  },
  {
    name: 'A change back to the original is not a change',
    why: 'A diff listing a line that says nothing spends the reader’s attention for nothing.',
    run() {
      const editor = createEditor();
      editor.arm();
      const original = readValue(target, 'padding-top');
      editor.set(target, 'padding-top', '41px');
      editor.set(target, 'padding-top', original);
      const prompt = editor.asPrompt();
      editor.disarm();
      return { pass: prompt === '', detail: prompt === '' ? 'empty, correctly' : prompt };
    },
  },
];

// ── Run them ────────────────────────────────────────────────────────────────

const results = document.getElementById('results') as HTMLElement;
let passed = 0;

for (const check of CHECKS) {
  let outcome: { pass: boolean; detail: string };
  try {
    outcome = check.run();
  } catch (error) {
    outcome = { pass: false, detail: `threw: ${String(error)}` };
  }
  if (outcome.pass) passed += 1;

  const row = document.createElement('div');
  row.className = 'check';
  row.dataset['pass'] = String(outcome.pass);
  row.innerHTML = '';

  const mark = document.createElement('span');
  mark.className = 'mark';
  mark.textContent = outcome.pass ? 'pass' : 'FAIL';

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = check.name;

  const detail = document.createElement('span');
  detail.className = 'detail';
  detail.textContent = outcome.detail;

  const why = document.createElement('p');
  why.className = 'why';
  why.textContent = check.why;

  const head = document.createElement('div');
  head.className = 'head';
  head.append(mark, name, detail);
  row.append(head, why);
  results.appendChild(row);
}

const summary = document.getElementById('summary') as HTMLElement;
summary.textContent = `${passed} of ${CHECKS.length} passing`;
summary.dataset['pass'] = String(passed === CHECKS.length);

// The element must be exactly as the page left it once the checks are done.
const finalPadding = readValue(target, 'padding-top');
const finalInline = inline.style.getPropertyValue('padding-top');
const clean = document.getElementById('clean') as HTMLElement;
const isClean = finalPadding.trim() === '24px' && finalInline === '7px';
clean.textContent = isClean
  ? 'The page is exactly as it started.'
  : `Left behind: padding ${finalPadding}, inline "${finalInline}".`;
clean.dataset['pass'] = String(isClean);

if (import.meta.env.DEV) {
  import('../../align/index').then((m) => m.initAlign());
}

import.meta.hot?.accept();
