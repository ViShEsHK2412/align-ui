import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Config } from './config';

/**
 * Vite plugin. The whole integration is one line in vite.config:
 *
 *   import align from 'align-ui/vite';
 *   export default defineConfig({ plugins: [align()] });
 *
 * Nothing goes into application code, and there is no dev guard to remember —
 * `apply: 'serve'` means the plugin does not exist during a production build,
 * so the tool cannot reach a bundle even by accident.
 */

/** The shape we need from Vite, declared here so the package has no deps. */
interface VitePluginLike {
  name: string;
  apply: 'serve';
  transformIndexHtml(): {
    tag: string;
    attrs: Record<string, string>;
    children: string;
    injectTo: 'body';
  }[];
}

/**
 * Vite does not rewrite bare specifiers inside a script it was handed, so the
 * injected module has to name a URL the browser can fetch on its own. The
 * bundle is this file's sibling, and /@fs/ serves any absolute path.
 *
 * Stamped with the bundle's mtime, because Vite's watcher ignores node_modules.
 * Without it the URL never changes when the package is updated, so a running
 * dev server keeps serving the copy it transformed on first request — you
 * update the tool, reload, and still get the old one. This runs per request for
 * the HTML, so a fresh install shows up on the next reload with no restart.
 */
function bundleUrl(): string {
  const here = fileURLToPath(new URL('.', import.meta.url));
  const file = here + 'align.js';
  const path = '/@fs/' + file.replace(/\\/g, '/').replace(/^\/+/, '/');
  try {
    return `${path}?v=${statSync(file).mtimeMs}`;
  } catch {
    return path;      // missing bundle: let the import fail with a real error
  }
}

export default function align(options: Partial<Config> = {}): VitePluginLike {
  return {
    name: 'align-ui',
    apply: 'serve',

    transformIndexHtml() {
      return [{
        tag: 'script',
        attrs: { type: 'module' },
        children: `import { initAlign } from '${bundleUrl()}';\n`
                + `initAlign(${JSON.stringify(options)});\n`,
        injectTo: 'body',
      }];
    },
  };
}
