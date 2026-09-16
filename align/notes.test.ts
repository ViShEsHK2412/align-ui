import { describe, expect, it } from 'vitest';
import {
  frameCrop, iou, looksLikeThisTab, nextNumber, notesToMarkdown, outputSize,
  anchorIn, areaFrom, barLift, clampPin, clampToViewport, layoutPins, quote, rectFrom, reviveNotes, shorthand, subjectOf, type Note,
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
    expect(md).toContain('> too loud');
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

describe('subjectOf', () => {
  const R = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });

  it('treats a loose drag around one element as that element', () => {
    // Your note 2: a 104.8x43.2 drag around the 80x28 "One" tab.
    expect(subjectOf(R(464, 57.4, 104.8, 43.2), [R(476, 64, 80, 28)], R(0, 40, 1521, 1400))).toBe(0);
  });

  it('keeps a drag over several elements an area', () => {
    expect(subjectOf(R(0, 0, 300, 300), [R(10, 10, 50, 50), R(100, 10, 50, 50)], null)).toBeNull();
  });

  it('treats a drag drawn just inside an element as that element', () => {
    expect(subjectOf(R(22, 22, 196, 96), [], R(20, 20, 200, 100))).toBe('container');
  });

  it('keeps a small drag inside a big container an area', () => {
    // Empty space in the middle of a page: not a claim about the page.
    expect(subjectOf(R(400, 300, 120, 80), [], R(0, 0, 1500, 1400))).toBeNull();
  });

  it('keeps an empty drag with no container an area', () => {
    expect(subjectOf(R(0, 0, 10, 10), [], null)).toBeNull();
  });
});

describe('iou', () => {
  it('is 1 for the same rectangle and 0 for disjoint ones', () => {
    const a = { x: 0, y: 0, w: 10, h: 10 };
    expect(iou(a, a)).toBe(1);
    expect(iou(a, { x: 20, y: 20, w: 5, h: 5 })).toBe(0);
    expect(iou(a, { x: 5, y: 0, w: 10, h: 10 })).toBeCloseTo(50 / 150, 6);
  });
});

describe('clampToViewport', () => {
  const vp = { w: 1036, h: 647 };
  it('trims a drag that ran off the right and bottom edges', () => {
    expect(clampToViewport({ x: 1000, y: 600, w: 150, h: 120 }, vp)).toEqual({ x: 1000, y: 600, w: 36, h: 47 });
  });
  it('trims a drag that started off the top-left', () => {
    expect(clampToViewport({ x: -40, y: -10, w: 100, h: 50 }, vp)).toEqual({ x: 0, y: 0, w: 60, h: 40 });
  });
  it('leaves nothing of a drag entirely outside', () => {
    const r = clampToViewport({ x: 2000, y: 10, w: 50, h: 50 }, vp);
    expect(r.w).toBe(0);
  });
  it('leaves an on-screen drag alone', () => {
    const r = { x: 10, y: 10, w: 100, h: 100 };
    expect(clampToViewport(r, vp)).toEqual(r);
  });
});

