import { rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

// A clean dist, so modules deleted from source can't linger as stale .d.ts.
rmSync('dist', { recursive: true, force: true });

const common = { bundle: true, format: 'esm', minify: true, logLevel: 'error' };

// The tool itself.
await build({ ...common, entryPoints: ['align/index.ts'], outfile: 'dist/align.js' });

// The Vite plugin runs in Node, and emits a URL pointing at the bundle above
// rather than containing a second copy of it.
await build({
  ...common,
  entryPoints: ['align/vite.ts'],
  outfile: 'dist/vite.js',
  platform: 'node',
});

// The side-effect entry is two lines against the bundle above, rather than a
// second copy of it.
writeFileSync('dist/auto.js', "import{initAlign as i}from'./align.js';i();\n");
