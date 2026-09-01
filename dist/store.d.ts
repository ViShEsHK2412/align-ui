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
