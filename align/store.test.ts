import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadFlag, loadGuides, loadPoint, saveFlag, saveGuides, savePoint } from './store';
import type { Guide } from './types';

/** A stand-in for localStorage that can also be told to misbehave. */
function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => { map.set(k, v); },
  };
}

const guide = (over: Partial<Guide> = {}): Guide =>
  ({ id: 1, axis: 'x', at: 100, locked: false, pinned: false, caught: '', ...over });

const KEY = 'align-ui:guides::/pricing';

beforeEach(() => {
  vi.stubGlobal('location', { pathname: '/pricing' });
  vi.stubGlobal('localStorage', fakeStorage());
});

describe('guides round-trip', () => {
  it('comes back the way it went in, minus the id', () => {
    saveGuides([guide({ at: 240, locked: true, pinned: true, caught: 'div.card left' })]);
    const [back] = loadGuides();
    expect(back).toEqual({
      id: 0, axis: 'x', at: 240, locked: true, pinned: true, caught: 'div.card left',
    });
  });

  it('keeps guides apart by route', () => {
    saveGuides([guide({ at: 240 })]);
    vi.stubGlobal('location', { pathname: '/blog' });
    // Same storage, different page: the pricing guides must not turn up here.
    expect(loadGuides()).toEqual([]);
  });
});

describe('surviving bad stored data', () => {
  const stored = (raw: string) => vi.stubGlobal('localStorage', fakeStorage({ [KEY]: raw }));

  it('returns nothing when there is nothing', () => {
    expect(loadGuides()).toEqual([]);
  });

  it('returns nothing rather than throwing on unparseable JSON', () => {
    stored('{not json');
    expect(loadGuides()).toEqual([]);
  });

  it('returns nothing when the JSON is valid but the wrong shape', () => {
    stored('{"guides":[]}');
    expect(loadGuides()).toEqual([]);
  });

  it('drops the entries it cannot use and keeps the ones it can', () => {
    stored(JSON.stringify([
      { axis: 'x', at: 10 },
      { axis: 'diagonal', at: 20 },     // not an axis
      { axis: 'y' },                    // no position
      { axis: 'y', at: 'soon' },        // position is not a number
      { axis: 'y', at: null },
      null,
      'a string',
      { axis: 'y', at: 40 },
    ]));
    expect(loadGuides().map((g) => [g.axis, g.at])).toEqual([['x', 10], ['y', 40]]);
  });

  it('refuses a position that is not finite', () => {
    // JSON has no Infinity, but a hand-edited value can still get here.
    stored('[{"axis":"x","at":1e999}]');
    expect(loadGuides()).toEqual([]);
  });

  it('fills in the flags an older version did not write', () => {
    stored('[{"axis":"x","at":10}]');
    expect(loadGuides()[0]).toMatchObject({ locked: false, pinned: false, caught: '' });
  });

  it('ignores a caught label that is not a string', () => {
    stored('[{"axis":"x","at":10,"caught":42}]');
    expect(loadGuides()[0]!.caught).toBe('');
  });
});

describe('when storage itself refuses', () => {
  it('reads nothing rather than throwing', () => {
    // Safari in private browsing, a file:// page, a webview with data off.
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('denied'); },
      setItem: () => { throw new Error('denied'); },
    });
    expect(() => loadGuides()).not.toThrow();
    expect(loadGuides()).toEqual([]);
  });

  it('writes nothing rather than throwing, so the tool keeps working', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw new Error('quota'); },
    });
    expect(() => saveGuides([guide()])).not.toThrow();
    expect(() => saveFlag('rulers', true)).not.toThrow();
  });
});

describe('flags and points', () => {
  it('round-trips a flag, and treats anything else as off', () => {
    saveFlag('rulers', true);
    expect(loadFlag('rulers')).toBe(true);
    saveFlag('rulers', false);
    expect(loadFlag('rulers')).toBe(false);
    expect(loadFlag('never-set')).toBe(false);
  });

  it('round-trips a point', () => {
    savePoint('panel', { x: 12, y: 340 });
    expect(loadPoint('panel')).toEqual({ x: 12, y: 340 });
  });

  it('rejects a stored point that is missing or malformed', () => {
    expect(loadPoint('panel')).toBe(null);
    vi.stubGlobal('localStorage', fakeStorage({ 'align-ui:panel': '{"x":1}' }));
    expect(loadPoint('panel')).toBe(null);
    vi.stubGlobal('localStorage', fakeStorage({ 'align-ui:panel': '"12,340"' }));
    expect(loadPoint('panel')).toBe(null);
  });
});
