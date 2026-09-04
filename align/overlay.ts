import {
  fmt, gridColumns, guideAt, pixelGridStep, spreadLabels, type GridSpec,
} from './measure';
import {
  alpha, ink, pageIsDark, RULER, TYPE, WEIGHT, whenFontReady, type Ink,
} from './theme';
import type { Box, Guide, Segment } from './types';

/**
 * Canvas rendering. One of the two modules allowed to write to the DOM.
 * Everything draws inside a single requestAnimationFrame — never synchronously
 * from an event handler.
 */

export interface OverlayState {
  hover: Box | null;
  /** Every locked element, in the order they were locked. */
  pinned: Box[];
  lines: Segment[];
  cursor: { x: number; y: number } | null;
  rulers: boolean;
  /** The design grid to check against, or null for none. */
  grid: GridSpec | null;
  /** Whether to lay the pixel texture under everything. */
  pixels: boolean;
  guides: Guide[];
  /** The one under the cursor or being dragged, drawn at full strength. */
  liveGuide: Guide | null;
  /** The one the keyboard is pointing at, marked with end handles. */
  activeGuide: number | null;
}

const CAP = 5;          // end-cap length on a distance line
const PAD = 4;          // chip padding
const EDGE = 12;        // keep chips this far from the viewport edge
/** How far back a measurement steps when you are asking about another one. */
const FADED = 0.22;

const MINOR = 10;       // unlabelled tick, px of page
const MID = 50;         // half-height tick
const MAJOR = 100;      // labelled tick

export interface Overlay {
  root: ShadowRoot;
  update(patch: Partial<OverlayState>): void;
  resize(): void;
  destroy(): void;
}

