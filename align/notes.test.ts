import { describe, expect, it } from 'vitest';
import {
  frameCrop, looksLikeThisTab, nextNumber, notesToMarkdown, outputSize,
  rectFrom, reviveNotes, shorthand, type Note,
} from './notes';

const note = (p: Partial<Note> = {}): Note => ({
  id: 'a',
  n: 1,
  comment: 'too loud',
  page: { path: '/pricing', viewport: { w: 1440, h: 900 } },
  rect: { x: 10, y: 20, w: 200, h: 44 },
  ...p,
});

describe('rectFrom', () => {
  it('is the same rectangle whichever way the drag went', () => {
    const want = { x: 10, y: 20, w: 90, h: 30 };
    expect(rectFrom(10, 20, 100, 50)).toEqual(want);
    expect(rectFrom(100, 50, 10, 20)).toEqual(want);
    expect(rectFrom(100, 20, 10, 50)).toEqual(want);
  });
});

describe('frameCrop', () => {
  const vp = { w: 1000, h: 500 };

  it('scales a region into a device-resolution frame', () => {
    // A 2x screen: the frame is twice the viewport on both axes.
    expect(frameCrop({ x: 100, y: 50, w: 200, h: 100 }, vp, { w: 2000, h: 1000 }))
      .toEqual({ x: 200, y: 100, w: 400, h: 200 });
  });

  it('scales into a frame the browser shrank, per axis', () => {
    // Downscaled to 800 wide, and not quite proportionally.
    expect(frameCrop({ x: 100, y: 50, w: 200, h: 100 }, vp, { w: 800, h: 401 }))
      .toEqual({ x: 80, y: 40, w: 160, h: 81 });
  });

  it('rounds outward so a half-pixel edge is kept', () => {
    const c = frameCrop({ x: 10.5, y: 10.5, w: 9, h: 9 }, vp, { w: 1000, h: 500 })!;
    expect(c.x).toBe(10);
    expect(c.x + c.w).toBe(20);
  });

  it('clamps a region dragged past the edge of the window', () => {
    expect(frameCrop({ x: -50, y: 450, w: 200, h: 200 }, vp, { w: 1000, h: 500 }))
      .toEqual({ x: 0, y: 450, w: 150, h: 50 });
  });

  it('returns nothing for a region entirely off screen or of no size', () => {
    expect(frameCrop({ x: 2000, y: 0, w: 10, h: 10 }, vp, { w: 1000, h: 500 })).toBeNull();
    expect(frameCrop({ x: 10, y: 10, w: 0, h: 10 }, vp, { w: 1000, h: 500 })).toBeNull();
    expect(frameCrop({ x: 10, y: 10, w: 10, h: 10 }, { w: 0, h: 0 }, { w: 1000, h: 500 })).toBeNull();
  });
});

describe('looksLikeThisTab', () => {
  it('accepts a frame with the viewport shape at any resolution', () => {
    expect(looksLikeThisTab({ w: 2880, h: 1800 }, { w: 1440, h: 900 })).toBe(true);
    expect(looksLikeThisTab({ w: 1280, h: 801 }, { w: 1440, h: 900 })).toBe(true);
  });

  it('rejects a whole screen or a window, which a viewport crop would miss', () => {
    // A 1440x900 viewport inside a 1920x1080 monitor, and a window with its
    // title bar and tabs included.
    expect(looksLikeThisTab({ w: 1920, h: 1080 }, { w: 1440, h: 900 })).toBe(false);
    expect(looksLikeThisTab({ w: 1440, h: 1000 }, { w: 1440, h: 900 })).toBe(false);
  });

  it('rejects nonsense sizes rather than dividing by zero', () => {
    expect(looksLikeThisTab({ w: 0, h: 0 }, { w: 1440, h: 900 })).toBe(false);
  });
});

describe('outputSize', () => {
  it('keeps anything under the cap at full resolution', () => {
    expect(outputSize(1200, 800)).toEqual({ w: 1200, h: 800 });
  });

  it('scales the longest side down to the cap, keeping the shape', () => {
    expect(outputSize(4000, 1000)).toEqual({ w: 2000, h: 500 });
    expect(outputSize(1000, 5000)).toEqual({ w: 400, h: 2000 });
  });
});

describe('shorthand', () => {
  it('collapses the way CSS is written by hand', () => {
    expect(shorthand([8, 8, 8, 8])).toBe('8');
    expect(shorthand([8, 16, 8, 16])).toBe('8 16');
    expect(shorthand([8, 16, 4, 16])).toBe('8 16 4');
    expect(shorthand([1, 2, 3, 4])).toBe('1 2 3 4');
  });

  it('keeps fractions, which are often the point', () => {
    expect(shorthand([0.5, 0.5, 0.5, 0.5])).toBe('0.5');
  });
});

