import {
  clamp, css, fitGamut, formatColour, formatOf, maxChroma,
  parseColour, colourToRgb, type Colour, type Format, type Space,
} from './oklch';
import {
  GROUND, HAIRLINE, MOTION, SHADOW_LIFTED, SPACE, TEXT, TYPE, WEIGHT, surface,
} from './theme';
import { SNAP_SPRING, springSettled, springStep } from './slider';
import { icon } from './icons';

/**
 * The colour picker: the editor's, not the eyedropper's.
 *
 * `picker.ts` next door samples a pixel off the screen and reads it out.
 * This one edits a value in place, which is why the two exist separately
 * despite the names sitting so close together.
 *
 * It exists because `<input type="color">` opens the operating system's own
 * dialog: a different typeface, a different radius, a different idea of what a
 * colour is, drawn on top of a panel that has spent a lot of effort being one
 * consistent thing. It is also sRGB-only and HSV-shaped, so it cannot express
 * a value the page might already hold, and half of its field is unreachable.
 *
 * The structure follows DialKit's ColorControl: an OKLCH plane normalised per
 * row, a hue track sampled at the current lightness, an opacity track, and a
 * format switch. The maths is in colour.ts. What is here is the surface, and
 * it is ours: square corners, the panel's own tokens, a shadow for elevation
 * and no borders anywhere that a fill already draws.
 */

const PLANE_H = 148;
const TRACK_H = 14;
/** Below this the track's own handle is bigger than the travel. */
const HANDLE = 12;

export interface PickerOptions {
  /** Where to place it, in viewport coordinates. */
  anchor: HTMLElement;
  value: string;
  onChange: (value: string) => void;
  onClose?: () => void;
}

export interface Picker {
  update(value: string): void;
  /**
   * Is this node part of the popover?
   *
   * Asked instead of comparing classes off an event path, because the path a
   * listener outside our shadow root receives has been trimmed to the host and
   * contains none of this.
   */
  contains(node: Node | null): boolean;
  destroy(): void;
}

