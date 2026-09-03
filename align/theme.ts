/**
 * Design tokens, written once.
 *
 * Two colour systems, because there are two kinds of surface.
 *
 * The **canvas** draws over someone else's page, so its colours are solid hues
 * with fixed meanings — red is a measurement, blue a selection, cyan a guide —
 * resolved per theme in JS, since canvas cannot evaluate `light-dark()`.
 *
 * The **panels** are our own surfaces, and they are built as a film of alpha
 * laid over an opaque ground, the way Agentation builds its toolbar. The film
 * is what makes one set of numbers work in both themes: white over a dark
 * ground, black over a light one, same alphas. Fluid Functionalism's ladder,
 * which this replaces, could not do that — its light ladder is flat white from
 * surface-3 up and lets shadow carry elevation, which leaves nested regions
 * inside one card with nothing to separate them, so light mode had to be
 * hand-inverted. Alpha removes that whole problem.
 */

interface Pair { light: string; dark: string }

const pair = (light: string, dark: string): Pair => ({ light, dark });

/** Canvas-side colours, resolved per theme. */
export const INK = {
  accent: pair('oklch(0.693 0.161 265.2)', 'oklch(0.693 0.161 265.2)'),
  measure: pair('oklch(0.637 0.208 25.3)', 'oklch(0.711 0.166 22.2)'),
  surface: pair('oklch(1 0 0)', 'oklch(0.264 0 0)'),
  fg: pair('oklch(0.205 0 0)', 'oklch(0.97 0 0)'),
  muted: pair('oklch(0.556 0 0)', 'oklch(0.715 0 0)'),
  /** Guides get a hue of their own: measurements are red, selection is blue. */
  guide: pair('oklch(0.62 0.13 195)', 'oklch(0.75 0.13 195)'),
  /** The ruler gutters: a surface, slightly translucent over the page. */
  rulerBg: pair('oklch(1 0 0 / 0.92)', 'oklch(0.235 0 0 / 0.92)'),
  rulerLine: pair('oklch(0.205 0 0 / 0.28)', 'oklch(0.97 0 0 / 0.28)'),
} as const;

/**
 * Colours we author in OKLCH already render in the widest gamut the display
 * offers, so Agentation's explicit `color(display-p3 …)` block — which it needs
 * because it authors in hex — would be redundant here. The benefit is taken;
 * the code for it is not.
 */

/** A colour pair as a CSS `light-dark()` — the one theming point. */
export function themed(p: { light: string; dark: string }): string {
  return `light-dark(${p.light}, ${p.dark})`;
}

/** What every panel sits on. Everything else is a film laid over this. */
export const GROUND = themed(pair('#fafafa', '#1a1a1a'));

/**
 * A film of the opposite colour at `a` alpha. Black on light, white on dark —
 * one number, both themes, and it composites over whatever it is nested in, so
 * depth accumulates naturally the deeper a region sits.
 */
function film(a: number): string {
  return themed(pair(`rgb(0 0 0 / ${a})`, `rgb(255 255 255 / ${a})`));
}

/**
 * The surface ladder, from Agentation's toolbar. Index 0 is the ground itself;
 * 1 upward are the nested regions of the box model, each one step nearer.
 */
const LADDER = [0, 0.07, 0.08, 0.10, 0.12, 0.15, 0.20] as const;

export function surface(level: number): string {
  const a = LADDER[Math.max(0, Math.min(LADDER.length - 1, level))]!;
  return a === 0 ? GROUND : film(a);
}

/**
 * Three text levels rather than two. A panel with a header, band labels,
 * numbers, a type readout and a token line has more than two things to say,
 * and dialkit's system is explicit that three is where it settles.
 */
export const TEXT = {
  primary: film(0.9),
  secondary: film(0.6),
  tertiary: film(0.4),
} as const;

/** A hairline of the same film, for rules between sections. */
export const HAIRLINE = film(0.12);

/**
 * Agentation's shadow: two soft layers, no ring. Depth comes from the surface
 * ladder, so the shadow only has to lift the panel off the page.
 */
export const SHADOW = '0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)';
/** While dragging, it lifts. */
export const SHADOW_LIFTED = '0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)';

/** One row height, so the toolbar and the panel share a rhythm. */
export const ROW = 36;

/** Agentation's spacing: 2, 4, 8. Nothing between, nothing beyond. */
export const SPACE = [2, 4, 8] as const;

/**
 * Motion, from Agentation's toolbar. The expand curve is expo-out, which lands
 * a width change without the tail an ease-out leaves; the entrance overshoots
 * a little, which is the only place in the tool anything does.
 */
export const MOTION = {
  expand: '400ms cubic-bezier(0.19, 1, 0.22, 1)',
  enter: '500ms cubic-bezier(0.34, 1.2, 0.64, 1)',
  /** Slow in, faster out: an exit is not a reversed entrance. */
  exit: '160ms cubic-bezier(0.3, 0, 1, 1)',
} as const;

/**
 * Inter, with a system fallback that keeps working if the font is blocked.
 * `font-synthesis: none` (set on the panel) means a missing weight fails
 * visibly rather than being faked.
 */
export const FONT_STACK =
  'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, ' +
  '"Helvetica Neue", Arial, sans-serif';

/**
 * Type scale, named by use rather than size.
 *
 * Agentation's scale bottoms out at 10px. Ours stops at 11, and that is
 * deliberate: everything you read a number from is 12px or larger, and a
 * measuring tool whose numbers are hard to read has failed at the only thing
 * it does.
 */
export const TYPE = {
  title: 13,      // panel header, element label
  body: 12,       // every number, and the cursor tooltip
  tag: 11,        // band names: margin / border / padding
  stack: FONT_STACK,
} as const;

export const WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

const FONT_ID = '__align_font';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';

/**
 * Inter has to be loaded at document level: `@font-face` inside a shadow root
 * is ignored, so a stylesheet in our own shadow CSS would never apply. Injected
 * on first activation rather than at init, so the tool still costs nothing at
 * rest, and removed again on teardown.
 *
 * If the host page blocks it (CSP, offline), the fallback stack takes over and
 * everything still reads correctly — it just isn't Inter.
 */
export function loadFont(): void {
  if (document.getElementById(FONT_ID)) return;
  const link = document.createElement('link');
  link.id = FONT_ID;
  link.rel = 'stylesheet';
  link.href = FONT_HREF;
  link.setAttribute('data-align-ignore', '');
  document.head.appendChild(link);
}

export function unloadFont(): void {
  document.getElementById(FONT_ID)?.remove();
}

/** Canvas needs the face resolved before it can measure text with it. */
export function whenFontReady(cb: () => void): void {
  const faces = [`${WEIGHT.medium} ${TYPE.body}px Inter`];
  Promise.all(faces.map((f) => document.fonts.load(f))).then(cb, cb);
}

export type Ink = { -readonly [K in keyof typeof INK]: string };

/** Resolve every pair for the viewer's current theme. */
export function ink(dark: boolean): Ink {
  const out = {} as Ink;
  for (const key of Object.keys(INK) as (keyof typeof INK)[]) {
    out[key] = dark ? INK[key].dark : INK[key].light;
  }
  return out;
}

export function prefersDark(): boolean {
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

/** `oklch(...)` → `oklch(... / alpha)`, so alphas stay in the same colour space. */
export function alpha(color: string, a: number): string {
  return color.replace(/\)$/, ` / ${a})`);
}
