import type { Guide } from './types';
export declare function loadGuides(): Guide[];
export declare function saveGuides(guides: Guide[]): void;
export declare function loadFlag(name: string): boolean;
export declare function saveFlag(name: string, on: boolean): void;
/** The panel's dragged position, or null if it has never been moved. */
export declare function loadPoint(name: string): {
    x: number;
    y: number;
} | null;
export declare function savePoint(name: string, p: {
    x: number;
    y: number;
}): void;
/**
 * Notes, for the whole origin rather than per route.
 *
 * A batch of feedback usually spans pages — the header on the home page, the
 * table on /billing — and each note records its own path. Keeping them per
 * route would split one batch into several and make you copy each. They carry
 * no images, only paths to them, so they stay small enough for storage.
 */
export declare function loadNotes(): unknown;
export declare function saveNotes(notes: unknown): void;
