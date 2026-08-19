import { type Config } from './config';
/**
 * Public API, state machine, hotkeys, lifecycle. The only module that touches
 * window globals or import.meta.hot.
 */
export type { Box, Bands, Segment } from './types';
export type { Config } from './config';
declare global {
    interface Window {
        __align?: boolean;
    }
}
export declare function initAlign(partial?: Partial<Config>): void;
