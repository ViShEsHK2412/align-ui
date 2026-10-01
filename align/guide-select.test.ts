import { describe, expect, it } from 'vitest';
import { clearAxis, dragGroup, duplicate, guidesIn, prune, removeSelected, shift, toggle } from './guide-select';
import type { Guide } from './types';

const G = (id: number, axis: Guide['axis'], at: number, extra: Partial<Guide> = {}): Guide =>
  ({ id, axis, at, locked: false, caught: '', pinned: false, ...extra });

const SET = [G(1, 'x', 100), G(2, 'x', 200), G(3, 'y', 150), G(4, 'y', 400), G(5, 'x', 300, { pinned: true })];
const NO_SCROLL = { x: 0, y: 0 };

describe('guidesIn', () => {
  it('catches vertical guides by x and horizontal ones by y', () => {
    expect(guidesIn(SET, { x: 90, y: 140, w: 120, h: 20 }, NO_SCROLL).sort()).toEqual([1, 2, 3]);
  });

  it('counts a guide on the edge of the marquee', () => {
    expect(guidesIn(SET, { x: 100, y: 0, w: 0.5, h: 1 }, NO_SCROLL)).toEqual([1]);
  });

  it('takes a marquee dragged up and to the left', () => {
    expect(guidesIn(SET, { x: 210, y: 160, w: -120, h: -20 }, NO_SCROLL).sort()).toEqual([1, 2, 3]);
  });

  it('compares in the viewport, so a scrolled page still selects what you drew around', () => {
    // Page y 400 sits at viewport y 100 after scrolling 300.
    expect(guidesIn(SET, { x: 0, y: 90, w: 10, h: 20 }, { x: 0, y: 300 })).toEqual([4]);
  });

  it('includes pinned guides: selecting one is not changing it', () => {
    expect(guidesIn(SET, { x: 290, y: 0, w: 20, h: 1 }, NO_SCROLL)).toEqual([5]);
  });
});

describe('toggle and prune', () => {
  it('adds, then removes', () => {
    const one = toggle(new Set(), 3);
    expect([...one]).toEqual([3]);
    expect([...toggle(one, 3)]).toEqual([]);
  });

  it('forgets guides that are gone', () => {
    expect([...prune(new Set([1, 9, 3]), SET)].sort()).toEqual([1, 3]);
  });
});

describe('shift', () => {
  it('moves the selected guides on the arrow\'s axis, and only those', () => {
    const out = shift(SET, new Set([1, 2, 3]), 'x', 10);
    expect(out.map((g) => g.at)).toEqual([110, 210, 150, 400, 300]);
  });

  it('leaves a pinned guide where it is', () => {
    expect(shift(SET, new Set([5]), 'x', 10)[4]!.at).toBe(300);
  });

  it('clears what a moved guide had snapped to, and nothing else', () => {
    const out = shift([G(1, 'x', 0, { caught: 'div left' }), G(2, 'x', 5, { caught: 'p right' })], new Set([1]), 'x', 1);
    expect(out.map((g) => g.caught)).toEqual(['', 'p right']);
  });

  it('does not mutate what it was given, so the undo snapshot stays true', () => {
    const before = SET.map((g) => g.at);
    shift(SET, new Set([1, 2]), 'x', 50);
    expect(SET.map((g) => g.at)).toEqual(before);
  });
});

describe('dragGroup', () => {
  const from = new Map(SET.map((g) => [g.id, g.at]));

  it('keeps the group rigid: same-axis guides follow the grabbed one exactly', () => {
    // Guide 1 was dragged (and snapped) from 100 to 137.
    const moved = SET.map((g) => (g.id === 1 ? { ...g, at: 137 } : g));
    const out = dragGroup(moved, new Set([1, 2, 3]), 1, from, { x: 35, y: 12 });
    expect(out.find((g) => g.id === 2)!.at).toBe(237);
  });

  it('moves selected guides across the axis by the pointer\'s travel on theirs', () => {
    const moved = SET.map((g) => (g.id === 1 ? { ...g, at: 137 } : g));
    const out = dragGroup(moved, new Set([1, 3]), 1, from, { x: 35, y: 12 });
    expect(out.find((g) => g.id === 3)!.at).toBe(162);
  });

  it('leaves unselected and pinned guides alone', () => {
    const moved = SET.map((g) => (g.id === 1 ? { ...g, at: 137 } : g));
    const out = dragGroup(moved, new Set([1, 5]), 1, from, { x: 37, y: 0 });
    expect(out.find((g) => g.id === 2)!.at).toBe(200);
    expect(out.find((g) => g.id === 5)!.at).toBe(300);
  });

  it('measures from where the drag began, so moves do not compound', () => {
    let list = SET;
    for (const to of [110, 120, 130]) {
      list = list.map((g) => (g.id === 1 ? { ...g, at: to } : g));
      list = dragGroup(list, new Set([1, 2]), 1, from, { x: to - 100, y: 0 });
    }
    expect(list.find((g) => g.id === 2)!.at).toBe(230);
  });
});

describe('removeSelected and clearAxis', () => {
  it('removes the selection but never a pinned guide', () => {
    expect(removeSelected(SET, new Set([1, 3, 5])).map((g) => g.id)).toEqual([2, 4, 5]);
  });

  it('clears one axis and keeps the other, and the pinned', () => {
    expect(clearAxis(SET, 'x').map((g) => g.id)).toEqual([3, 4, 5]);
    expect(clearAxis(SET, 'y').map((g) => g.id)).toEqual([1, 2, 5]);
  });
});

describe('duplicate', () => {
  it('copies in place with fresh ids, unpinned and unlocked', () => {
    let n = 100;
    const { copies, map } = duplicate([G(1, 'x', 10, { pinned: true, locked: true, caught: 'a' }), G(2, 'y', 5)], new Set([1, 2]), () => n++);
    expect(copies).toEqual([
      { id: 100, axis: 'x', at: 10, locked: false, pinned: false, caught: 'a' },
      { id: 101, axis: 'y', at: 5, locked: false, pinned: false, caught: '' },
    ]);
    expect([...map]).toEqual([[1, 100], [2, 101]]);
  });

  it('copies only what was asked', () => {
    expect(duplicate(SET, new Set([3]), () => 9).copies.map((g) => g.at)).toEqual([150]);
  });
});
