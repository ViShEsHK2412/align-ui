import { describe, expect, it } from 'vitest';
import {
  buildSelector, describeGap, distinctValues, firstFamily, gapDistribution,
  looksLikeColour, matchTokens, parseTracks, shortFile, tokenSummary,
  diffStyles, trackIndex, weightName, type Token,
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

describe('looksLikeColour', () => {
  it('takes every syntax a token might be written in', () => {
    for (const v of ['#fff', '#6ea8fe', 'rgb(1 2 3)', 'rgba(1,2,3,.5)',
                     'hsl(200 50% 50%)', 'oklch(0.7 0.1 250)', 'lab(50 20 -30)',
                     'color(display-p3 1 0 0)', 'white', 'black']) {
      expect(looksLikeColour(v)).toBe(true);
    }
  });

  it('rejects the lengths and keywords it sits beside in a token scale', () => {
    for (const v of ['16px', '1.5', '0', '', '  ', 'auto', 'Inter, sans-serif',
                     '2px solid', '50%']) {
      expect(looksLikeColour(v)).toBe(false);
    }
  });

  it('does not care about case or padding', () => {
    expect(looksLikeColour('  OKLCH(0.7 0.1 250)  ')).toBe(true);
    expect(looksLikeColour('  #ABCDEF ')).toBe(true);
  });
});

describe('buildSelector', () => {
  it('uses an id alone, because an id is already unique', () => {
    expect(buildSelector('div', 'main', ['card', 'wide'])).toBe('#main');
  });

  it('joins every class, not just the first', () => {
    // The first class alone would over-count: .card matches more than .card.wide.
    expect(buildSelector('div', '', ['card', 'wide'])).toBe('div.card.wide');
  });

  it('falls back to the tag when there is nothing else', () => {
    expect(buildSelector('section', '', [])).toBe('section');
  });

  it('escapes a class a selector could not otherwise express', () => {
    // Tailwind writes these constantly, and a bare `.md:flex` is a syntax error.
    expect(buildSelector('div', '', ['md:flex'])).toBe('div.md\\:flex');
    expect(buildSelector('div', '', ['w-1/2'])).toBe('div.w-1\\/2');
  });
});

describe('shortFile', () => {
  it('gives the path a dev server actually serves the file from', () => {
    expect(shortFile('http://localhost:5173/src/styles/cards.css'))
      .toBe('src/styles/cards.css');
  });

  it('drops the cache-buster a dev server appends', () => {
    expect(shortFile('http://localhost:5173/src/app.css?t=1738000000000'))
      .toBe('src/app.css');
  });

  it('names an inline stylesheet as one, since it has no file', () => {
    expect(shortFile(null)).toBe('inline <style>');
  });

  it('keeps a cross-origin path readable', () => {
    expect(shortFile('https://cdn.example.com/lib/reset.css')).toBe('lib/reset.css');
  });

  it('leaves a path with a space readable rather than percent-encoded', () => {
    expect(shortFile('http://localhost/my styles/app.css')).toBe('my styles/app.css');
  });
});

describe('similarCount, on what makes elements alike', () => {
  it('says nothing about a bare tag, which is a census not a similarity', () => {
    // selectorOf falls back to the tag when there is no class and no id; the
    // count would then be "how many divs does this page have".
    expect(buildSelector('div', '', [])).toBe('div');
  });
});

describe('parseTracks', () => {
  it('reads the used sizes a template resolved to', () => {
    expect(parseTracks('232px 232px 232px')).toEqual([232, 232, 232]);
    expect(parseTracks('  120.5px   60px ')).toEqual([120.5, 60]);
  });

  it('gives nothing rather than a guess when a track is not a length', () => {
    // A subgrid, or a template read off a display:none parent.
    expect(parseTracks('none')).toEqual([]);
    expect(parseTracks('')).toEqual([]);
    expect(parseTracks('1fr 1fr')).toEqual([]);
    expect(parseTracks('232px auto')).toEqual([]);
  });
});

describe('trackIndex', () => {
  const tracks = [100, 100, 100];

  it('finds the track an offset starts in', () => {
    expect(trackIndex(tracks, 20, 0)).toBe(0);
    expect(trackIndex(tracks, 20, 120)).toBe(1);
    expect(trackIndex(tracks, 20, 240)).toBe(2);
  });

  it('reads an item sitting exactly on a track edge as inside it', () => {
    expect(trackIndex(tracks, 20, 100)).toBe(0);
    expect(trackIndex(tracks, 20, 100.4)).toBe(0);
    expect(trackIndex(tracks, 20, 119.9)).toBe(1);
  });

  it('answers with the track an item belongs to when it lands in a gutter', () => {
    // A margin or a transform moved it; it cannot have begun in the gutter.
    expect(trackIndex(tracks, 20, 110)).toBe(1);
  });

  it('says nothing about an implicit track the template does not list', () => {
    expect(trackIndex(tracks, 20, 400)).toBe(-1);
    expect(trackIndex([], 20, 0)).toBe(-1);
  });
});

describe('diffStyles', () => {
  const base = { 'font-size': '16px', color: 'rgb(0, 0, 0)', display: 'block' };

  it('says nothing when two readings agree', () => {
    expect(diffStyles(base, { ...base })).toEqual([]);
  });

  it('reports each property that differs, with both sides', () => {
    const rows = diffStyles(base, { ...base, 'font-size': '14px' });
    expect(rows).toEqual([{ prop: 'font-size', a: '16px', b: '14px' }]);
  });

  it('reports in a fixed order rather than the order they were found', () => {
    // Box before type before colour, every time, so a repeated comparison
    // does not shuffle its own rows under you.
    const rows = diffStyles(base, { display: 'flex', color: 'red', 'font-size': '2px' });
    expect(rows.map((r) => r.prop)).toEqual(['display', 'font-size', 'color']);
  });

  it('counts a property present on one side and missing on the other', () => {
    expect(diffStyles({ color: 'red' }, {})).toEqual([{ prop: 'color', a: 'red', b: '' }]);
  });

  it('ignores properties outside the curated set', () => {
    expect(diffStyles({ zoom: '1' }, { zoom: '2' })).toEqual([]);
  });
});
