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
    /**
     * Where the area sits inside its element, as fractions of the element's box.
     *
     * Page coordinates follow scrolling and nothing else. Inside a canvas app the
     * element moves when the canvas zooms or pans, and a pin held to the page
     * stayed where the element used to be. Fractions of the element's own box
     * scale with it, so the pin can be placed from wherever the element is now.
     */
    anchor?: {
        fx: number;
        fy: number;
        fw: number;
        fh: number;
    };
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
 * A comment, quoted line by line.
 *
 * The comment is the one part of the paste a person typed, and typed text can
 * be Markdown. Pasted raw, a comment starting "### 99." forged a heading, so an
 * agent reading the batch found a note 99 that does not exist, and an unclosed
 * code fence swallowed every note after it. Quoted, a heading is text inside a
 * quote and a fence ends where the quote does, so nothing typed can reach the
 * structure around it. Blank lines stay inside the quote rather than ending it.
 */
export declare function quote(comment: string): string;
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
/** Overlap over union: 1 for the same rectangle, 0 for disjoint ones. */
export declare function iou(a: Rect, b: Rect): number;
/**
 * Did this drag really mean one element?
 *
 * People drag around a thing as often as they click it, and a drag used to
 * produce a vaguer note than a click on the same element: "region inside
 * main.stage" rather than the tab, its text, its path and its box model — the
 * numbers a note like "increase the padding" actually needs. The gesture should
 * not decide how precise the note is.
 *
 * Two cases count as one element. The drag holds exactly one outermost
 * element, however loosely it was drawn round it. Or it holds none but sits
 * almost exactly on the element it is inside — a drag drawn just within a
 * card's edges. Anything else is genuinely an area, and stays one.
 *
 * Returns the index of the outermost element meant, 'container', or null.
 */
export declare function subjectOf(region: Rect, outermost: readonly Rect[], container: Rect | null, fit?: number): number | 'container' | null;
/**
 * A drag held to the window.
 *
 * Pointer capture keeps a drag alive past the edge of the window, which is
 * right for the gesture and wrong for the note: nothing out there can be
 * pointed at, screenshotted or named. Unclamped, a drag half off the right edge
 * stored an area the picture did not show and looked for its container at a
 * centre point outside the page, where there is no element to find.
 */
export declare function clampToViewport(r: Rect, viewport: {
    w: number;
    h: number;
}): Rect;
/**
 * Where each pin goes, so every note stays reachable.
 *
 * A pin marks the corner of what a note is about, and two notes about the same
 * element share a corner. Drawn there, the later pin covered the earlier one
 * completely — three notes on one tab showed one pin, and the two beneath it
 * could not be opened, edited or deleted. Colliding pins fan out to the right
 * instead, in note order, so the first note keeps the true corner.
 *
 * Page coordinates in and out, so the fan does not reshuffle as you scroll.
 */
export declare function layoutPins(anchors: readonly {
    x: number;
    y: number;
}[], size: number, gap?: number): {
    x: number;
    y: number;
}[];
/**
 * A pin's centre held inside the window.
 *
 * Centred on the corner it marks, a pin for anything flush with the window
 * edge hung half outside it: note 20 read as "0". It is pulled in just far
 * enough to be whole.
 */
export declare function clampPin(x: number, y: number, size: number, viewport: {
    w: number;
    h: number;
}): {
    x: number;
    y: number;
};
/** An area as fractions of the element it is inside. Null for an element with no size. */
export declare function anchorIn(area: Rect, element: Rect): Note['anchor'] | null;
/** The same area, from wherever the element is now and however big it is drawn. */
export declare function areaFrom(anchor: NonNullable<Note['anchor']>, element: Rect): Rect;
/**
 * How far the notes bar has to rise to clear the page's own bottom chrome.
 *
 * Bottom centre is where the bar starts, and it is also where canvas apps put
 * their own toolbar: in the interaction lab the two sat exactly on top of each
 * other. A blocker is anything painted under the bar that looks docked to the
 * bottom rather than like content: its bottom edge near the window's, and short
 * and narrow enough to be a toolbar rather than a page. Returns the distance
 * from the window's bottom edge the bar should sit at, or null to stay put.
 */
export declare function barLift(bar: Rect, blockers: readonly Rect[], viewport: {
    w: number;
    h: number;
}, gap?: number): number | null;