describe('quote', () => {
  it('stops a typed heading forging a note', () => {
    const md = notesToMarkdown([note({ n: 2, comment: '### 99. Fake heading\nsecond line' })]);
    // Exactly one real heading per note, and the typed one is inside a quote.
    expect(md.match(/^### /gm)).toHaveLength(1);
    expect(md).toContain('> ### 99. Fake heading\n> second line');
  });

  it('keeps an unclosed fence from swallowing the notes after it', () => {
    const md = notesToMarkdown([
      note({ id: 'a', n: 1, comment: 'look ``` here' }),
      note({ id: 'b', n: 2, comment: 'next' }),
    ]);
    expect(md).toContain('> look ``` here');
    expect(md).toContain('### 2. Region');
  });

  it('keeps blank lines inside the quote', () => {
    expect(quote('one\n\ntwo')).toBe('> one\n>\n> two');
  });

  it('normalises Windows line endings', () => {
    expect(quote('a\r\nb')).toBe('> a\n> b');
  });

  it('says so when there is nothing to quote', () => {
    expect(quote('   ')).toBe('> _(no comment)_');
  });
});

describe('layoutPins', () => {
  it('fans out pins that share a corner, first note keeps the corner', () => {
    const out = layoutPins([{ x: 100, y: 50 }, { x: 100, y: 50 }, { x: 100, y: 50 }], 20);
    expect(out).toEqual([{ x: 100, y: 50 }, { x: 122, y: 50 }, { x: 144, y: 50 }]);
  });
  it('leaves pins that do not collide exactly where they are', () => {
    const anchors = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }];
    expect(layoutPins(anchors, 20)).toEqual(anchors);
  });
  it('treats near misses as collisions, since a pin 5px over still hides the number', () => {
    const out = layoutPins([{ x: 100, y: 50 }, { x: 105, y: 53 }], 20);
    expect(Math.abs(out[1]!.x - out[0]!.x)).toBeGreaterThanOrEqual(20);
  });
  it('keeps fanning past a pin already sitting in the next slot', () => {
    const out = layoutPins([{ x: 100, y: 0 }, { x: 122, y: 0 }, { x: 100, y: 0 }], 20);
    expect(out[2]).toEqual({ x: 144, y: 0 });
  });
});

describe('clampPin', () => {
  const vp = { w: 1000, h: 600 };
  it('pulls a pin at the left or top edge fully inside', () => {
    expect(clampPin(0, 0, 20, vp)).toEqual({ x: 11, y: 11 });
  });
  it('pulls a pin past the right or bottom edge fully inside', () => {
    expect(clampPin(1000, 600, 20, vp)).toEqual({ x: 989, y: 589 });
  });
  it('leaves a pin well inside alone', () => {
    expect(clampPin(300, 200, 20, vp)).toEqual({ x: 300, y: 200 });
  });
});

describe('anchorIn and areaFrom', () => {
  const el = { x: 100, y: 200, w: 400, h: 100 };
  const area = { x: 150, y: 220, w: 80, h: 30 };

  it('round-trips while the element stays put', () => {
    expect(areaFrom(anchorIn(area, el)!, el)).toEqual(area);
  });

  it('follows the element when a canvas zooms it to half size and pans it', () => {
    const zoomed = { x: 10, y: 20, w: 200, h: 50 };
    expect(areaFrom(anchorIn(area, el)!, zoomed)).toEqual({ x: 35, y: 30, w: 40, h: 15 });
  });

  it('has nothing to anchor to on an element with no size', () => {
    expect(anchorIn(area, { x: 0, y: 0, w: 0, h: 10 })).toBeNull();
  });

  it('survives storage', () => {
    const n = note({ anchor: { fx: 0.125, fy: 0.2, fw: 0.2, fh: 0.3 } });
    expect(reviveNotes(JSON.parse(JSON.stringify([n])))[0]!.anchor).toEqual(n.anchor);
  });
});

describe('barLift', () => {
  const vp = { w: 1036, h: 703 };
  const bar = { x: 330, y: 650, w: 380, h: 37 };

  it('lifts the bar above a docked toolbar it sits on', () => {
    // The interaction lab HUD: 520 wide, 36 tall, 16 from the bottom.
    const hud = { x: 258, y: 651, w: 520, h: 36 };
    expect(barLift(bar, [hud], vp)).toBe(703 - 651 + 8);
  });

  it('stays put when nothing is underneath', () => {
    expect(barLift(bar, [], vp)).toBeNull();
    expect(barLift(bar, [{ x: 0, y: 0, w: 200, h: 40 }], vp)).toBeNull();
  });

  it('ignores page content that merely reaches the bottom', () => {
    // A full-width footer or a tall panel is the page, not a toolbar.
    expect(barLift(bar, [{ x: 0, y: 620, w: 1036, h: 83 }], vp)).toBeNull();
    expect(barLift(bar, [{ x: 300, y: 300, w: 500, h: 403 }], vp)).toBeNull();
  });

  it('clears the highest of several blockers', () => {
    const a = { x: 400, y: 660, w: 100, h: 30 };
    const b = { x: 450, y: 600, w: 200, h: 90 };
    expect(barLift(bar, [a, b], vp)).toBe(703 - 600 + 8);
  });
});
