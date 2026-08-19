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
 */
function bundleUrl(): string {
  const here = fileURLToPath(new URL('.', import.meta.url));
  return '/@fs/' + (here + 'align.js').replace(/\\/g, '/').replace(/^\/+/, '/');
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
