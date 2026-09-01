import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Three pages: the simple fixtures, the hard cases, and the token set.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        complex: resolve(import.meta.dirname, 'complex.html'),
        tokens: resolve(import.meta.dirname, 'tokens.html'),
      },
    },
  },
});
