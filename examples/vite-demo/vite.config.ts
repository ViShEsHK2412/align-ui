import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Four pages: the simple fixtures, the hard cases, the token set, and the
// slider bench.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        complex: resolve(import.meta.dirname, 'complex.html'),
        tokens: resolve(import.meta.dirname, 'tokens.html'),
        slider: resolve(import.meta.dirname, 'slider.html'),
      },
    },
  },
});
