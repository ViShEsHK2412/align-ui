export interface Config {
  tol: number;        // clustering tolerance, px          default 3
  epsilon: number;    // "same value" threshold, px        default 0.5
  minSize: number;    // ignore elements smaller than      default 4
  minCluster: number; // min members to count as a group   default 3
  scale: number[];    // spacing scale, px                 default [4,8,12,16,24,32,48,64]
  ignore: string;     // extra CSS selector to skip        default ''
  skipFixed: boolean; //                                   default false
  hotkey: string;     //                                   default 'mod+shift+a'
}

export const DEFAULTS: Config = {
  tol: 3,
  epsilon: 0.5,
  minSize: 4,
  minCluster: 3,
  scale: [4, 8, 12, 16, 24, 32, 48, 64],
  ignore: '',
  skipFixed: false,
  hotkey: 'mod+shift+a',
};

export function mergeConfig(partial: Partial<Config> = {}): Config {
  return { ...DEFAULTS, ...partial };
}

/** §5.5 — without these, every dev overlay reports as a violation on first run. */
export const SKIP_SELECTOR = [
  'script', 'style', 'link', 'meta', 'head', 'title', 'noscript', 'br',
  'html',                             // the viewport, not a design element
  'nextjs-portal',                    // Next.js dev overlay
  '#__next-build-watcher',
  '[data-nextjs-toast]',
  '[data-nextjs-dialog-overlay]',
  '#webpack-dev-server-client-overlay',
  'vite-error-overlay',
  '[data-align-ignore]',              // user escape hatch
].join(', ');

export function skipSelector(cfg: Config): string {
  return cfg.ignore ? `${SKIP_SELECTOR}, ${cfg.ignore}` : SKIP_SELECTOR;
}