describe('notesToMarkdown', () => {
  it('is empty for no notes', () => {
    expect(notesToMarkdown([])).toBe('');
  });

  it('carries the comment, the image path and the numbers', () => {
    const md = notesToMarkdown([note({
      image: { file: 'note-1.png', path: '/work/app/.align/notes/note-1.png' },
      target: {
        selector: 'main > button.cta', label: 'button.cta',
        size: { w: 180, h: 44 },
        padding: [12, 20, 12, 20], border: [1, 1, 1, 1], margin: [0, 0, 0, 0],
      },
    })]);
    expect(md).toContain('# UI feedback — 1 note');
    expect(md).toContain('too loud');
    expect(md).toContain('![note 1](/work/app/.align/notes/note-1.png)');
    expect(md).toContain('- Selector: `main > button.cta`');
    expect(md).toContain('180×44 · padding 12 20 · border 1 · margin 0');
    expect(md).toContain('Open the image path');
  });

  it('keeps a path with spaces inside the link', () => {
    const md = notesToMarkdown([note({
      image: { file: 'note-1.png', path: 'C:\\Users\\Me\\My Projects\\app\\.align\\notes\\note-1.png' },
    })]);
    expect(md).toContain('![note 1](<C:\\Users\\Me\\My Projects\\app\\.align\\notes\\note-1.png>)');
  });

  it('names the file when the image only reached the downloads folder', () => {
    const md = notesToMarkdown([note({ image: { file: 'align-note-1.png' } })]);
    expect(md).toContain('`align-note-1.png` (downloads folder)');
    expect(md).not.toContain('![');
  });

  it('groups by page, keeps each page\'s notes in order', () => {
    const md = notesToMarkdown([
      note({ id: 'a', n: 1, page: { path: '/a', viewport: { w: 100, h: 100 } } }),
      note({ id: 'b', n: 2, page: { path: '/b', viewport: { w: 100, h: 100 } } }),
      note({ id: 'c', n: 3, page: { path: '/a', viewport: { w: 100, h: 100 } } }),
    ]);
    const a = md.indexOf('## /a');
    const b = md.indexOf('## /b');
    expect(a).toBeGreaterThan(-1);
    expect(b).toBeGreaterThan(a);
    // Note 3 sits under /a, before /b's heading.
    expect(md.indexOf('### 3.')).toBeLessThan(b);
    expect(md.match(/## \/a/g)).toHaveLength(1);
  });

  it('lists what edit mode tried, marked as not yet in source', () => {
    const md = notesToMarkdown([note({
      changes: [{ prop: 'box-shadow', from: '', to: '0 2px 6px rgb(0 0 0 / 0.2)' }],
    })]);
    expect(md).toContain('Tried in the browser, not yet in source');
    expect(md).toContain('`box-shadow`: `(unset)` → `0 2px 6px rgb(0 0 0 / 0.2)`');
  });

  it('calls a dragged region a region', () => {
    expect(notesToMarkdown([note()])).toContain('### 1. Region');
  });

  it('names a region by its container and contents, not the container\'s box model', () => {
    const md = notesToMarkdown([note({
      region: true,
      target: {
        selector: 'main.stage', label: 'main.stage', path: 'body > main.stage',
        size: { w: 1520.8, h: 1400 },
        padding: [0, 0, 0, 0], border: [0, 0, 0, 0], margin: [0, 0, 0, 0],
      },
      inside: [{ selector: 'div.row', count: 6 }, { selector: 'h2', count: 1, text: 'Plans' }],
    })]);
    expect(md).toContain('### 1. Region inside `main.stage`');
    expect(md).toContain('- Inside: `body > main.stage`');
    expect(md).toContain('- Contains: `div.row` ×6, `h2` ("Plans")');
    // The container's size is not what the note is about.
    expect(md).not.toContain('1520.8');
  });

  it('tells identical siblings apart by their text and path', () => {
    const md = notesToMarkdown([note({
      target: {
        selector: 'a.tab', label: 'a.tab', text: 'Two', path: 'nav.tabs > a.tab:nth-of-type(2)',
        size: { w: 80, h: 28 },
        padding: [0, 0, 0, 0], border: [0, 0, 0, 0], margin: [0, 0, 0, 0],
      },
    })]);
    expect(md).toContain('- Selector: `a.tab` — "Two"');
    expect(md).toContain('- Path: `nav.tabs > a.tab:nth-of-type(2)`');
  });
});

describe('reviveNotes', () => {
  it('round-trips what it is given', () => {
    const full = note({
      region: true,
      inside: [{ selector: 'div.row', count: 6, text: 'x' }],
      target: {
        selector: 's', label: 'l', size: { w: 1, h: 2 },
        padding: [1, 2, 3, 4], border: [0, 0, 0, 0], margin: [5, 5, 5, 5],
        text: 'Two', path: 'nav > a:nth-of-type(2)',
      },
      changes: [{ prop: 'color', from: 'red', to: 'blue' }],
      image: { file: 'f.png', path: '/p/f.png' },
    });
    expect(reviveNotes(JSON.parse(JSON.stringify([full])))).toEqual([full]);
  });

  it('drops anything malformed rather than throwing', () => {
    expect(reviveNotes(null)).toEqual([]);
    expect(reviveNotes('nope')).toEqual([]);
    expect(reviveNotes([null, 4, {}, { id: 'x' }])).toEqual([]);
    expect(reviveNotes([note({ rect: { x: NaN, y: 0, w: 1, h: 1 } })])).toEqual([]);
  });

  it('keeps a good note and loses only its broken parts', () => {
    const bent = { ...note(), target: { selector: 's' }, image: { path: 42 } };
    const [back] = reviveNotes([bent]);
    expect(back).toBeDefined();
    expect(back!.target).toBeUndefined();
    expect(back!.image).toBeUndefined();
  });
});

describe('nextNumber', () => {
  it('starts at one and continues past the highest', () => {
    expect(nextNumber([])).toBe(1);
    expect(nextNumber([note({ n: 1 }), note({ n: 4 })])).toBe(5);
  });
});