export function mountOverlay(): Overlay {
  const host = document.createElement('div');
  host.id = '__align_host';
  host.setAttribute('data-align-ignore', '');
  // `all: initial` because shadow DOM blocks selector matching but NOT
  // inheritance — without it the host page's font and line-height leak in.
  // documentElement rather than body because React reconciles body children and
  // would fight us during hydration.
  host.style.cssText = 'all: initial; position: fixed; inset: 0; ' +
    'z-index: 2147483647; pointer-events: none;';
  document.documentElement.appendChild(host);

  const root = host.attachShadow({ mode: 'closed' });
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position: fixed; inset: 0; pointer-events: none;';
  root.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const state: OverlayState = {
    hover: null, pinned: [], lines: [], cursor: null, rulers: false,
    grid: null, pixels: false,
    guides: [], liveGuide: null, activeGuide: null,
  };
  let c: Ink = ink(pageIsDark());
  let frame = 0;

  /**
   * The canvas resolves its own colours and the panels resolve `light-dark()`,
   * so both have to be told the same answer or they disagree. `all: initial`
   * pins the host to `color-scheme: normal`, which would resolve every
   * `light-dark()` inside to its light branch regardless — so setting it here
   * is what makes the panels follow the page rather than the machine.
   */
  let isDark: boolean | null = null;
  function applyScheme() {
    const dark = pageIsDark();
    if (dark === isDark) return;       // nothing to repaint
    isDark = dark;
    c = ink(dark);
    host.style.colorScheme = dark ? 'dark' : 'light';
    schedule();
  }
  applyScheme();

  const scheme = matchMedia('(prefers-color-scheme: dark)');
  const onScheme = () => applyScheme();
  scheme.addEventListener('change', onScheme);

  /**
   * A page with its own dark-mode switch changes nothing the media query can
   * see. What it does change, almost without exception, is an attribute on
   * `<html>` or `<body>` — a class, a `data-theme`, an inline `color-scheme`.
   * Watching those two elements costs nothing and covers the case; a theme
   * swapped by exchanging stylesheets alone would still slip past, and that is
   * rare enough to leave.
   */
  const themeWatch = new MutationObserver(() => applyScheme());
  function watchTheme() {
    themeWatch.disconnect();
    themeWatch.observe(document.documentElement, { attributes: true });
    if (document.body) themeWatch.observe(document.body, { attributes: true });
  }
  watchTheme();

  // Canvas measures text with whatever face is resolved at draw time, so redraw
  // once Inter arrives — otherwise chips stay sized for the fallback.
  whenFontReady(() => schedule());

  function fit() {
    const dpr = devicePixelRatio;
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Half-pixel offset puts 1px strokes on the pixel grid rather than
    // straddling it. A blurry measuring tool is absurd.
    ctx.translate(0.5, 0.5);
  }

  /**
   * Put a fill edge back on the pixel grid. `fit` shifts everything half a
   * pixel so 1px strokes land on the grid instead of straddling it; a fill
   * wants the opposite, and without undoing it every chip gets soft edges and
   * its text sits at a half pixel. A blurry measuring tool is absurd.
   */
  const snap = (v: number) => Math.round(v) - 0.5;

  function outline(box: Box, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(Math.round(box.left), Math.round(box.top),
      Math.round(box.width), Math.round(box.height));
  }

  /** Dotted lines running the full viewport from each edge of the box. */
  function guides(box: Box) {
    ctx.strokeStyle = alpha(c.measure, 0.7);
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    for (const x of [box.left, box.right]) {
      ctx.moveTo(Math.round(x), 0);
      ctx.lineTo(Math.round(x), innerHeight);
    }
    for (const y of [box.top, box.bottom]) {
      ctx.moveTo(0, Math.round(y));
      ctx.lineTo(innerWidth, Math.round(y));
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /** A distance line with perpendicular end caps, the way a ruler reads. */
  function distance(seg: Segment) {
    ctx.strokeStyle = seg.extension ? alpha(c.measure, 0.55) : c.measure;
    ctx.lineWidth = 1;
    // Dashed, the way Figma draws an extension line — it is the convention,
    // and it keeps a stub from reading as a measurement of its own.
    ctx.setLineDash(seg.extension ? [3, 3] : []);
    ctx.beginPath();
    ctx.moveTo(Math.round(seg.x1), Math.round(seg.y1));
    ctx.lineTo(Math.round(seg.x2), Math.round(seg.y2));
    if (seg.extension) { ctx.stroke(); return; }
    if (seg.axis === 'x') {
      for (const x of [seg.x1, seg.x2]) {
        ctx.moveTo(Math.round(x), Math.round(seg.y1) - CAP);
        ctx.lineTo(Math.round(x), Math.round(seg.y1) + CAP);
      }
    } else {
      for (const y of [seg.y1, seg.y2]) {
        ctx.moveTo(Math.round(seg.x1) - CAP, Math.round(y));
        ctx.lineTo(Math.round(seg.x1) + CAP, Math.round(y));
      }
    }
    ctx.stroke();
  }

  /** `center` places the chip's midpoint at (x, y) instead of its top-left. */
  /** How big a chip will be, before deciding where to put it. */
  function chipSize(text: string) {
    ctx.font = `${WEIGHT.medium} ${TYPE.body}px ${TYPE.stack}`;
    return { w: ctx.measureText(text).width + PAD * 2, h: TYPE.body + PAD * 2 + 2 };
  }

  /** Draw a chip with its top-left corner given, clamped into the viewport. */
  function chipAt(text: string, left: number, top: number, bg: string) {
    ctx.font = `${WEIGHT.medium} ${TYPE.body}px ${TYPE.stack}`;
    ctx.textBaseline = 'middle';
    const { w, h } = chipSize(text);
    const cx = snap(Math.min(Math.max(left, EDGE), innerWidth - w - EDGE));
    const cy = snap(Math.min(Math.max(top, EDGE), innerHeight - h - EDGE));
    ctx.fillStyle = bg;
    ctx.beginPath();
    // Whole pixels wide too, or the right edge lands mid-pixel and only one
    // side of the chip comes out sharp.
    ctx.roundRect(cx, cy, Math.ceil(w), h, 4);
    ctx.fill();
    ctx.fillStyle = c.surface;
    ctx.fillText(text, cx + PAD, cy + h / 2);
  }

  function chip(text: string, x: number, y: number, bg: string, center = false) {
    const { w, h } = chipSize(text);
    chipAt(text, center ? x - w / 2 : x, center ? y - h / 2 : y, bg);
  }

  /**
   * Figma-style rulers along the top and left edges, in page coordinates —
   * they count from the top-left of the document, not the viewport, so the
   * numbers keep meaning something as you scroll.
   */
  function rulers() {
    const ox = scrollX, oy = scrollY;      // page origin, in viewport space

    // Gutters. The half-pixel offset that keeps strokes crisp would leave a
    // seam on a fill, so these are drawn back a half pixel.
    ctx.fillStyle = c.rulerBg;
    ctx.fillRect(-0.5, -0.5, innerWidth + 1, RULER);
    ctx.fillRect(-0.5, -0.5, RULER, innerHeight + 1);

    ctx.strokeStyle = c.rulerLine;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.font = `${WEIGHT.regular} 9px ${TYPE.stack}`;
    ctx.fillStyle = c.muted;

    // Shade what is LOCKED, so a selection stays findable when it scrolls off.
    // Deliberately not the hovered element: that repaints on every mouse move,
    // and a band flashing across the rule as you sweep the page is noise.
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = c.accent;
    for (const b of state.pinned) {
      ctx.fillRect(snap(b.left), -0.5, Math.round(b.width), RULER);
      ctx.fillRect(-0.5, snap(b.top), RULER, Math.round(b.height));
    }
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(-0.5, RULER - 0.5);
    ctx.lineTo(innerWidth, RULER - 0.5);
    ctx.moveTo(RULER - 0.5, -0.5);
    ctx.lineTo(RULER - 0.5, innerHeight);
    ctx.stroke();

    const tick = (v: number) =>
      v % MAJOR === 0 ? RULER : v % MID === 0 ? 7 : 4;

    // ── top ──────────────────────────────────────────────────────────────
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.beginPath();
    const firstX = Math.floor(ox / MINOR) * MINOR;
    for (let v = firstX; v < ox + innerWidth; v += MINOR) {
      const x = Math.round(v - ox);
      if (x < RULER) continue;
      const len = tick(v);
      ctx.moveTo(x, RULER - len);
      ctx.lineTo(x, RULER);
      if (len === RULER) {
        ctx.fillStyle = c.muted;
        ctx.fillText(String(v), x + 3, 3);
      }
    }
    ctx.stroke();

    // ── left, labels turned to read up the page ──────────────────────────
    ctx.beginPath();
    const firstY = Math.floor(oy / MINOR) * MINOR;
    for (let v = firstY; v < oy + innerHeight; v += MINOR) {
      const y = Math.round(v - oy);
      if (y < RULER) continue;
      const len = tick(v);
      ctx.moveTo(RULER - len, y);
      ctx.lineTo(RULER, y);
      if (len === RULER) {
        ctx.save();
        ctx.translate(3, y - 3);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = c.muted;
        ctx.fillText(String(v), 0, 0);
        ctx.restore();
      }
    }
    ctx.stroke();

    // Where the cursor is, on both rules.
    if (state.cursor) {
      ctx.strokeStyle = c.accent;
      ctx.beginPath();
      ctx.moveTo(Math.round(state.cursor.x), -0.5);
      ctx.lineTo(Math.round(state.cursor.x), RULER);
      ctx.moveTo(-0.5, Math.round(state.cursor.y));
      ctx.lineTo(RULER, Math.round(state.cursor.y));
      ctx.stroke();
    }

    // Where each guide sits, so they are findable on the rule.
    ctx.fillStyle = c.guide;
    for (const g of state.guides) {
      const at = Math.round(guideAt(g));
      if (g.axis === 'x') ctx.fillRect(at - 1, -0.5, 2, RULER);
      else ctx.fillRect(-0.5, at - 1, RULER, 2);
    }

    // The corner, so the two rules read as one frame.
    ctx.fillStyle = c.rulerBg;
    ctx.fillRect(-0.5, -0.5, RULER, RULER);
    ctx.strokeStyle = c.rulerLine;
    ctx.strokeRect(-0.5, -0.5, RULER, RULER);
  }

  /**
   * The pixel texture, under everything. Screen-space, so it does not scroll:
   * it is a ruler for the eye, not a property of the page.
   */
  function pixelGrid() {
    const step = pixelGridStep(10, 1);
    if (!step) return;
    ctx.strokeStyle = c.pixelLine;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    for (let x = 0; x <= innerWidth; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, innerHeight); }
    for (let y = 0; y <= innerHeight; y += step) { ctx.moveTo(0, y); ctx.lineTo(innerWidth, y); }
    ctx.stroke();
  }

  /** The design grid: columns filled, gutters left empty. */
  function grid(spec: GridSpec) {
    // The layout viewport, not `innerWidth`: a classic scrollbar takes width
    // from what the browser centres in, so centring in `innerWidth` would put
    // the grid half a scrollbar to the right of everything it measures.
    const cols = gridColumns(spec, document.documentElement.clientWidth);
    ctx.fillStyle = alpha(c.measure, 0.08);
    for (const col of cols) {
      ctx.fillRect(snap(col.left), -0.5, Math.round(col.width), innerHeight + 1);
    }
  }

  function draw() {
    frame = 0;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Both are references to measure against, so both go under everything.
    if (state.pixels) pixelGrid();
    if (state.grid) grid(state.grid);

    for (const box of state.pinned) outline(box, c.accent);
    if (state.hover) {
      guides(state.hover);
      outline(state.hover, state.pinned.length ? alpha(c.accent, 0.7) : c.accent);
    }
    // A locked guide is drawn solid and at full strength, a loose one dashed
    // and dimmed — so which rulers are still measuring reads at a glance,
    // without spending a second colour on it.
    for (const g of state.guides) {
      const live = state.liveGuide?.id === g.id;
      ctx.strokeStyle = g.locked || live ? c.guide : alpha(c.guide, 0.55);
      // A pinned guide is drawn heavier. It is anchored, and weight is the one
      // thing that reads as anchored without spending another colour.
      ctx.lineWidth = g.pinned ? 2 : 1;
      ctx.setLineDash(g.locked ? [] : [4, 4]);
      ctx.beginPath();
      const at = Math.round(guideAt(g));
      if (g.axis === 'x') { ctx.moveTo(at, 0); ctx.lineTo(at, innerHeight); }
      else { ctx.moveTo(0, at); ctx.lineTo(innerWidth, at); }
      ctx.stroke();

      // Handles at both ends mark the guide the arrow keys will move.
      if (state.activeGuide === g.id) {
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.beginPath();
        const H = 7;
        if (g.axis === 'x') {
          ctx.moveTo(at, 0); ctx.lineTo(at, H);
          ctx.moveTo(at, innerHeight - H); ctx.lineTo(at, innerHeight);
        } else {
          ctx.moveTo(0, at); ctx.lineTo(H, at);
          ctx.moveTo(innerWidth - H, at); ctx.lineTo(innerWidth, at);
        }
        ctx.stroke();
      }
    }

    for (const seg of state.lines) {
      ctx.globalAlpha = seg.faded ? FADED : 1;
      distance(seg);
    }
    ctx.globalAlpha = 1;

    // Labels last, always on top. A distance label sits clear of its own line:
    // above a horizontal one, beside a vertical one — then they are nudged off
    // each other, because a number underneath another number reads as neither.
    const labelled = state.lines.filter((seg) => seg.label !== '');
    const wanted = labelled.map((seg) => {
      const mx = (seg.x1 + seg.x2) / 2;
      const my = (seg.y1 + seg.y2) / 2;
      const { w, h } = chipSize(seg.label);
      return seg.axis === 'x'
        ? { x: mx - w / 2, y: my - 16 - h / 2, w, h, axis: seg.axis }
        : { x: mx + 26 - w / 2, y: my - h / 2, w, h, axis: seg.axis };
    });
    spreadLabels(wanted, { w: innerWidth, h: innerHeight }, EDGE).forEach((at, i) => {
      const seg = labelled[i]!;
      ctx.globalAlpha = seg.faded ? FADED : 1;
      chipAt(seg.label, at.x, at.y, c.measure);
    });
    ctx.globalAlpha = 1;
    if (state.hover && state.cursor) {
      // In the element's own units, like every other number the tool reports.
      const { width, height, scale } = state.hover;
      chip(`${fmt(width / scale.x)} × ${fmt(height / scale.y)}`,
        state.cursor.x + 14, state.cursor.y + 14, c.accent);
    }
    if (state.liveGuide) {
      const g = state.liveGuide;
      const at = Math.round(guideAt(g));
      // Saying what it caught is the whole point of snapping: a guide on an
      // edge and a guide a pixel off it are otherwise indistinguishable.
      chip([`${g.axis} ${fmt(g.at)}`, g.caught, g.pinned ? 'pinned' : ''].filter(Boolean).join(' · '),
        g.axis === 'x' ? at + 6 : 30,
        g.axis === 'x' ? 30 : at + 6, c.guide);
    }
    if (state.rulers) rulers();
  }

  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(draw);
  }

  fit();

  return {
    root,
    update(patch) { Object.assign(state, patch); schedule(); },
    resize() { fit(); schedule(); },
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      scheme.removeEventListener('change', onScheme);
      themeWatch.disconnect();
      host.remove();
    },
  };
}
