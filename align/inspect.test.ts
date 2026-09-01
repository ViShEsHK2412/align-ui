import { describe, expect, it } from 'vitest';
import {
  describeGap, distinctValues, firstFamily, gapDistribution, matchTokens,
  tokenSummary, weightName, type Token,
} from './inspect';

const t = (name: string, value: string): Token =>
  ({ name, value, px: parseFloat(value) });

const SCALE = [
  t('--space-2', '8px'), t('--space-4', '16px'), t('--space-6', '24px'),
  t('--gap-md', '16px'), t('--brand', '#3b6fe0'), t('--radius', '8px'),
];

describe('firstFamily', () => {
  it('takes the family that actually renders, not the fallbacks', () => {
    expect(firstFamily('Inter, ui-sans-serif, system-ui')).toBe('Inter');
  });

  it('strips the quotes a multi-word family arrives with', () => {
    expect(firstFamily('"Source Serif 4", Georgia, serif')).toBe('Source Serif 4');
    expect(firstFamily("'IBM Plex Mono', monospace")).toBe('IBM Plex Mono');
  });

  it('copes with a single unquoted family', () => {
    expect(firstFamily('monospace')).toBe('monospace');
  });
});

describe('weightName', () => {
  it('gives the number and the name together', () => {
    expect(weightName('400')).toBe('400 regular');
    expect(weightName('700')).toBe('700 bold');
  });

  it('leaves a weight off the scale as the bare number', () => {
    expect(weightName('450')).toBe('450');
  });
});

describe('matchTokens', () => {
  it('names every token holding that value, not just the first', () => {
    // Two tokens can legitimately share a value, and picking one would be a lie.
    expect(matchTokens(16, SCALE)).toEqual(['--gap-md', '--space-4']);
  });

  it('sorts them, so the same element reads the same way twice', () => {
    // Computed style enumerates in its own order; the readout must not reshuffle.
    const shuffled = [t('--z-last', '16px'), t('--a-first', '16px')];
    expect(matchTokens(16, shuffled)).toEqual(['--a-first', '--z-last']);
  });

  it('says nothing when the value is off the scale', () => {
    expect(matchTokens(13, SCALE)).toEqual([]);
  });

  it('ignores tokens that are not lengths', () => {
    expect(matchTokens(NaN, SCALE)).toEqual([]);
    expect(matchTokens(0x3b6fe0, SCALE)).toEqual([]);
  });

  it('tolerates the hundredth-of-a-pixel a computed value can carry', () => {
    expect(matchTokens(16.004, SCALE)).toEqual(['--gap-md', '--space-4']);
    expect(matchTokens(16.5, SCALE)).toEqual([]);
  });
});

describe('distinctValues', () => {
  it('keeps first-seen order and drops repeats', () => {
    expect(distinctValues([16, 24, 16, 8, 24])).toEqual([16, 24, 8]);
  });

  it('drops zero, since every box has zeros and none are decisions', () => {
    expect(distinctValues([0, 16, 0, 0])).toEqual([16]);
  });

  it('drops values that are not numbers', () => {
    expect(distinctValues([NaN, 12])).toEqual([12]);
  });
});

describe('tokenSummary', () => {
  it('names the token behind each value', () => {
    expect(tokenSummary([16, 24], SCALE)).toBe('16 --gap-md --space-4  ·  24 --space-6');
  });

  it('marks a value with no token, which is the one worth seeing', () => {
    expect(tokenSummary([13], SCALE)).toBe('13 —');
  });

  it('says nothing at all on a page with no tokens', () => {
    expect(tokenSummary([16, 24], [])).toBe('');
  });
});

describe('describeGap', () => {
  const fact = (over: Partial<import('./inspect').GapFact> = {}) =>
    ({ px: 24, cssGap: 24, margins: 0, siblings: true, ...over });

  it('names a flex gap as a flex gap', () => {
    expect(describeGap(fact())).toBe('gap 24');
  });

  it('names margins when the parent sets no gap', () => {
    expect(describeGap(fact({ cssGap: null, margins: 24 }))).toBe('margins 24');
  });

  it('names both when both are doing work', () => {
    expect(describeGap(fact({ px: 32, cssGap: 24, margins: 8 }))).toBe('gap 24 · margins 8');
  });

  it('says the rest came from layout when the parts do not add up', () => {
    // gap 0, no margins, 24px of space: justify-content or an auto margin.
    expect(describeGap(fact({ px: 24, cssGap: 0, margins: 0 })))
      .toBe('gap 0 · rest from layout');
  });

  it('refuses to attribute a gap between elements that are not siblings', () => {
    expect(describeGap(fact({ siblings: false }))).toBe('not siblings');
  });
});

describe('gapDistribution', () => {
  it('counts each size, commonest first', () => {
    expect(gapDistribution([24, 24, 18, 24])).toBe('24 ×3 · 18 ×1');
  });

  it('stays quiet when every gap agrees, since there is nothing to compare', () => {
    expect(gapDistribution([24, 24, 24])).toBe('');
    expect(gapDistribution([24])).toBe('');
    expect(gapDistribution([])).toBe('');
  });

  it('breaks a tie on count by the smaller value, so the order is stable', () => {
    expect(gapDistribution([18, 24])).toBe('18 ×1 · 24 ×1');
  });

  it('states the distribution and never grades it', () => {
    // GuideFrame appends "· inconsistent" here; that is the judgement we do not make.
    expect(gapDistribution([24, 18])).not.toContain('inconsistent');
  });
});