export const PICKER_CSS = `
.pick {
  position: fixed;
  z-index: 3;
  width: 248px;
  display: grid;
  gap: ${SPACE.base}px;
  padding: ${SPACE.roomy}px;
  border-radius: 0;
  /*
   * The host is pointer-events: none so the page underneath stays usable, and
   * every surface of ours has to opt back in. The dock does. This did not, so
   * it rendered perfectly and ignored every click aimed at it.
   */
  pointer-events: auto;
  /*
   * GROUND, opaque, exactly like the dock - not a rung of the surface ladder.
   *
   * Two separate mistakes were stacked here. The first: the ladder is alpha
   * over an opaque ground, and this popover is portalled to the shadow root
   * rather than parented to its row, so it is a sibling of the dock with
   * nothing behind it but the page. surface(6) alone was 20% white over
   * whatever happened to be down there, which is why it was see-through.
   *
   * The second was the fix I reached for first. Painting GROUND and then a
   * surface(6) film on top does make it opaque, but it makes it a *lighter*
   * ground than the panel, and every film above it is then a film over a film:
   * the format labels measured 3.67:1, under AA, the exact failure theme.ts
   * documents for tertiary. The ladder means nested regions of one box model.
   * A popover is not nested six levels deep, it is a new plane - so it gets
   * the ground itself, the shadow carries the elevation, and every pair inside
   * measures the same as it does in the panel.
   */
  background: ${GROUND};
  /*
   * A shadow, not a border. This is the one thing on the panel that is
   * genuinely floating above another surface, and elevation is what a shadow
   * is for; an outline here would read as a box drawn around a box.
   */
  box-shadow: ${SHADOW_LIFTED};
  /*
   * Typography too, for the same reason: it is not inside the dock, so it
   * inherits from a host pinned by all: initial, and comes out in the
   * browser's default serif at the browser's default size.
   */
  font-family: ${TYPE.stack};
  font-synthesis: none;
  font-size: ${TYPE.body}px;
  font-weight: ${WEIGHT.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${TEXT.primary};
  transition: opacity ${MOTION.ui}, translate ${MOTION.ui};
}
@starting-style { .pick { opacity: 0; translate: 0 -4px; } }
.pick[data-closing] { opacity: 0; translate: 0 -4px; }

/* The plane. */
.pick-plane {
  position: relative;
  width: 100%; height: ${PLANE_H}px;
  cursor: crosshair; touch-action: none;
}
.pick-plane:focus-visible { outline: 2px solid ${TEXT.primary}; outline-offset: 2px; }
.pick-canvas { display: block; width: 100%; height: 100%; }
.pick-marker {
  position: absolute; left: 0; top: 0;
  width: 12px; height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  pointer-events: none;
  /*
   * The one place a ring is load-bearing rather than decorative: it sits on
   * arbitrary colour, so nothing about the surface beneath it is known. Two
   * rings, light outside dark, so one of them always has contrast. This is the
   * exception the rules name, not an exception to them.
   */
  box-shadow: 0 0 0 1.5px #fff, 0 0 0 3px rgb(0 0 0 / 0.45);
}

/* Hue and opacity. */
.pick-track {
  position: relative;
  height: ${TRACK_H}px;
  cursor: pointer; touch-action: none;
}
.pick-track:focus-visible { outline: 2px solid ${TEXT.primary}; outline-offset: 2px; }
.pick-track-bed { position: absolute; inset: 0; }
.pick-hue .pick-track-bed {
  background: var(--track);
}
.pick-alpha .pick-track-bed {
  /* The checkerboard is the only honest ground for an alpha ramp. */
  background-image: var(--track), var(--checker);
  background-size: auto, 8px 8px;
  background-position: 0 0, 0 0;
}
.pick-thumb {
  position: absolute; top: 50%; left: 0;
  width: ${HANDLE}px; height: ${HANDLE}px;
  margin-top: -${HANDLE / 2}px; margin-left: -${HANDLE / 2}px;
  border-radius: 50%;
  background: var(--thumb, #fff);
  box-shadow: 0 0 0 1.5px #fff, 0 0 0 3px rgb(0 0 0 / 0.45);
  pointer-events: none;
}

/* Bottom rows. */
.pick-row { display: flex; align-items: center; gap: ${SPACE.tight}px; }
.pick-seg { display: flex; gap: 2px; flex: 1; }
.pick-fmt {
  flex: 1;
  height: 22px; padding: 0;
  border: 0; border-radius: 0;
  background: ${surface(3)}; color: ${TEXT.secondary};
  font: inherit; font-size: ${TYPE.tag}px; font-weight: ${WEIGHT.medium};
  cursor: pointer;
  transition: background ${MOTION.ui}, color ${MOTION.ui};
}
.pick-fmt:hover { background: ${surface(4)}; color: ${TEXT.primary}; }
.pick-fmt[data-on] { background: ${TEXT.primary}; color: ${GROUND}; }
.pick-fmt:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

.pick-css {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 ${SPACE.base / 2}px;
  border: 0; border-radius: 0;
  background: ${surface(2)}; color: ${TEXT.primary};
  font: inherit; font-size: ${TYPE.tag}px;
  font-variant-numeric: tabular-nums;
}
.pick-css[aria-invalid] { color: ${TEXT.primary}; background: ${surface(4)}; }
.pick-css:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

.pick-dropper {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${surface(2)}; color: ${TEXT.secondary};
  cursor: pointer;
  transition: background ${MOTION.ui}, color ${MOTION.ui};
}
.pick-dropper:hover { background: ${surface(4)}; color: ${TEXT.primary}; }
.pick-dropper:focus-visible { outline: 2px solid ${TEXT.secondary}; outline-offset: -2px; }

/* Out of gamut in the chosen output space. */
.pick-warn {
  display: none;
  align-items: center; gap: ${SPACE.tight}px;
  color: ${TEXT.secondary}; font-size: ${TYPE.tag}px;
}
.pick[data-clipped] .pick-warn { display: flex; }

@media (prefers-reduced-motion: reduce) {
  .pick { transition: none; }
}
`;

const CHECKER =
  'conic-gradient(' + HAIRLINE + ' 0 25%, transparent 0 50%, '
  + HAIRLINE + ' 0 75%, transparent 0)';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K, className: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (node instanceof HTMLButtonElement) node.type = 'button';
  return node;
}

