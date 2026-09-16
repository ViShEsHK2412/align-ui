import { type Rect } from './notes';
/**
 * Screenshots of this tab, taken by the browser's own screen capture.
 *
 * A page cannot photograph itself. The two ways round that are to redraw the
 * DOM onto a canvas — what html2canvas, modern-screenshot and snapdom do — or
 * to ask the browser to share the tab. Redrawing needs no permission but gets
 * wrong exactly what a design note is usually about: backdrop-filter, blend
 * modes, cross-origin images, video, canvas, the odd font. Sharing gets every
 * pixel right, because it is the pixels, at the cost of one "Share this tab"
 * click and a sharing bar while it runs.
 *
 * So the stream is opened once and kept, not opened per note: one prompt a
 * session rather than one a screenshot. It closes when the tool does, or when
 * the browser's own Stop sharing is pressed.
 *
 * Chromium offers the current tab first (`preferCurrentTab`). Every browser
 * lets you pick something else instead, and a crop computed for the viewport
 * lands in the wrong place on a window or a screen, so the frame's shape is
 * checked before anything is cropped from it.
 */
export type StartResult = 'ok' | 'denied' | 'unsupported' | 'failed';
export type GrabResult = {
    ok: true;
    blob: Blob;
    width: number;
    height: number;
} | {
    ok: false;
    reason: 'inactive' | 'wrong-surface' | 'empty' | 'failed';
};
export interface TabCapture {
    active(): boolean;
    start(): Promise<StartResult>;
    /**
     * Crop a viewport region out of the next frame.
     *
     * `hide` runs first and returns its own undo: the tool's overlay is on the
     * page and would otherwise be in every screenshot it takes.
     */
    grab(region: Rect, hide: () => () => void): Promise<GrabResult>;
    stop(): void;
    /** Called when sharing ends for any reason other than `stop()`. */
    onEnded(cb: () => void): void;
}
export declare function createTabCapture(): TabCapture;
