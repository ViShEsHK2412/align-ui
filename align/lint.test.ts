import { describe, expect, it } from 'vitest';
import { analyze, bandLabel, check, LINT_DEFAULTS, scaleFrom, type LintBox, type ScaleToken } from './lint';

const tok = (name: string, value: string): ScaleToken => ({ name, value, px: parseFloat(value) });
const R = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });
const box = (p: Partial<LintBox> = {}): LintBox => ({
  rect: R(0, 0, 400, 200), padding: [0, 0, 0, 0], border: [0, 0, 0, 0],
  justify: 'normal', align: 'normal', children: [], ...p,
});

const SPACE = [tok('--space-1', '4px'), tok('--space-2', '8px'), tok('--space-3', '12px'),
  tok('--space-4', '16px'), tok('--space-6', '24px'), tok('--space-8', '32px')];

describe('scaleFrom', () => {
  it('reads a spacing scale from tokens and remembers which token holds each value', () => {
    const s = scaleFrom(SPACE);
    expect(s.source).toBe('tokens');
    expect(s.values).toEqual([4, 8, 12, 16, 24, 32]);
    expect(s.tokens.get(16)).toBe('--space-4');
  });

  it('ignores tokens that only hold a spacing-shaped number', () => {
    const s = scaleFrom([...SPACE, tok('--radius-md', '10px'), tok('--font-size-sm', '14px'),
      tok('--line-height', '20px'), tok('--shadow-blur', '6px'), tok('--container-max', '1200px')]);
    expect(s.values).not.toContain(10);
    expect(s.values).not.toContain(14);
    expect(s.values).not.toContain(20);
  });

  it('judges names by segment, so "inline" is not "line"', () => {
    const s = scaleFrom([...SPACE, tok('--space-inline-lg', '40px')]);
    expect(s.values).toContain(40);
  });

  it('converts rem using the root font size', () => {
    const s = scaleFrom([tok('--gap-sm', '0.5rem'), tok('--gap-md', '1rem'), tok('--gap-lg', '1.5rem')], LINT_DEFAULTS, 16);
    expect(s.values).toEqual([8, 16, 24]);
    expect(scaleFrom([tok('--gap-sm', '0.5rem'), tok('--gap-md', '1rem'), tok('--gap-lg', '1.5rem')], LINT_DEFAULTS, 10).values)
      .toEqual([5, 10, 15]);
  });

  it('prefers the scale step over an alias holding the same value', () => {
    // The demo's tokens page: --gap-md is shorter, but --space-* is the scale.
    expect(scaleFrom([...SPACE, tok('--gap-md', '16px')]).tokens.get(16)).toBe('--space-4');
    expect(scaleFrom([tok('--gap-md', '16px'), ...SPACE]).tokens.get(16)).toBe('--space-4');
  });

  it('breaks a tie within a family by the shorter name, the same way every run', () => {
    const s = scaleFrom([...SPACE, tok('--space-component-padding', '16px')]);
    expect(s.tokens.get(16)).toBe('--space-4');
  });

  it('does not trust fewer than three spacing tokens as a scale', () => {
    const s = scaleFrom([tok('--gap', '12px'), tok('--space-x', '16px')]);
    expect(s.source).toBe('base');
    expect(s.values.slice(0, 4)).toEqual([4, 8, 12, 16]);
  });

  it('uses Tailwind v4\'s --spacing unit as the base', () => {
    const s = scaleFrom([tok('--spacing', '0.25rem')], { base: 8, allow: [], max: 32 });
    expect(s.source).toBe('base');
    expect(s.values).toEqual([4, 8, 12, 16, 20, 24, 28, 32]);
  });

  it('ignores zero, negative, non-length and absurd values', () => {
    const s = scaleFrom([...SPACE, tok('--space-0', '0px'), tok('--space-neg', '-8px'),
      tok('--space-auto', 'auto'), tok('--space-huge', '9999px'), tok('--space-calc', 'calc(1px + 2px)')]);
    expect(s.values).toEqual([4, 8, 12, 16, 24, 32]);
  });

  it('falls back to multiples of the base, plus anything allowed', () => {
    const s = scaleFrom([], { base: 8, allow: [4, 12], max: 32 });
    expect(s.values).toEqual([4, 8, 12, 16, 24, 32]);
  });
});

describe('check', () => {
  const s = scaleFrom(SPACE);

  it('passes a value on the scale', () => {
    expect(check(16, s)).toEqual({ ok: true });
  });

  it('names the token that fixes an off-scale value', () => {
    expect(check(14, s)).toEqual({ ok: false, suggestion: 16, token: '--space-4' });
  });

  it('always flags a fraction, even right beside a scale value', () => {
    expect(check(15.5, s)).toEqual({ ok: false, suggestion: 16, token: '--space-4' });
    expect(check(16.1, s).ok).toBe(true); // rendering noise under a quarter pixel is not a decision
  });

  it('breaks a tie towards the larger value', () => {
    expect(check(10, s).suggestion).toBe(12);
  });

  it('suggests the end of the scale for a value beyond it', () => {
    expect(check(60, s)).toEqual({ ok: false, suggestion: 32, token: '--space-8' });
  });

  it('gives a number but no token when the scale is numeric', () => {
    expect(check(14, scaleFrom([], { base: 8, allow: [], max: 64 }))).toEqual({ ok: false, suggestion: 16 });
  });
});

