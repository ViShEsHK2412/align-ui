import { describe, expect, it } from 'vitest';
import { colourTokens, filterTokens, tokenIn } from './colour-tokens';

const isColour = (v: string) => /^(#|rgb|hsl|oklch|color\()/.test(v);
const T = (name: string, value: string) => ({ name, value });

describe('colourTokens', () => {
  it('keeps colours and leaves out everything else', () => {
    const out = colourTokens([T('--blue-600', '#2563eb'), T('--space-4', '16px'), T('--font', 'Inter'), T('--ok', 'oklch(0.7 0.1 140)')], isColour);
    expect(out.map((t) => t.name)).toEqual(['--blue-600', '--ok']);
  });

  it('follows an alias to the colour it is, and says which token it points at', () => {
    const out = colourTokens([T('--blue-600', '#2563eb'), T('--primary', 'var(--blue-600)'), T('--button', 'var(--primary)')], isColour);
    expect(out.find((t) => t.name === '--button')).toEqual({ name: '--button', value: '#2563eb', via: '--primary' });
  });

  it('drops an alias to nothing, or to something that is not a colour', () => {
    const out = colourTokens([T('--a', 'var(--missing)'), T('--b', 'var(--gap)'), T('--gap', '8px')], isColour);
    expect(out).toEqual([]);
  });

  it('survives a cycle', () => {
    expect(colourTokens([T('--a', 'var(--b)'), T('--b', 'var(--a)')], isColour)).toEqual([]);
  });

  it('reads var() with a fallback and odd spacing', () => {
    const out = colourTokens([T('--x', '#fff'), T('--y', 'var( --x , red)')], isColour);
    expect(out.find((t) => t.name === '--y')?.value).toBe('#fff');
  });
});

describe('tokenIn', () => {
  it('names the token in an exact var()', () => {
    expect(tokenIn('var(--brand-500)')).toBe('--brand-500');
    expect(tokenIn('  var(--a, #000) ')).toBe('--a');
  });

  it('is null for a colour, or a var() inside something else', () => {
    expect(tokenIn('#fff')).toBeNull();
    expect(tokenIn('color-mix(in oklch, var(--a), white)')).toBeNull();
  });
});

describe('filterTokens', () => {
  const list = [T('--blue-500', '#00f'), T('--blue-600', '#00c'), T('--red-500', '#f00')];
  it('matches every word, anywhere in the name', () => {
    expect(filterTokens(list, 'blue 6').map((t) => t.name)).toEqual(['--blue-600']);
    expect(filterTokens(list, '500').map((t) => t.name)).toEqual(['--blue-500', '--red-500']);
  });

  it('returns everything for an empty query', () => {
    expect(filterTokens(list, '  ')).toHaveLength(3);
  });
});
