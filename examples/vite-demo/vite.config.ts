import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Five pages: the simple fixtures, the hard cases, the token set, the slider
// bench, and edit mode's contract.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        complex: resolve(import.meta.dirname, 'complex.html'),
        tokens: resolve(import.meta.dirname, 'tokens.html'),
        slider: resolve(import.meta.dirname, 'slider.html'),
        edit: resolve(import.meta.dirname, 'edit.html'),
      },
    },
  },
});
