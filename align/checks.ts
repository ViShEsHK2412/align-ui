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

/** Drop repeats, keeping the last value asked of each element and property. */
function unique(checks: readonly Check[]): Check[] {
  const byKey = new Map<string, Check>();
  for (const c of checks) byKey.set(`${c.selector}\u0000${c.prop}`, c);
  return [...byKey.values()];
}

/**
 * The snippet, for one page. It is self-contained and has no dependencies, so
 * it runs in DevTools, in a Playwright `evaluate`, or in any agent's browser
 * tool alike. Nothing found is reported as missing rather than throwing, since
 * a renamed element is exactly the kind of thing the check exists to catch.
 */
export function checkScript(path: string, checks: readonly Check[]): string {
  const list = unique(checks);
  if (!list.length) return '';
  const rows = list.map((c) => `    ${JSON.stringify([c.selector, c.prop, c.value])},`).join('\n');
  return [
    `Then check it on ${path}. Run this in the browser console; it prints what is still off, or that every check passes:`,
    '',
    '```js',
    '(() => {',
    "  const find = (sel) => sel.split(' >> ').reduce((at, part, i) => at && (i ? at.shadowRoot : at)?.querySelector(part), document);",
    '  const want = [',
    rows,
    '  ];',
    '  const off = want.flatMap(([sel, prop, value]) => {',
    '    const el = find(sel);',
    "    if (!el) return [`${sel}: not found`];",
    '    const got = getComputedStyle(el).getPropertyValue(prop).trim();',
    "    return got === value ? [] : [`${sel} ${prop}: ${got}, want ${value}`];",
    '  });',
    "  return off.length ? off.join('\\n') : `all ${want.length} checks pass`;",
    '})()',
    '```',
  ].join('\n');
}