export function createPicker(root: ShadowRoot, opts: PickerOptions): Picker {
  let colour: Colour = parseColour(opts.value) ?? { l: 0.5, c: 0, h: 0, a: 1 };
  let format: Format = formatOf(opts.value);
  /*
   * Held separately from the colour. At pure white and pure black there is no
   * chroma to divide by, so the handle's horizontal position is not recoverable
   * from the value — drag to the top and it would snap to the left edge.
   */
  let saturation = 0;
  let lastEmitted = '';

  const pick = el('div', 'pick');
  pick.setAttribute('role', 'dialog');
  pick.setAttribute('aria-label', 'Colour picker');
  pick.style.setProperty('--checker', CHECKER);

  const plane = el('div', 'pick-plane');
  plane.tabIndex = 0;
  plane.setAttribute('role', 'application');
  plane.setAttribute(
    'aria-label',
    'Colour field. Arrow keys adjust lightness and saturation.',
  );
  const canvas = el('canvas', 'pick-canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const marker = el('span', 'pick-marker');
  plane.append(canvas, marker);

  const hue = track('pick-hue', 'Hue');
  const alpha = track('pick-alpha', 'Opacity');

  const segRow = el('div', 'pick-row');
  const seg = el('div', 'pick-seg');
  seg.setAttribute('role', 'radiogroup');
  seg.setAttribute('aria-label', 'Colour format');
  const FORMATS: Format[] = ['hex', 'oklch', 'p3'];
  const LABELS = { hex: 'Hex', oklch: 'OKLCH', p3: 'P3' } as const;
  const fmtButtons = FORMATS.map((f) => {
    const b = el('button', 'pick-fmt');
    b.textContent = LABELS[f];
    b.setAttribute('role', 'radio');
    b.addEventListener('click', () => commit(colour, f));
    seg.append(b);
    return b;
  });
  segRow.append(seg);

  const cssRow = el('div', 'pick-row');
  const output = el('input', 'pick-css');
  output.type = 'text';
  output.spellcheck = false;
  output.setAttribute('aria-label', 'CSS colour');
  cssRow.append(output);

  // Only offered where it exists; a dead button is worse than no button.
  const hasDropper = 'EyeDropper' in window;
  if (hasDropper) {
    const drop = el('button', 'pick-dropper');
    drop.setAttribute('aria-label', 'Pick a colour from the screen');
    drop.append(icon('pick', 14));
    drop.addEventListener('click', async () => {
      try {
        const Ctor = (window as unknown as {
          EyeDropper: new () => { open(): Promise<{ sRGBHex: string }> };
        }).EyeDropper;
        const res = await new Ctor().open();
        const parsed = parseColour(res.sRGBHex);
        if (parsed) commit({ ...parsed, a: colour.a });
      } catch {
        /* Dismissed. Nothing to report and nothing to change. */
      }
    });
    cssRow.append(drop);
  }

  const warn = el('div', 'pick-warn');
  warn.append(icon('warning', 12));
  const warnText = document.createElement('span');
  warn.append(warnText);

  pick.append(plane, hue.el, alpha.el, segRow, cssRow, warn);
  root.append(pick);

  // ── The plane ─────────────────────────────────────────────────────────────

  /* Hex is sRGB by definition; the other two can address the wider gamut. */
  const planeSpace = (): Space => (format === 'hex' ? 'srgb' : 'p3');

  const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
  const canvasSpace: Space =
    ctx?.getContextAttributes?.().colorSpace === 'display-p3' ? 'p3' : 'srgb';

  let lastPaint = '';
  let paintFrame = 0;

  function paint(): void {
    if (!ctx) return;
    const key = `${colour.h.toFixed(3)}:${planeSpace()}:${canvas.width}`;
    if (key === lastPaint) return;
    lastPaint = key;
    const { width, height } = canvas;
    const px = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      const l = 1 - y / (height - 1);
      /*
       * Each row is normalised to the chroma available at that lightness, so
       * the field's right edge is the most saturated colour that exists here
       * rather than a band of clipping. This is the whole point of the OKLCH
       * plane over the HSV square.
       */
      const max = maxChroma(l, colour.h, planeSpace());
      for (let x = 0; x < width; x++) {
        const rgb = colourToRgb(
          { l, c: (x / (width - 1)) * max, h: colour.h, a: 1 },
          canvasSpace,
        );
        const i = (y * width + x) * 4;
        px.data[i] = Math.round(clamp(rgb[0]) * 255);
        px.data[i + 1] = Math.round(clamp(rgb[1]) * 255);
        px.data[i + 2] = Math.round(clamp(rgb[2]) * 255);
        px.data[i + 3] = 255;
      }
    }
    ctx.putImageData(px, 0, 0);
  }

  function sizeCanvas(): void {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(plane.clientWidth * dpr));
    const h = Math.max(1, Math.round(PLANE_H * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    lastPaint = '';
  }

  function planeMove(e: PointerEvent): void {
    const r = plane.getBoundingClientRect();
    const l = 1 - clamp((e.clientY - r.top) / r.height);
    saturation = clamp((e.clientX - r.left) / r.width);
    commit({ ...colour, l, c: saturation * maxChroma(l, colour.h, planeSpace()) });
  }

  plane.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    plane.focus({ preventScroll: true });
    // Throws for a pointer that is already up. Losing the gesture is worse
    // than losing the capture.
    try { plane.setPointerCapture(e.pointerId); } catch { /* fine */ }
    planeMove(e);
  });
  plane.addEventListener('pointermove', (e) => {
    if (plane.hasPointerCapture(e.pointerId)) planeMove(e);
  });
  plane.addEventListener('pointerup', (e) => {
    if (plane.hasPointerCapture(e.pointerId)) plane.releasePointerCapture(e.pointerId);
  });
  plane.addEventListener('keydown', (e) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const step = e.shiftKey ? 0.1 : 0.01;
    const l = clamp(colour.l + (e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0));
    saturation = clamp(
      saturation + (e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0),
    );
    commit({ ...colour, l, c: saturation * maxChroma(l, colour.h, planeSpace()) });
  });

  // ── The tracks ────────────────────────────────────────────────────────────

  /**
   * One gradient track.
   *
   * Same contract as the panel's sliders, and for the same reason: a drag is
   * the pointer's, exactly, so the handle never lags the finger; a click is a
   * request, so it springs. `SNAP_SPRING` is the panel's, not a second feel
   * invented here.
   */
  function track(kind: string, label: string) {
    const node = el('div', `pick-track ${kind}`);
    node.tabIndex = 0;
    node.setAttribute('role', 'slider');
    node.setAttribute('aria-label', label);
    const bed = el('div', 'pick-track-bed');
    const thumb = el('div', 'pick-thumb');
    node.append(bed, thumb);

    let shown = 0;
    let velocity = 0;
    let target = 0;
    let raf = 0;
    let lastT = 0;
    let dragging = false;
    let onInput: (f: number) => void = () => {};

    const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

    function place(): void {
      thumb.style.left = `${shown * 100}%`;
    }

    function stop(): void {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      velocity = 0;
    }

    function springTo(next: number): void {
      target = next;
      if (reduced()) { stop(); shown = next; place(); return; }
      lastT = performance.now();
      if (raf) return;
      const tick = (now: number): void => {
        // Clamped, or one long task integrates a single enormous step.
        const dt = Math.min((now - lastT) / 1000, 1 / 30);
        lastT = now;
        const s = springStep(shown, velocity, target, dt, SNAP_SPRING);
        shown = s.x;
        velocity = s.v;
        place();
        if (springSettled(shown, velocity, target, 0.0005)) {
          shown = target; velocity = 0; raf = 0; place(); return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    function fractionAt(e: PointerEvent): number {
      const r = node.getBoundingClientRect();
      return clamp((e.clientX - r.left) / r.width);
    }

    node.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      node.focus({ preventScroll: true });
      try { node.setPointerCapture(e.pointerId); } catch { /* fine */ }
      const f = fractionAt(e);
      // Springs to where you pressed, then tracks you exactly from there.
      springTo(f);
      onInput(f);
      dragging = true;
    });
    node.addEventListener('pointermove', (e) => {
      if (!dragging || !node.hasPointerCapture(e.pointerId)) return;
      const f = fractionAt(e);
      stop();
      shown = f;
      target = f;
      place();
      onInput(f);
    });
    const release = (e: PointerEvent): void => {
      dragging = false;
      if (node.hasPointerCapture(e.pointerId)) node.releasePointerCapture(e.pointerId);
    };
    node.addEventListener('pointerup', release);
    node.addEventListener('pointercancel', release);
    node.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 0.1 : 0.01;
      const d = e.key === 'ArrowRight' ? step
        : e.key === 'ArrowLeft' ? -step
        : e.key === 'Home' ? -1
        : e.key === 'End' ? 1
        : 0;
      if (!d) return;
      e.preventDefault();
      const f = clamp(shown + d);
      springTo(f);
      onInput(f);
    });

    return {
      el: node,
      set(fraction: number, valueText: string): void {
        node.setAttribute('aria-valuenow', valueText);
        node.setAttribute('aria-valuetext', valueText);
        if (dragging) return;
        stop();
        shown = fraction;
        target = fraction;
        place();
      },
      bind(fn: (f: number) => void): void { onInput = fn; },
      gradient(value: string): void { bed.style.setProperty('--track', value); },
      thumbColour(value: string): void { thumb.style.setProperty('--thumb', value); },
      destroy(): void { stop(); },
    };
  }

  hue.bind((f) => {
    const h = f * 360;
    // Hold the handle's place in the field: the same saturation at the new hue.
    commit({ ...colour, h, c: saturation * maxChroma(colour.l, h, planeSpace()) });
  });
  alpha.bind((f) => commit({ ...colour, a: f }));

  // ── State ─────────────────────────────────────────────────────────────────

  function commit(next: Colour, nextFormat: Format = format): void {
    format = nextFormat;
    /*
     * Hex and P3 are bounded output spaces, so the handle must sit on the
     * colour that will actually be emitted, not on one the format cannot
     * express. OKLCH is unbounded, so it is left alone.
     */
    colour = format === 'oklch'
      ? next
      : fitGamut(next, format === 'p3' ? 'p3' : 'srgb');
    const value = formatColour(colour, format);
    lastEmitted = value;
    render();
    opts.onChange(value);
  }

  function accept(input: HTMLInputElement): boolean {
    const parsed = parseColour(input.value);
    if (!parsed) {
      input.setAttribute('aria-invalid', 'true');
      input.title = 'Hex, rgb(), hsl(), oklch() or color(display-p3 ...)';
      return false;
    }
    input.removeAttribute('aria-invalid');
    input.title = '';
    // Grey has no recoverable hue; keep the one the wheel is already on.
    colour = { ...parsed, h: parsed.c < 1e-7 ? colour.h : parsed.h };
    format = formatOf(input.value);
    lastEmitted = input.value.trim();
    render();
    opts.onChange(lastEmitted);
    return true;
  }

  output.addEventListener('change', () => accept(output));
  output.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); accept(output); }
    if (e.key === 'Escape') {
      output.value = lastEmitted;
      output.removeAttribute('aria-invalid');
    }
    e.stopPropagation();
  });
  output.addEventListener('blur', () => {
    if (!output.hasAttribute('aria-invalid')) return;
    output.value = lastEmitted;
    output.removeAttribute('aria-invalid');
  });

  let lastHueKey = '';

  function render(): void {
    const space = planeSpace();
    const max = maxChroma(colour.l, colour.h, space);
    if (max > 0) saturation = clamp(colour.c / max);
    marker.style.left = `${saturation * 100}%`;
    marker.style.top = `${(1 - colour.l) * 100}%`;
    marker.style.background = css(colour, true);

    hue.set(colour.h / 360, `${Math.round(colour.h)} degrees`);
    alpha.set(colour.a, `${Math.round(colour.a * 100)} percent`);

    /*
     * The hue strip is sampled at the current lightness and saturation, so it
     * previews the colour you would actually get rather than a generic rainbow
     * that lies at every point but one. 73 stops is every 5 degrees; the eye
     * cannot find the seams and the recompute stays cheap.
     */
    const hueKey = `${colour.l.toFixed(4)}:${saturation.toFixed(4)}:${space}`;
    if (hueKey !== lastHueKey) {
      lastHueKey = hueKey;
      const stops = Array.from({ length: 73 }, (_, i) => {
        const h = i * 5;
        return formatColour(
          { l: colour.l, c: saturation * maxChroma(colour.l, h, space), h, a: 1 },
          'oklch',
        );
      });
      // oklab: even brightness between stops and no hue detour, which is what
      // a ramp already sampled by hue wants.
      hue.gradient(`linear-gradient(to right in oklab, ${stops.join(', ')})`);
    }
    hue.thumbColour(css(colour, true));

    alpha.gradient(
      `linear-gradient(to right in oklab, ${css({ ...colour, a: 0 })}, ${css(colour, true)})`,
    );
    alpha.thumbColour(css(colour));

    fmtButtons.forEach((b, i) => {
      const on = FORMATS[i] === format;
      b.toggleAttribute('data-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });

    if (document.activeElement !== output && root.activeElement !== output) {
      output.value = formatColour(colour, format);
      output.removeAttribute('aria-invalid');
    }

    /*
     * Say so when the output space cannot hold the colour, rather than
     * silently emitting something duller than the handle shows. Only OKLCH can
     * be out of gamut here, because the other two are fitted on commit.
     */
    const clipped = format === 'oklch'
      && !colourToRgb(colour, 'srgb').every((n) => n >= -0.00001 && n <= 1.00001);
    pick.toggleAttribute('data-clipped', clipped);
    if (clipped) warnText.textContent = 'Outside sRGB — clipped on older displays';

    cancelAnimationFrame(paintFrame);
    paintFrame = requestAnimationFrame(paint);
  }

  // ── Placement ─────────────────────────────────────────────────────────────

  function position(): void {
    const a = opts.anchor.getBoundingClientRect();
    const w = 248;
    const h = pick.offsetHeight || 320;
    /*
     * Which side, decided by where the anchor is rather than by whether the
     * preferred side happens to fit.
     *
     * Flipping on fit alone puts the popover on top of the panel it was opened
     * from - it runs out of room on the right, flips left, and lands over the
     * row you are editing, which is the one thing it must not cover. The
     * anchor's own half of the screen is the honest signal: a control on the
     * left opens right, a control on the right opens left. Either way the
     * popover goes away from the panel, and the clamp only ever trims it
     * against the viewport edge.
     */
    const goRight = a.left + a.width / 2 < innerWidth / 2;
    let left = goRight ? a.right + SPACE.base : a.left - w - SPACE.base;
    left = clamp(left, SPACE.base, Math.max(SPACE.base, innerWidth - w - SPACE.base));
    let top = a.top;
    if (top + h > innerHeight - SPACE.base) top = innerHeight - h - SPACE.base;
    top = Math.max(SPACE.base, top);
    pick.style.left = `${left}px`;
    pick.style.top = `${top}px`;
  }

  sizeCanvas();
  render();
  position();
  // Height is only known once it has laid out, and the flip depends on height.
  requestAnimationFrame(position);

  const onScroll = (): void => position();
  addEventListener('scroll', onScroll, true);
  addEventListener('resize', onScroll);

  const observer = new ResizeObserver(() => { sizeCanvas(); render(); });
  observer.observe(plane);

  let dead = false;

  return {
    contains(node: Node | null): boolean {
      return node ? pick.contains(node) : false;
    },
    update(value: string): void {
      if (dead || value === lastEmitted) return;
      const parsed = parseColour(value);
      if (!parsed) return;
      colour = { ...parsed, h: parsed.c < 1e-7 ? colour.h : parsed.h };
      format = formatOf(value);
      render();
    },
    destroy(): void {
      if (dead) return;
      dead = true;
      cancelAnimationFrame(paintFrame);
      hue.destroy();
      alpha.destroy();
      observer.disconnect();
      removeEventListener('scroll', onScroll, true);
      removeEventListener('resize', onScroll);
      pick.setAttribute('data-closing', '');
      const done = (): void => pick.remove();
      pick.addEventListener('transitionend', done, { once: true });
      // A transition that never runs would leave it on screen forever.
      setTimeout(done, 260);
      opts.onClose?.();
    },
  };
}
