/**
 * Notes: point at a piece of the page, say what is wrong with it, and hand the
 * whole batch to whoever fixes it in one paste.
 *
 * The loop this replaces is manual: take a screenshot in the operating system,
 * paste it into the agent, describe the fix, go back, repeat — one round trip
 * per problem. Agentation collapses the round trips into a single paste of
 * selectors and positions, but it copies no pictures, and a picture is most of
 * what "this looks wrong" means.
 *
 * The clipboard cannot carry several images and a block of text in one paste,
 * so the images go to disk and the paste carries their paths. A coding agent
 * opens an image path it is given, which makes a path as good as the picture
 * and a batch of them one paste instead of many.
 *
 * Everything here is pure: no DOM, no network, no storage. The capture, the
 * upload and the drawing live in their own modules, so the parts with an
 * exact right answer can be tested without a browser.
 */
import type { Quad } from './types';
/** A rectangle in page pixels: it stays on the same content as you scroll. */
export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface Note {
    id: string;
    /** Shown on the pin and in the paste. Stable once given. */
    n: number;
    comment: string;
    /** Where on the site. Notes span pages, so each carries its own. */
    page: {
        path: string;
        viewport: {
            w: number;
            h: number;
        };
    };
    /** The area pointed at, in page pixels. */
    rect: Rect;
    /**
     * A dragged area rather than a clicked element. `target` is then the
     * smallest element that contains the area: context for finding it in the
     * source, not the thing the note is about.
     */
    region?: boolean;
    /** The element, when one was clicked rather than a region dragged. */
    target?: {
        selector: string;
        label: string;
        size: {
            w: number;
            h: number;
        };
        padding: Quad;
        border: Quad;
        margin: Quad;
        /**
         * The element's visible text, trimmed. A class selector is usually shared
         * — four tabs are all `a.tab` — and the text is what tells an agent which
         * one, and what it greps the source for.
         */
        text?: string;
        /** Ancestors down to the element, with a position where siblings match. */
        path?: string;
    };
    /**
     * For a dragged area: the outermost elements it contains, grouped when they
     * share a selector. The container alone says where; this says what.
     */
    inside?: {
        selector: string;
        count: number;
        text?: string;
    }[];
    /** What edit mode had changed on that element when the note was taken. */
    changes?: {
        prop: string;
        from: string;
        to: string;
    }[];
    /**
     * The screenshot, if there is one.
     *
     * `path` is absolute and exists only when a dev server wrote the file, which
     * is the case the paste is designed around. `file` alone means it went to
     * the browser's downloads folder, whose location a page is never told.
     */
    image?: {
        file: string;
        path?: string;
    };
}
/** A drag in either direction, as a rectangle with positive size. */
export declare function rectFrom(ax: number, ay: number, bx: number, by: number): Rect;
/**
 * Where a viewport rectangle falls in a captured frame, in frame pixels.
 *
 * A tab capture is the viewport at device resolution — or smaller, when the
 * browser scales a large tab down to keep the stream cheap. Neither ratio can
 * be assumed, so both axes are measured from the frame itself. Rounded outward
 * so an edge that lands on a half pixel is kept rather than shaved, and
 * clamped so a region dragged past the window edge crops to what exists.
 */
export declare function frameCrop(region: Rect, viewport: {
    w: number;
    h: number;
}, frame: {
    w: number;
    h: number;
}): Rect | null;
/**
 * Did the stream capture this tab, or something else?
 *
 * The share dialog offers the current tab first but lets you pick a window or a
 * whole screen, and a crop computed for the viewport lands somewhere arbitrary
 * on either. A tab capture has the viewport's shape; anything that is not
 * within a couple of percent of it is not this tab, and every crop from it
 * would be a picture of the wrong place.
 */
export declare function looksLikeThisTab(frame: {
    w: number;
    h: number;
}, viewport: {
    w: number;
    h: number;
}, tolerance?: number): boolean;
/**
 * The size an image is written at.
 *
 * A region the size of the whole screen at 2x is five megabytes of PNG, and an
 * agent reading it scales it down anyway. The longest side is capped; anything
 * smaller is kept at full resolution, because a 1px misalignment is precisely
 * what these are taken to show.
 */
export declare function outputSize(w: number, h: number, max?: number): {
    w: number;
    h: number;
};
/** A Quad in the order CSS writes it, collapsed the way a person would. */
export declare function shorthand([t, rt, b, l]: Quad): string;
/**
 * The batch, as one paste.
 *
 * Grouped by page, in the order the notes were taken, because that is the
 * order the problems were noticed in and usually the order they matter.
 * Numbers are the pins' numbers, so "fix 3" in a reply means the pin you can
 * see.
 */
export declare function notesToMarkdown(notes: readonly Note[]): string;
/**
 * Anything read back from storage, checked field by field.
 *
 * Notes have to survive a reload for the loop to work at all: the agent edits
 * your source, the dev server reloads the page, and a batch that vanished at
 * that moment would be lost exactly when you came back to write the next one.
 * So they are stored, and anything stored can come back hand-edited or from an
 * older version. A bad note is dropped rather than allowed to throw at startup.
 */
export declare function reviveNotes(raw: unknown): Note[];
/**
 * The next pin number: one past the highest still standing.
 *
 * Deleting note 2 of 3 leaves a gap rather than renumbering, so the pins you
 * can see keep the numbers you may already have said out loud. A number is
 * only reused once nothing on the page carries it.
 */
export declare function nextNumber(notes: readonly Note[]): number;
