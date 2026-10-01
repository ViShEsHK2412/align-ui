// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CLOSED, createToolsReporter, featureOn, portalFor, resolvePortal, topModal, type ToolsState } from './api';
import { mergeConfig } from './config';
import { createIndicator } from './indicator';
import { loadFlag, saveFlag, useStorage } from './store';

afterEach(() => {
  document.body.innerHTML = '';
  useStorage('local');
  localStorage.clear();
  sessionStorage.clear();
});

describe('featureOn', () => {
  it('leaves everything on unless named off', () => {
    expect(featureOn({}, 'notes')).toBe(true);
    expect(featureOn(undefined, 'lint')).toBe(true);
    expect(featureOn({ notes: false }, 'notes')).toBe(false);
    expect(featureOn({ notes: false }, 'lint')).toBe(true);
  });

  it('only false turns a tool off; anything truthy or junk leaves it on', () => {
    expect(featureOn({ notes: true }, 'notes')).toBe(true);
    expect(featureOn({ notes: 0 as unknown as boolean }, 'notes')).toBe(true);
  });

  it('takes undo with guides, since undo only ever steps back through guides', () => {
    expect(featureOn({ guides: false }, 'undo')).toBe(false);
    expect(featureOn({}, 'undo')).toBe(true);
  });
});

describe('resolvePortal', () => {
  const root = document.documentElement;

  it('is the page root when nothing is given', () => {
    expect(resolvePortal(null, root)).toBe(root);
    expect(resolvePortal(undefined, root)).toBe(root);
  });

  it('takes an element, or a function returning one', () => {
    const dialog = document.createElement('dialog');
    document.body.append(dialog);
    expect(resolvePortal(dialog, root)).toBe(dialog);
    expect(resolvePortal(() => dialog, root)).toBe(dialog);
  });

  it('falls back rather than mounting nowhere', () => {
    const detached = document.createElement('div');
    expect(resolvePortal(detached, root)).toBe(root);
    expect(resolvePortal(() => null, root)).toBe(root);
    expect(resolvePortal(() => { throw new Error('not ready'); }, root)).toBe(root);
    expect(resolvePortal('#app' as unknown as HTMLElement, root)).toBe(root);
  });
});

describe('topModal and portalFor', () => {
  const root = document.documentElement;
  const fakeRoot = (found: HTMLElement[] | 'throw') => ({
    querySelectorAll: () => { if (found === 'throw') throw new SyntaxError(':modal'); return found; },
  }) as unknown as ParentNode;

  it('picks the last open modal, and nothing when there is none', () => {
    const a = document.createElement('dialog');
    const b = document.createElement('dialog');
    expect(topModal(fakeRoot([a, b]))).toBe(b);
    expect(topModal(fakeRoot([]))).toBeNull();
  });

  it('copes with a browser that has no :modal', () => {
    expect(topModal(fakeRoot('throw'))).toBeNull();
  });

  it('prefers a configured target that works, and the page root with no modal open', () => {
    const el = document.createElement('div');
    document.body.append(el);
    expect(portalFor(el, root)).toBe(el);
    expect(portalFor(null, root)).toBe(root);
    expect(portalFor(() => null, root)).toBe(root);
  });
});

describe('createToolsReporter', () => {
  const state = (over: Partial<ToolsState> = {}): ToolsState => ({ ...CLOSED, open: true, ...over });

  it('tells the listener and the window once per change, not once per frame', () => {
    const seen: ToolsState[] = [];
    const events: ToolsState[] = [];
    const onEvent = (e: Event) => events.push((e as CustomEvent<ToolsState>).detail);
    addEventListener('align:tools', onEvent);
    const report = createToolsReporter(() => (s) => seen.push(s));
    report(state());
    report(state());
    report(state({ rulers: true }));
    report(state({ rulers: true }));
    removeEventListener('align:tools', onEvent);
    expect(seen.map((s) => s.rulers)).toEqual([false, true]);
    expect(events).toHaveLength(2);
  });

  it('hands out a copy, so a listener cannot change what the tool compares against', () => {
    const report = createToolsReporter(() => (s) => { s.rulers = true; });
    const s = state();
    report(s);
    expect(s.rulers).toBe(false);
    expect(report(state())).toBe(false);
  });

  it('survives a listener that throws, and still fires the event', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    let fired = 0;
    const onEvent = () => { fired++; };
    addEventListener('align:tools', onEvent);
    const report = createToolsReporter(() => () => { throw new Error('host bug'); });
    expect(() => report(state())).not.toThrow();
    removeEventListener('align:tools', onEvent);
    expect(fired).toBe(1);
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it('reads the listener each time, so one set after start is used', () => {
    let fn: ((s: ToolsState) => void) | null = null;
    const seen: boolean[] = [];
    const report = createToolsReporter(() => fn);
    report(state());
    fn = (s) => seen.push(s.lint);
    report(state({ lint: true }));
    expect(seen).toEqual([true]);
  });
});

describe('mergeConfig', () => {
  it('defaults the new options to the old behaviour', () => {
    const cfg = mergeConfig();
    expect(cfg.features).toEqual({});
    expect(cfg.portalTarget).toBeNull();
    expect(cfg.storage).toBe('local');
    expect(cfg.onToolsChange).toBeNull();
  });

  it('copies features, so the caller\'s object is never written to', () => {
    const features = { notes: false };
    const cfg = mergeConfig({ features });
    expect(cfg.features).toEqual({ notes: false });
    expect(cfg.features).not.toBe(features);
  });

  it('reads any storage it does not know as local', () => {
    expect(mergeConfig({ storage: 'session' }).storage).toBe('session');
    expect(mergeConfig({ storage: 'cookie' as never }).storage).toBe('local');
  });
});

describe('per-tab storage', () => {
  it('keeps preferences in sessionStorage when asked, and leaves localStorage alone', () => {
    useStorage('session');
    saveFlag('rulers', true);
    expect(sessionStorage.getItem('align-ui:rulers')).toBe('1');
    expect(localStorage.getItem('align-ui:rulers')).toBeNull();
    expect(loadFlag('rulers')).toBe(true);
    useStorage('local');
    expect(loadFlag('rulers')).toBe(false);
  });
});

describe('createIndicator with tools switched off', () => {
  it('leaves out their buttons and their rows in the key list', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const root = host.attachShadow({ mode: 'open' });
    const ind = createIndicator(root, () => {}, (name) => name !== 'notes' && name !== 'guides');
    const tools = [...root.querySelectorAll<HTMLElement>('[data-tool]')].map((b) => b.dataset['tool']);
    expect(tools).not.toContain('notes');
    expect(tools).toContain('lint');
    const help = root.textContent ?? '';
    expect(help).not.toMatch(/Notes —/);
    expect(help).not.toMatch(/drop a vertical or horizontal guide/);
    expect(help).toMatch(/Spacing —/);
    ind.destroy();
  });

  it('never leaves two separators side by side when a whole group is off', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const root = host.attachShadow({ mode: 'open' });
    const off = new Set(['freeze', 'edit', 'notes']);
    createIndicator(root, () => {}, (name) => !off.has(name));
    const kinds = [...root.querySelector('.tools')!.children].map((c) => c.className);
    for (let i = 1; i < kinds.length; i++) expect(kinds[i] === 'sep' && kinds[i - 1] === 'sep').toBe(false);
    expect(kinds[0]).not.toBe('sep');
  });
});
