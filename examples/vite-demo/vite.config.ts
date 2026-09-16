import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { notesMiddleware } from '../../align/notes-server';

// Five pages: the simple fixtures, the hard cases, the token set, the slider
// bench, and edit mode's contract.
export default defineConfig({
  /*
   * The demo loads the tool straight from source rather than through the
   * plugin, so the notes endpoint the plugin would serve is mounted by hand.
   */
  plugins: [{
    name: 'align-notes',
    configureServer(server) {
      const handle = notesMiddleware(server.config.root);
      server.middlewares.use((req, res, next) => { void handle(req as never, res as never, next); });
    },
  }],
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
