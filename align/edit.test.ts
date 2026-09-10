import { describe, expect, it } from 'vitest';
import { formatPrompt, tokenFor, type PromptRow } from './edit';
import type { Token } from './inspect';

/**
 * The parts of edit mode that can be reasoned about without a DOM: what a
 * change is written down as, and whether a value is one of your tokens.
 *
 * The arm/revert contract needs real elements and is exercised on the demo
 * page instead, where a revert can be checked against a stylesheet that is
 * actually cascading.
 */

const px = (name: string, value: string): Token => ({
  name,
  value,
  px: parseFloat(value),
});

describe('tokenFor', () => {
  const tokens = [
    px('--space-2', '8px'),
    px('--radius-control', '6px'),
    { name: '--accent', value: '#0d99ff', px: NaN },
  ];

  it('finds a token holding the same length', () => {
    expect(tokenFor('6px', tokens)).toBe('--radius-control');
  });

  /*
   * The colour path parses through a canvas, so it is a DOM function and is
   * checked on the demo page rather than here. What this file can prove is the
   * guard in front of it: nothing that is not colour-shaped ever reaches it,
   * which is why these run at all without a document.
   */

  it('says nothing when the value is not on the scale', () => {
    // 13px is the value this whole feature exists to argue against, so it had
    // better not be claimed as a token.
    expect(tokenFor('13px', tokens)).toBeNull();
  });

  it('does not match a bare number against a length token', () => {
    // `opacity: 8` is not `--space-2`, and unit-blind matching would say it is.
    expect(tokenFor('8', tokens)).toBeNull();
  });

  it('survives a value that is not a number at all', () => {
    expect(tokenFor('auto', tokens)).toBeNull();
    expect(tokenFor('', tokens)).toBeNull();
  });

  it('keeps the canvas parser away from values that cannot be colours', () => {
    // Reaching it here would throw for want of a document, which is exactly
    // the guarantee worth having: the expensive path runs only when it can pay.
    for (const value of ['16px', 'auto', 'flex', '1.5', '', '0 auto', 'inherit']) {
      expect(() => tokenFor(value, tokens)).not.toThrow();
      expect(tokenFor(value, tokens)).toBeNull();
    }
  });
});

describe('formatPrompt', () => {
  const row = (over: Partial<PromptRow> = {}): PromptRow => ({
    selector: '.card',
    prop: 'padding',
    from: '12px',
    to: '16px',
    token: null,
    ...over,
  });

  it('is empty when nothing changed', () => {
    expect(formatPrompt([])).toBe('');
  });

  it('writes the token in the declaration and the value in the comment', () => {
    const out = formatPrompt([row({ token: '--space-4' })]);
    expect(out).toContain('padding: var(--space-4);');
    // The line has to be pasteable as-is and still say what it resolves to.
    expect(out).toContain('/* 16px, was 12px */');
  });

  it('falls back to the raw value when no token holds it', () => {
    const out = formatPrompt([row()]);
    expect(out).toContain('padding: 16px;');
    expect(out).toContain('/* was 12px */');
  });

  it('groups every property of one element under a single selector', () => {
    const out = formatPrompt([
      row({ prop: 'padding' }),
      row({ prop: 'color', from: 'rgb(0, 0, 0)', to: 'rgb(255, 0, 0)' }),
    ]);
    expect(out.match(/\.card \{/g)).toHaveLength(1);
    expect(out).toContain('padding:');
    expect(out).toContain('color:');
  });

  it('keeps two elements apart', () => {
    const out = formatPrompt([row(), row({ selector: '.other' })]);
    expect(out).toContain('.card {');
    expect(out).toContain('.other {');
  });

  it('says the changes are not in the source yet', () => {
    // The whole point of the paste is that an agent knows these are live edits
    // rather than something it can find by reading the repository.
    expect(formatPrompt([row()])).toContain('not in the source yet');
  });
});
