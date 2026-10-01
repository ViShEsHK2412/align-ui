/**
 * Layout grids: columns, rows and a baseline, on the page or inside elements.
 *
 * A design rarely has one grid. The page has twelve columns, the card inside
 * it has its own four, and the type sits on a 4px baseline under both. Each is
 * a reference to measure against, so each can be drawn, and a grid that
 * belongs to a component is drawn inside every instance of it rather than
 * across the window.
 *
 * The geometry is pure. Where the areas come from — the page, or the content
 * box of each element a selector matches — is the caller's business.
 */

import type { Rect } from './notes';

interface Scoped {
  /**
   * Draw inside each element this matches, in its content box, instead of
   * across the page. Capped at MAX_SCOPED elements on screen.
   */
  selector?: string;
  /** Any CSS colour. The tool's own measure colour when left out. */
  color?: string;
}

export interface ColumnsLayer extends Scoped {
  type: 'columns';
  count: number;
  gutter?: number;
  margin?: number;
  /** The width the columns are centred in; 0 or left out fills the area. */
  maxWidth?: number;
}

export interface RowsLayer extends Scoped {
  type: 'rows';
  /**
   * With no height, this many rows stretch to fill the area. With a height,
   * at most this many rows of that height, from the top.
   */
  count?: number;
  /** Fixed row height. Rows repeat down the area when there is no count. */
  height?: number;
  gutter?: number;
  margin?: number;
}

export interface BaselineLayer extends Scoped {
  type: 'baseline';
  /** Distance between lines. */
  size: number;
  /** Where the first line falls, from the top of the area. */
  offset?: number;
}

export type GridLayer = ColumnsLayer | RowsLayer | BaselineLayer;

/** The shape `grid` took before there were layers. Still accepted, unchanged. */
export interface LegacyGrid { columns: number; gutter: number; margin: number; maxWidth: number }

export type GridConfig = LegacyGrid | GridLayer | readonly GridLayer[];

/** Elements a scoped grid is drawn in, at most. A grid on every list item of a long page is noise. */
export const MAX_SCOPED = 50;

