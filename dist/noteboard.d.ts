import type { Config } from './config';
/**
 * Notes mode: point, say, keep going, then copy the lot.
 *
 * The loop is the product. Press N once, and from then on every click on an
 * element or drag over an area takes a screenshot of exactly that, asks what is
 * wrong with it, and puts a numbered pin on the page. Nothing leaves the mode
 * between notes, because the mode existing is what makes the tenth note as
 * quick as the first. Copy prompt turns the batch into one paste.
 *
 * The screenshot is taken before the composer opens, so the question box is
 * never in the picture, and with the whole overlay hidden, so neither are the
 * tool's own lines.
 */
export interface NoteBoard {
    mode(): boolean;
    setMode(on: boolean): void;
    count(): number;
    /** Close the topmost thing. True if there was one. */
    escape(): boolean;
    destroy(): void;
}
export interface NoteBoardOptions {
    root: ShadowRoot;
    cfg: Config;
    /** What edit mode has changed on an element, so a note can say so. */
    changesFor(el: Element): {
        prop: string;
        from: string;
        to: string;
    }[];
    /** The mode changed, so the toolbar can follow. */
    onChange(): void;
}
export declare const NOTES_CSS: string;
export declare function createNoteBoard(options: NoteBoardOptions): NoteBoard;
