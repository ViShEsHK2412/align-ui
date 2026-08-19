import { fmt } from './cluster';
import type { Axis, Box, Violation } from './types';

/**
 * Canvas rendering (§7.1, §7.2). One of the two modules allowed to write to the
 * DOM. Everything is drawn inside a single requestAnimationFrame — never
 * synchronously from an event handler.
 */

export interface Segment {
  x1: number; y1: number; x2: number; y2: number; label: string;
}

/** Filled in by measure mode (§6); null until then. */
export interface MeasureView {
  hover: Box | null;
  anchor: Box | null;
  bands: { padding: number[]; border: number[]; margin: number[] } | null;
  lines: Segment[];
}

export interface OverlayState {
  violations: Violation[];
  highlighted: Violation | null;
  measure: MeasureView | null;
}

const COLOR = {
  align: '#ff4d6d',
  spacing: '#ffb020',
  subpixel: '#4da6ff',
  measure: '#38e08b',
  ink: '#e8edf6',
  pill: 'rgba(10, 13, 18, 0.92)',
} as const;

const VERTICAL: Axis[] = ['left', 'right', 'centerX'];
const FONT = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const EDGE_MARGIN = 40;

export interface Overlay {
  root: ShadowRoot;
  update(patch: Partial<OverlayState>): void;
  /** Re-fit the canvas to the viewport, then redraw. */
  resize(): void;
  destroy(): void;
}

export function mountOverlay(): Overlay {
  const host = document.createElement('div');
  host.id = '__align_host';
  host.setAttribute('data-align-ignore', '');
  // `all: initial` because shadow DOM blocks selector matching but NOT
  // inheritance — without it the host page's font and line-height leak in.
  // `pointer-events: none` because the overlay must not swallow app clicks; the
  // panel re-enables it on itself. documentElement rather than body because
  // React reconciles body children and would fight us during hydration.
  host.style.cssText = 'all: initial; position: fixed; inset: 0; ' +
    'z-index: 2147483647; pointer-events: none;';
  document.documentElement.appendChild(host);

  const root = host.attachShadow({ mode: 'closed' });
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position: fixed; inset: 0; pointer-events: none;';
  root.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const state: OverlayState = { violations: [], highlighted: null, measure: null };
  let frame = 0;
  let labels: (() => void)[] = [];

  function fit() {
    const dpr = devicePixelRatio;
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Half-pixel offset puts 1px strokes on the pixel grid instead of straddling
    // it. A blurry alignment tool is absurd.
    ctx.translate(0.5, 0.5);
  }

  function pill(text: string, x: number, y: number, color: string) {
    ctx.font = FONT;
    const w = ctx.measureText(text).width + 8;
    const h = 16;
    // Flip inward when the label would otherwise run off the viewport.
    const px = x + w > innerWidth - EDGE_MARGIN ? x - w - 8 : x + 4;
    const py = y < EDGE_MARGIN ? y + 6 : y - h - 4;
    ctx.fillStyle = COLOR.pill;
    ctx.fillRect(px, py, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(px, py, 2, h);
    ctx.fillStyle = COLOR.ink;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, px + 6, py + h / 2);
  }

  function guide(axis: Axis, at: number, dashed: boolean, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash(dashed ? [4, 4] : []);
    ctx.beginPath();
    if (VERTICAL.includes(axis)) {
      ctx.moveTo(Math.round(at), 0);
      ctx.lineTo(Math.round(at), innerHeight);
    } else {
      ctx.moveTo(0, Math.round(at));
      ctx.lineTo(innerWidth, Math.round(at));
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function outline(box: Box, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(box.left), Math.round(box.top),
      Math.round(box.width), Math.round(box.height));
    ctx.fillStyle = color;
    ctx.globalAlpha *= 0.1;
    ctx.fillRect(box.left, box.top, box.width, box.height);
    ctx.globalAlpha /= 0.1;
  }

  function drawViolation(v: Violation, dim: boolean) {
    ctx.globalAlpha = dim ? 0.18 : 1;
    const color = COLOR[v.kind];

    if (v.kind === 'align' && v.axis) {
      guide(v.axis, v.majority, true, color);
      for (const value of v.values) {
        if (Math.abs(value - v.majority) < 1e-6) continue;
        guide(v.axis, value, false, color);
      }
    }
    for (const box of v.boxes) outline(box, color);

    if (!dim) {
      const anchor = v.boxes[0];
      if (anchor) {
        const text = v.kind === 'align' && v.axis
          ? `${v.axis} ${fmt(anchor[v.axis])} → ${fmt(v.majority)}`
          : v.message;
        labels.push(() => pill(text, anchor.right, anchor.top, color));
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawMeasure(m: MeasureView) {
    ctx.globalAlpha = 1;
    if (m.hover) outline(m.hover, COLOR.measure);
    if (m.anchor) outline(m.anchor, COLOR.measure);
    for (const seg of m.lines) {
      ctx.strokeStyle = COLOR.measure;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();
      const mx = (seg.x1 + seg.x2) / 2;
      const my = (seg.y1 + seg.y2) / 2;
      labels.push(() => pill(seg.label, mx, my, COLOR.measure));
    }
  }

  function draw() {
    frame = 0;
    labels = [];
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    for (const v of state.violations) {
      drawViolation(v, state.highlighted !== null && state.highlighted !== v);
    }
    if (state.measure) drawMeasure(state.measure);
    for (const label of labels) label();   // labels last, always on top
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
      host.remove();
    },
  };
}