const num = (v: unknown, min: number, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= min ? v : fallback;

/**
 * Whatever was configured, as a list of layers that can be drawn.
 *
 * Forgiving in the way a config file should be: a layer it cannot make sense
 * of is dropped rather than throwing at startup, and a layer with nothing to
 * draw — no columns, a zero baseline — is the same as no layer.
 */
export function normalizeGrids(input: unknown): GridLayer[] {
  if (input === null || input === undefined) return [];
  const list: unknown[] = Array.isArray(input) ? input : [input];
  const out: GridLayer[] = [];
  for (const raw of list) {
    if (typeof raw !== 'object' || raw === null) continue;
    const o = raw as Record<string, unknown>;
    const scope: Scoped = {};
    if (typeof o['selector'] === 'string' && o['selector'].trim()) scope.selector = o['selector'].trim();
    if (typeof o['color'] === 'string' && o['color'].trim()) scope.color = o['color'].trim();

    // The old single-grid shape: { columns, gutter, margin, maxWidth }.
    const type = o['type'] ?? (typeof o['columns'] === 'number' ? 'columns' : undefined);
    if (type === 'columns') {
      const count = Math.floor(num(o['count'] ?? o['columns'], 1, 0));
      if (count < 1) continue;
      out.push({
        type, count: Math.min(count, 100),
        gutter: num(o['gutter'], 0, 0), margin: num(o['margin'], 0, 0), maxWidth: num(o['maxWidth'], 0, 0),
        ...scope,
      });
    } else if (type === 'rows') {
      const count = Math.floor(num(o['count'], 1, 0));
      const height = num(o['height'], 1, 0);
      if (count < 1 && height <= 0) continue;
      const layer: RowsLayer = { type, gutter: num(o['gutter'], 0, 0), margin: num(o['margin'], 0, 0), ...scope };
      if (count >= 1) layer.count = Math.min(count, 1000);
      if (height > 0) layer.height = height;
      out.push(layer);
    } else if (type === 'baseline') {
      // Below 2px the lines are a solid wash, not a grid.
      const size = num(o['size'], 2, 0);
      if (size <= 0) continue;
      out.push({ type, size, offset: num(o['offset'], 0, 0), ...scope });
    }
  }
  return out;
}

/** What one layer draws in one area: filled bands, and hairlines. */
export interface GridShapes { fills: Rect[]; lines: Rect[] }

/** The vertical span on screen worth drawing in, so a long page costs only what is visible. */
export interface View { top: number; bottom: number }

/** Evenly divide a span into `count` bands with gutters, inside margins. */
function divide(start: number, length: number, count: number, gutter: number, margin: number): [number, number][] {
  const content = length - margin * 2;
  const each = (content - gutter * (count - 1)) / count;
  if (!(each > 0)) return [];
  const out: [number, number][] = [];
  for (let i = 0; i < count; i++) out.push([start + margin + i * (each + gutter), each]);
  return out;
}

/**
 * Lay one layer out inside `area`, keeping only what falls inside `view`.
 *
 * Every number is in viewport pixels. An area can be far taller than the
 * screen — the page, scrolled — so anything repeating starts at the first
 * band that can be seen rather than at the top of the area.
 */
export function gridShapes(layer: GridLayer, area: Rect, view: View): GridShapes {
  const fills: Rect[] = [];
  const lines: Rect[] = [];
  if (area.w <= 0 || area.h <= 0) return { fills, lines };
  const top = Math.max(area.y, view.top);
  const bottom = Math.min(area.y + area.h, view.bottom);
  if (bottom <= top) return { fills, lines };

  if (layer.type === 'columns') {
    const max = layer.maxWidth ?? 0;
    const width = max > 0 ? Math.min(max, area.w) : area.w;
    const left = area.x + Math.max(0, (area.w - width) / 2);
    for (const [x, w] of divide(left, width, layer.count, layer.gutter ?? 0, layer.margin ?? 0)) {
      fills.push({ x, y: top, w, h: bottom - top });
    }
  } else if (layer.type === 'rows') {
    const gutter = layer.gutter ?? 0;
    const margin = layer.margin ?? 0;
    const bands: [number, number][] = [];
    if (layer.height) {
      const step = layer.height + gutter;
      const first = area.y + margin;
      const end = area.y + area.h - margin;
      const limit = layer.count ?? Infinity;
      let k = Math.max(0, Math.floor((top - first) / step));
      for (; k < limit; k++) {
        const y = first + k * step;
        if (y >= bottom || y >= end) break;
        bands.push([y, Math.min(layer.height, end - y)]);
      }
    } else {
      bands.push(...divide(area.y, area.h, layer.count!, gutter, margin));
    }
    for (const [y, h] of bands) {
      const y0 = Math.max(y, top);
      const y1 = Math.min(y + h, bottom);
      if (y1 > y0) fills.push({ x: area.x, y: y0, w: area.w, h: y1 - y0 });
    }
  } else {
    const first = area.y + (layer.offset ?? 0);
    let k = Math.max(0, Math.ceil((top - first) / layer.size));
    for (let y = first + k * layer.size; y < bottom; y = first + ++k * layer.size) {
      if (y >= top) lines.push({ x: area.x, y, w: area.w, h: 1 });
    }
  }
  return { fills, lines };
}

/**
 * The content box of each element a selector matches, on screen, in viewport
 * pixels. Inside padding and border, because that is the box a component's own
 * grid divides. A selector that does not parse matches nothing.
 */
export function contentBoxes(selector: string, root: ParentNode = document): Rect[] {
  let found: NodeListOf<Element>;
  try {
    found = root.querySelectorAll(selector);
  } catch {
    return [];
  }
  const out: Rect[] = [];
  for (const el of Array.from(found)) {
    if (out.length >= MAX_SCOPED) break;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const cs = getComputedStyle(el);
    const px = (v: string) => parseFloat(v) || 0;
    const l = px(cs.borderLeftWidth) + px(cs.paddingLeft);
    const t = px(cs.borderTopWidth) + px(cs.paddingTop);
    const rr = px(cs.borderRightWidth) + px(cs.paddingRight);
    const b = px(cs.borderBottomWidth) + px(cs.paddingBottom);
    const w = r.width - l - rr;
    const h = r.height - t - b;
    if (w > 0 && h > 0) out.push({ x: r.left + l, y: r.top + t, w, h });
  }
  return out;
}
