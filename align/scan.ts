import { SPACING_PROPS, type Box } from './types';
import { skipSelector, type Config } from './config';

/**
 * The only module that walks the DOM (§4).
 *
 * Reads are batched: every getBoundingClientRect() first, every
 * getComputedStyle()/checkVisibility() second. Interleaving them causes repeated
 * style recalculation and blows the 100ms budget by an order of magnitude (§11).
 */

let cache = new WeakMap<Element, Box>();

/** Drop every cached measurement. Called on mutation / resize / scroll (§8.2). */
export function invalidate(): void {
  cache = new WeakMap();
}

function walk(root: Document | ShadowRoot, skip: string, out: Element[]): Element[] {
  for (const el of root.querySelectorAll('*')) {
    if (el.matches(skip)) continue;
    out.push(el);
    if (el.shadowRoot) walk(el.shadowRoot, skip, out);
  }
  return out;
}

function label(el: Element): string {
  let s = el.tagName.toLowerCase();
  if (el.id) s += `#${el.id}`;
  const cls = el.classList[0];
  if (cls) s += `.${cls}`;
  return s.length > 40 ? s.slice(0, 39) + '…' : s;
}

function visible(el: Element): boolean {
  const check = (el as Element & {
    checkVisibility?: (o?: Record<string, boolean>) => boolean;
  }).checkVisibility;
  if (typeof check !== 'function') return true;
  return check.call(el, {
    contentVisibilityAuto: true,
    opacityProperty: true,
    visibilityProperty: true,
  });
}

/** Nearest ancestor that survived filtering, crossing shadow boundaries. */
function ownerKey(el: Element, index: Map<Element, number>): number {
  let node: Element | null = el.parentElement;
  if (!node) {
    const root = el.getRootNode();
    node = root instanceof ShadowRoot ? root.host : null;
  }
  while (node) {
    const i = index.get(node);
    if (i !== undefined) return i;
    let next: Element | null = node.parentElement;
    if (!next) {
      const root = node.getRootNode();
      next = root instanceof ShadowRoot ? root.host : null;
    }
    node = next;
  }
  return -1;
}

export function scan(cfg: Config): Box[] {
  const skip = skipSelector(cfg);
  const host = document.getElementById('__align_host');

  // ── Pass 0: tree walk, cheapest exclusions (§5.2 rules 1–2) ────────────────
  const candidates: Element[] = [];
  for (const el of walk(document, skip, [])) {
    if (host && (el === host || host.contains(el))) continue;
    candidates.push(el);
  }

  // ── Pass 1: every rect, nothing else ──────────────────────────────────────
  const rects = candidates.map((el) => el.getBoundingClientRect());

  // Geometry-only exclusions (rules 4–5) — free, and they shrink pass 2.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const kept: Element[] = [];
  const keptRects: DOMRect[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const r = rects[i]!;
    if (r.width < cfg.minSize || r.height < cfg.minSize) continue;
    if (r.right < 0 || r.bottom < 0 || r.left > vw || r.top > vh) continue;
    kept.push(candidates[i]!);
    keptRects.push(r);
  }

  // ── Pass 2: every style read, nothing else (rules 3, 6 + spacing values) ───
  const boxes: Box[] = [];
  const index = new Map<Element, number>();
  for (let i = 0; i < kept.length; i++) {
    const el = kept[i]!;
    const r = keptRects[i]!;
    if (!visible(el)) continue;

    const cached = cache.get(el);
    if (cached) {
      index.set(el, boxes.length);
      boxes.push(cached);
      continue;
    }

    const cs = getComputedStyle(el);
    if (cfg.skipFixed && cs.position === 'fixed') continue;
    // Inline boxes are text-flow output, not authored geometry: their edges land
    // wherever the line breaks. Auditing them buries real layout defects under
    // hundreds of unactionable fractional coordinates on any content-heavy page.
    if (cs.display === 'inline') continue;

    const box: Box = {
      el,
      label: label(el),
      key: -1,
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom,
      centerX: r.left + r.width / 2,
      centerY: r.top + r.height / 2,
      width: r.width,
      height: r.height,
      parentKey: -1,
      spacing: SPACING_PROPS.map((p) => parseFloat(cs[p]) || 0),
    };
    cache.set(el, box);
    index.set(el, boxes.length);
    boxes.push(box);
  }

  // ── Pass 3: structural links, pure bookkeeping ────────────────────────────
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i]!;
    box.key = i;
    box.parentKey = ownerKey(box.el, index);
  }

  return boxes;
}
