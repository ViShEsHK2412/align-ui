import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * No surface gives up its ground.
 *
 * Every surface() level is a translucent film, and a film only reads as a
 * colour on top of something opaque. A floating surface paints GROUND; if any
 * state of it then sets its background to a film, that state is see-through.
 * The toolbar did exactly this on hover and went white over the interaction
 * lab's light page. This reads the stylesheets as written and fails if any
 * selector that paints GROUND also has a state that replaces it with a film.
 */

const dir = new URL('./', import.meta.url);
/*
 * The stylesheets are template literals, so their rules are full of ${...}.
 * Those braces broke a naive rule parser — the toolbar's own rule contains
 * ${(ROW - BTN) / 2} and was silently never examined. The two interpolations
 * that matter become markers, and every other one becomes a harmless token.
 */
const normalise = (text: string) => text
  // Comments go first: otherwise one sits between a rule and the next and is
  // read as part of that next rule's selector.
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\$\{GROUND\}/g, '__GROUND__')
  .replace(/\$\{surface\(\d+\)\}/g, '__SURFACE__')
  .replace(/\$\{[^{}]*\}/g, '0');
const sources = readdirSync(dir)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
  .map((f) => ({ file: f, text: normalise(readFileSync(new URL(f, dir), 'utf8')) }));

/** Selectors whose own rule paints the opaque ground. */
function groundSelectors(text: string): string[] {
  const out: string[] = [];
  const rule = /([^{}\n][^{}]*?)\{([^{}]*)\}/g;
  for (const m of text.matchAll(rule)) {
    if (/background:\s*__GROUND__/.test(m[2]!)) {
      // Only what follows the stylesheet's opening backtick or the last
      // statement, never the JavaScript before it.
      const selectors = m[1]!.split(/[`;]/).pop()!;
      for (const s of selectors.split(',')) {
        const sel = s.trim();
        if (/^[.#[a-z]/i.test(sel) && !sel.includes(':')) out.push(sel);
      }
    }
  }
  return out;
}

describe('floating surfaces', () => {
  it('never replace their ground with a translucent film in any state', () => {
    const offenders: string[] = [];
    for (const { file, text } of sources) {
      for (const sel of groundSelectors(text)) {
        const escaped = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const state = new RegExp(`${escaped}(:[a-z-]+|\\[[^\\]]+\\])+\\s*\\{([^{}]*)\\}`, 'g');
        for (const m of text.matchAll(state)) {
          if (/background:\s*__SURFACE__/.test(m[2]!)) offenders.push(`${file}: ${m[0].split('{')[0]!.trim()}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('actually finds the surfaces it is guarding', () => {
    // A check that matches nothing passes forever and proves nothing.
    const found = sources.flatMap(({ text }) => groundSelectors(text));
    expect(found).toContain('.flag');
    expect(found.length).toBeGreaterThanOrEqual(5);
  });
});
