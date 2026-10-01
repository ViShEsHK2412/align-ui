/**
 * The parts of the tool a host app can shape: which tools exist, where the
 * overlay mounts, and what it reports back.
 *
 * Kept small and pure where it can be, so each rule — what an unknown feature
 * name means, what happens when a portal function throws, when a change is a
 * change — is tested without starting the tool.
 */

import type { ToolName } from './indicator';

/** A tool that can be switched off: every toolbar control, plus guides. */
export type Feature = Exclude<ToolName, 'undo'> | 'guides';

export type Features = Partial<Record<Feature, boolean>>;

/** Everything is on unless switched off by name. */
export function featureOn(features: Features | null | undefined, name: Feature | ToolName): boolean {
  if (name === 'undo') return featureOn(features, 'guides');
  return features?.[name] !== false;
}

export type PortalTarget = HTMLElement | (() => HTMLElement | null | undefined) | null;

/**
 * Where the overlay mounts. The page's root unless told otherwise.
 *
 * A host app points this inside a modal `<dialog>`: a modal makes everything
 * outside it inert, the tool included, and the only way back in is to be
 * inside it. Anything unusable — a function that throws, an element no longer
 * in the document — falls back to the root rather than leaving the tool with
 * nowhere to draw.
 */
export function resolvePortal(target: PortalTarget | undefined, fallback: HTMLElement): HTMLElement {
  let el: unknown = target;
  if (typeof target === 'function') {
    try {
      el = target();
    } catch {
      el = null;
    }
  }
  return el instanceof HTMLElement && el.isConnected ? el : fallback;
}

/**
 * The open modal dialog on top, if any. A modal makes everything outside it
 * inert, so this is where the tool has to be to stay usable — with no config
 * at all. Dialogs open in the top layer in the order they were opened, which
 * for nested modals is document order often enough, and the last match is
 * the best guess either way.
 */
export function topModal(root: ParentNode = document): HTMLElement | null {
  try {
    const open = root.querySelectorAll<HTMLElement>('dialog:modal');
    return open[open.length - 1] ?? null;
  } catch {
    return null;   // a browser without :modal
  }
}

/**
 * Where the overlay belongs right now: the configured target if it is usable,
 * otherwise the top modal, otherwise the page root. Asked every frame, so a
 * dialog opened or closed while the tool is on takes the tool with it.
 */
export function portalFor(target: PortalTarget | undefined, root: HTMLElement): HTMLElement {
  return resolvePortal(target, topModal() ?? root);
}

/** What the tool is doing, as a host app sees it. */
export interface ToolsState {
  open: boolean;
  /** Elements locked. */
  locked: number;
  /** Guides on the page. */
  guides: number;
  /** Notes taken, open and resolved. */
  notes: number;
  rulers: boolean;
  xray: boolean;
  grid: boolean;
  pixels: boolean;
  lint: boolean;
  type: boolean;
  panel: boolean;
  hide: boolean;
  freeze: boolean;
  edit: boolean;
  /** Notes mode, as opposed to the count of notes. */
  noting: boolean;
}

export const CLOSED: ToolsState = {
  open: false, locked: 0, guides: 0, notes: 0,
  rulers: false, xray: false, grid: false, pixels: false, lint: false,
  type: false, panel: false, hide: false, freeze: false, edit: false, noting: false,
};

/**
 * Tell the host, once per change. The tool redraws every frame while you
 * scroll; a listener told sixty times a second that nothing happened would be
 * worse than none, so a state is only reported when it differs from the last.
 * A listener that throws is reported in the console and never breaks the tool.
 */
export function createToolsReporter(listener: () => ((s: ToolsState) => void) | null | undefined) {
  let last = '';
  return (state: ToolsState): boolean => {
    const sig = JSON.stringify(state);
    if (sig === last) return false;
    last = sig;
    const fn = listener();
    if (fn) {
      try {
        fn({ ...state });
      } catch (err) {
        console.error('[align] onToolsChange threw:', err);
      }
    }
    try {
      dispatchEvent(new CustomEvent<ToolsState>('align:tools', { detail: { ...state } }));
    } catch {
      /* no window to tell */
    }
    return true;
  };
}
