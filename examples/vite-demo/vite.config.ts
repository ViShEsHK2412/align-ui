import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Two pages: the simple fixtures, and the hard cases.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        complex: resolve(import.meta.dirname, 'complex.html'),
      },
    },
  },
});
