import type { LintBox } from './lint';
/**
 * The DOM walk that feeds the spacing lint.
 *
 * Kept apart from lint.ts so everything that decides — what counts as spacing,
 * what the fix is — stays pure and tested, and this file only measures.
 *
 * Visible part of the page only, and capped: the lint re-runs as you scroll
 * and edit, and a page with fifty thousand nodes must not stall a frame
 * finding padding on content nobody can see.
 */
/**
 * Two limits. Reading an element's box is cheap once layout is clean, so the
 * walk may pass many elements on its way to the part of the page on screen —
 * a cap on visits alone would measure nothing after scrolling down a long
 * page. Reading computed styles is not cheap, so what is measured is capped
 * far lower; a screen holds nowhere near that many containers.
 */
export declare const LINT_MAX_VISITS = 50000;
export declare const LINT_MAX_ELEMENTS = 3000;
export declare function collectLintBoxes(skip: string, root?: ParentNode): LintBox[];