describe('analyze', () => {
  const s = scaleFrom(SPACE);

  it('reads each side of a container\'s padding as its own band', () => {
    const r = analyze([box({ padding: [16, 14, 16, 14] })], s);
    expect(r.bands.filter((b) => b.kind === 'padding').map((b) => b.value).sort()).toEqual([14, 14, 16, 16]);
    expect(r.issues).toBe(2);
  });

  it('puts padding inside the border, not over it', () => {
    const r = analyze([box({ padding: [0, 0, 0, 16], border: [0, 0, 0, 2], rect: R(10, 0, 100, 50) })], s);
    expect(r.bands[0]!.rect).toEqual({ x: 12, y: 0, w: 16, h: 50 });
  });

  it('measures a gap between children side by side', () => {
    const r = analyze([box({ children: [R(0, 0, 100, 40), R(114, 0, 100, 40)] })], s);
    expect(r.bands).toHaveLength(1);
    expect(r.bands[0]).toMatchObject({ kind: 'gap', axis: 'x', value: 14, ok: false, token: '--space-4' });
    expect(r.bands[0]!.rect).toEqual({ x: 100, y: 0, w: 14, h: 40 });
  });

  it('measures a gap between stacked children', () => {
    const r = analyze([box({ children: [R(0, 0, 200, 40), R(0, 64, 200, 40)] })], s);
    expect(r.bands[0]).toMatchObject({ axis: 'y', value: 24, ok: true });
  });

  it('band only spans where the two children face each other', () => {
    const r = analyze([box({ children: [R(0, 0, 100, 60), R(116, 20, 100, 60)] })], s);
    expect(r.bands[0]!.rect).toEqual({ x: 100, y: 20, w: 16, h: 40 });
  });

  it('skips space-between and its relatives, which nobody chose', () => {
    for (const justify of ['space-between', 'space-around', 'space-evenly']) {
      const r = analyze([box({ justify, children: [R(0, 0, 50, 40), R(337, 0, 50, 40)] })], s);
      expect(r.bands).toHaveLength(0);
    }
    expect(analyze([box({ align: 'space-between', children: [R(0, 0, 50, 40), R(0, 300, 50, 40)] })], s).bands).toHaveLength(0);
  });

  it('skips overlaps, slivers and diagonals', () => {
    expect(analyze([box({ children: [R(0, 0, 100, 40), R(90, 0, 100, 40)] })], s).bands).toHaveLength(0);
    expect(analyze([box({ children: [R(0, 0, 100, 40), R(100.2, 0, 100, 40)] })], s).bands).toHaveLength(0);
    expect(analyze([box({ children: [R(0, 0, 100, 40), R(150, 80, 100, 40)] })], s).bands).toHaveLength(0);
  });

  it('leaves gaps wider than the limit alone, as layout rather than spacing', () => {
    const r = analyze([box({ children: [R(0, 0, 100, 40), R(400, 0, 100, 40)] })], s, { ...LINT_DEFAULTS, max: 128 });
    expect(r.bands).toHaveLength(0);
  });

  it('only measures consecutive children, so a wrapped row adds no false gap', () => {
    // Row of two, then a third wrapped beneath the first.
    const r = analyze([box({ children: [R(0, 0, 100, 40), R(116, 0, 100, 40), R(0, 56, 100, 40)] })], s);
    expect(r.bands.map((b) => b.value)).toEqual([16]);
  });

  it('ignores a container of zero size rather than drawing negative bands', () => {
    expect(analyze([box({ rect: R(0, 0, 0, 0), padding: [8, 8, 8, 8] })], s).bands).toHaveLength(0);
  });

  it('copes with nothing at all', () => {
    expect(analyze([], s)).toMatchObject({ bands: [], issues: 0 });
  });

  it('stays quick on a large page', () => {
    const boxes: LintBox[] = [];
    for (let i = 0; i < 3000; i++) {
      boxes.push(box({ padding: [8, 12, 8, 12], children: Array.from({ length: 6 }, (_, k) => R(k * 50, 0, 40, 30)) }));
    }
    const t0 = performance.now();
    const r = analyze(boxes, s);
    expect(performance.now() - t0).toBeLessThan(200);
    expect(r.bands.length).toBe(3000 * (4 + 5));
  });
});

describe('bandLabel', () => {
  it('says the fix in tokens when there is one, and numbers otherwise', () => {
    expect(bandLabel({ rect: R(0, 0, 1, 1), value: 14, axis: 'x', kind: 'gap', ok: false, suggestion: 16, token: '--space-4' }))
      .toBe('14 → --space-4');
    expect(bandLabel({ rect: R(0, 0, 1, 1), value: 14, axis: 'x', kind: 'gap', ok: false, suggestion: 16 })).toBe('14 → 16');
    expect(bandLabel({ rect: R(0, 0, 1, 1), value: 16, axis: 'x', kind: 'gap', ok: true })).toBe('16');
  });
});
