import type { LintBox } from './lint';
import type { Quad } from './types';

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
export const LINT_MAX_VISITS = 50000;
export const LINT_MAX_ELEMENTS = 3000;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE', 'BR', 'WBR', 'HEAD',
  'IFRAME', 'OPTION']);

const px = (v: string) => parseFloat(v) || 0;

function inViewport(r: DOMRect): boolean {
  return r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
}

function skipped(el: Element, skip: string): boolean {
  if (SKIP_TAGS.has(el.tagName)) return true;
  // Inside an SVG, boxes are drawing geometry, not layout.
  if (el.namespaceURI === 'http://www.w3.org/2000/svg' && el.tagName.toLowerCase() !== 'svg') return true;
  try {
    return el.closest(skip) !== null;
  } catch {
    return false;
  }
}

/** Children that take part in the container's layout. */
function inFlow(el: Element, skip: string): DOMRect[] {
  const out: DOMRect[] = [];
  for (const child of Array.from(el.children)) {
    if (skipped(child, skip)) continue;
    const cs = getComputedStyle(child);
    if (cs.position === 'absolute' || cs.position === 'fixed') continue;
    if (cs.display === 'none' || cs.display === 'contents' || cs.display === 'inline') continue;
    if (cs.visibility === 'hidden') continue;
    const r = child.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    out.push(r);
  }
  return out;
}

export function collectLintBoxes(skip: string, root: ParentNode = document.body): LintBox[] {
  const boxes: LintBox[] = [];
  const all = root.querySelectorAll('*');
  const end = Math.min(all.length, LINT_MAX_VISITS);
  for (let i = 0; i < end && boxes.length < LINT_MAX_ELEMENTS; i++) {
    const el = all[i]!;
    if (skipped(el, skip)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1 || !inViewport(rect)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'inline' || cs.display === 'none' || cs.visibility === 'hidden') continue;

    const padding: Quad = [px(cs.paddingTop), px(cs.paddingRight), px(cs.paddingBottom), px(cs.paddingLeft)];
    const border: Quad = [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)];
    /*
     * Table layout places rows and cells with border-spacing, 2px by default
     * in every browser. Nobody set that gap, so a table's rows and a row's
     * cells are not measured. A cell's own padding still is, and its content
     * is ordinary layout again.
     */
    const tabular = cs.display.startsWith('table') && cs.display !== 'table-cell' && cs.display !== 'table-caption';
    const children = tabular ? [] : inFlow(el, skip);
    // A leaf only takes part when it is padded: a padded button is spacing
    // someone chose; a bare span is not.
    if (children.length === 0 && padding.every((p) => p === 0)) continue;

    boxes.push({
      rect: { x: rect.left, y: rect.top, w: rect.width, h: rect.height },
      padding,
      border,
      justify: cs.justifyContent,
      align: cs.alignContent,
      children: children.map((r) => ({ x: r.left, y: r.top, w: r.width, h: r.height })),
    });
  }
  return boxes;
}
