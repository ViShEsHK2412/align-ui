import type { CaptureFrame } from './capture';
import type { GridConfig } from './grid';
import type { Features, PortalTarget, ToolsState } from './api';
import { LINT_DEFAULTS, type LintOptions } from './lint';

export interface Config {
  /**
   * The layout grids to check against, if the project has them. There is no
   * sensible default — twelve columns at 24 means nothing without knowing the
   * system — so it stays off until described.
   *
   * One grid in the original shape, { columns, gutter, margin, maxWidth }, or
   * a list of layers: columns, rows and baselines, each across the page or,
   * with a selector, inside every element it matches.
   */
  grid: GridConfig | null;
  /** Extra CSS selector to skip when hit-testing. */
  ignore: string;
  hotkey: string;
  /** Hides or brings back the box model panel, while the tool is open. */
  panelKey: string;
  /** Shows or hides the rulers, while the tool is open. */
  rulerKey: string;
  /**
   * Drops a guide at the cursor. Two keys rather than one key plus shift:
   * anyone told to "press G" types a capital G, and a modifier you hold by
   * reflex cannot carry meaning.
   */
  guideKeys: { vertical: string; horizontal: string };
  /**
   * Which way the tool's own surfaces read.
   *
   * `auto` works out whether the page is dark from an explicit `color-scheme`,
   * then from the background it actually paints, and only falls back to the
   * machine's preference when the page says nothing. That is right almost
   * always, and it can be fooled: a mid-grey ground sits near the threshold,
   * and a transparent body over a full-page image tells it nothing true. This
   * is the way out when it guesses wrong.
   */
  theme: 'auto' | 'light' | 'dark';
  /**
   * Where notes send their screenshots, or null to always download them.
   *
   * The Vite plugin serves this path and writes each image into the project,
   * which is what lets the copied notes carry real file paths. Anywhere it is
   * not served — Next, or a Vite app loading the tool without the plugin — the
   * first save finds that out and falls back to the downloads folder.
   */
  notesEndpoint: string | null;
  /**
   * Supplies the visible tab as an image, so notes never ask to share it.
   *
   * For hosts that can capture on their own: an extension, Electron, a test
   * runner. A function cannot travel through the Vite plugin's options, which
   * are JSON, so the same hook is also read from window.__alignCaptureFrame,
   * at the moment notes mode turns on.
   */
  captureFrame: CaptureFrame | null;
  /**
   * The spacing lint (S). It reads your spacing tokens; these are only used
   * when the page defines none: multiples of base, plus anything in allow.
   * Spacing wider than max is treated as layout and left alone.
   */
  lint: LintOptions;
  /**
   * Tools to leave out. `{ notes: false }` removes the button, the key and the
   * help row; `guides: false` removes guides and the keys that work them.
   * Everything not named stays on.
   */
  features: Features;
  /**
   * Where the overlay mounts: an element, or a function returning one, read
   * each time the tool opens. The page's root when left out, or when the
   * element is not in the document. Point it inside a modal `<dialog>` to
   * keep the tool usable while the modal makes the rest of the page inert.
   */
  portalTarget: PortalTarget;
  /**
   * 'local' shares guides, notes and preferences across tabs, as before.
   * 'session' keeps them per tab, so two tabs on one app stay apart.
   */
  storage: 'local' | 'session';
  /**
   * Called with the tool's state whenever it changes: opened, closed, a tool
   * switched, an element locked. Also dispatched on window as an
   * `align:tools` CustomEvent, for code that cannot pass a callback.
   */
  onToolsChange: ((state: ToolsState) => void) | null;
}

export const DEFAULTS: Config = {
  ignore: '',
  grid: null,
  hotkey: 'mod+shift+a',
  panelKey: 'b',
  rulerKey: 'r',
  guideKeys: { vertical: 'v', horizontal: 'h' },
  theme: 'auto',
  notesEndpoint: '/__align/notes',
  captureFrame: null,
  lint: { ...LINT_DEFAULTS },
  features: {},
  portalTarget: null,
  storage: 'local',
  onToolsChange: null,
};

export function mergeConfig(partial: Partial<Config> = {}): Config {
  return {
    ...DEFAULTS, ...partial,
    lint: { ...DEFAULTS.lint, ...(partial.lint ?? {}) },
    features: { ...(partial.features ?? {}) },
    storage: partial.storage === 'session' ? 'session' : 'local',
  };
}

/** Elements that are never worth measuring, plus the user's escape hatch. */
export const SKIP_SELECTOR = [
  'script', 'style', 'link', 'meta', 'head', 'title', 'noscript',
  'nextjs-portal',
  '[data-nextjs-toast]',
  '[data-nextjs-dialog-overlay]',
  '#webpack-dev-server-client-overlay',
  'vite-error-overlay',
  '[data-align-ignore]',
].join(', ');

export function skipSelector(cfg: Config): string {
  return cfg.ignore ? `${SKIP_SELECTOR}, ${cfg.ignore}` : SKIP_SELECTOR;
}
