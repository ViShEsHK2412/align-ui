import { type Config } from './config';
import { type ToolsState } from './api';
/**
 * Public API, state machine, hotkeys, lifecycle. The only module that touches
 * window globals or import.meta.hot.
 */
export type { Box, Bands, Segment } from './types';
export type { Config } from './config';
export type { Feature, Features, PortalTarget, ToolsState } from './api';
export type { GridConfig, GridLayer } from './grid';
export type { CaptureFrame } from './capture';
declare global {
    interface Window {
        __align?: boolean;
    }
    interface WindowEventMap {
        'align:tools': CustomEvent<ToolsState>;
    }
}
export declare function initAlign(partial?: Partial<Config>): void;
