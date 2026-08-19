export interface Config {
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
}

export const DEFAULTS: Config = {
  ignore: '',
  hotkey: 'mod+shift+a',
  panelKey: 'b',
  rulerKey: 'r',
  guideKeys: { vertical: 'v', horizontal: 'h' },
};

export function mergeConfig(partial: Partial<Config> = {}): Config {
  return { ...DEFAULTS, ...partial };
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
