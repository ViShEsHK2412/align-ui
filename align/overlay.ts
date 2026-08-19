import { fmt } from './measure';
import { alpha, ink, prefersDark, TYPE, WEIGHT, whenFontReady, type Ink } from './theme';
import type { Box, Segment } from './types';

/**
 * Canvas rendering. One of the two modules allowed to write to the DOM.
 * Everything draws inside a single requestAnimationFrame — never synchronously
 * from an event handler.
 */

export interface OverlayState {
  hover: Box | null;
  pinned: Box | null;
  lines: Segment[];
  cursor: { x: number; y: number } | null;
}

const CAP = 5;          // end-cap length on a distance line
const PAD = 4;          // chip padding
const EDGE = 12;        // keep chips this far from the viewport edge

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

  const state: OverlayState = { hover: null, pinned: null, lines: [], cursor: null };
  let c: Ink = ink(prefersDark());
  let frame = 0;

  const scheme = matchMedia('(prefers-color-scheme: dark)');
  const onScheme = () => { c = ink(scheme.matches); schedule(); };
  scheme.addEventListener('change', onScheme);

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
    ctx.strokeStyle = c.measure;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(Math.round(seg.x1), Math.round(seg.y1));
    ctx.lineTo(Math.round(seg.x2), Math.round(seg.y2));
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
  function chip(text: string, x: number, y: number, bg: string, center = false) {
    ctx.font = `${WEIGHT.medium} ${TYPE.body}px ${TYPE.stack}`;
    ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width + PAD * 2;
    const h = TYPE.body + PAD * 2 + 2;
    const left = center ? x - w / 2 : x;
    const top = center ? y - h / 2 : y;
    const cx = Math.min(Math.max(left, EDGE), innerWidth - w - EDGE);
    const cy = Math.min(Math.max(top, EDGE), innerHeight - h - EDGE);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(cx, cy, w, h, 4);
    ctx.fill();
    ctx.fillStyle = c.surface;
    ctx.fillText(text, cx + PAD, cy + h / 2);
  }

  function draw() {
    frame = 0;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (state.pinned) outline(state.pinned, c.accent);
    if (state.hover) {
      guides(state.hover);
      outline(state.hover, state.pinned ? alpha(c.accent, 0.7) : c.accent);
    }
    for (const seg of state.lines) distance(seg);

    // Labels last, always on top. A distance label sits clear of its own line:
    // above a horizontal one, beside a vertical one.
    for (const seg of state.lines) {
      const mx = (seg.x1 + seg.x2) / 2;
      const my = (seg.y1 + seg.y2) / 2;
      if (seg.axis === 'x') chip(seg.label, mx, my - 16, c.measure, true);
      else chip(seg.label, mx + 26, my, c.measure, true);
    }
    if (state.hover && state.cursor) {
      const { width, height } = state.hover;
      chip(`${fmt(width)} × ${fmt(height)}`,
        state.cursor.x + 14, state.cursor.y + 14, c.accent);
    }
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
      host.remove();
    },
  };
}
