import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['align/**/*.test.ts'], environment: 'node' },
});
