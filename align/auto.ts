import { initAlign } from './index';

/**
 * Side-effecting entry point, for setups without a Vite plugin:
 *
 *   if (import.meta.env.DEV) import('align-ui/auto');
 *
 * One line, no handle to keep, and the dynamic import keeps it out of the
 * production bundle the same way it always did.
 */
initAlign();
