/**
 * Design tokens, written once.
 *
 * Colours are Fluid Functionalism's tokens converted to OKLCH. The panel gets
 * them as CSS `light-dark()` pairs and flips with `color-scheme`; the canvas
 * can't evaluate `light-dark()`, so it resolves the pair in JS instead.
 */

interface Pair { light: string; dark: string }

const pair = (light: string, dark: string): Pair => ({ light, dark });

/** Canvas-side colours, resolved per theme. */
export const INK = {
  accent: pair('oklch(0.693 0.161 265.2)', 'oklch(0.693 0.161 265.2)'),   // --focus-ring
  measure: pair('oklch(0.637 0.208 25.3)', 'oklch(0.711 0.166 22.2)'),    // --destructive
  surface: pair('oklch(1 0 0)', 'oklch(0.264 0 0)'),                      // surface-3
  fg: pair('oklch(0.205 0 0)', 'oklch(0.97 0 0)'),
  muted: pair('oklch(0.556 0 0)', 'oklch(0.715 0 0)'),                    // --muted-foreground
  /** The ruler gutters: a surface, slightly translucent over the page. */
  rulerBg: pair('oklch(1 0 0 / 0.92)', 'oklch(0.235 0 0 / 0.92)'),        // surface-3 / surface-2
  rulerLine: pair('oklch(0.205 0 0 / 0.28)', 'oklch(0.97 0 0 / 0.28)'),
} as const;

/**
 * The one place colour survives in the box model: each region's label, so the
 * label can't be mistaken for the region above it. Same hue in both themes,
 * with lightness set for contrast against the surface it sits on — L 0.72 on
 * white reads about 2.4:1, under the 4.5:1 floor for text.
 */
export const BAND_INK = {
  margin: 'light-dark(oklch(0.44 0.13 70), oklch(0.8 0.13 70))',
  border: 'light-dark(oklch(0.44 0.16 250), oklch(0.8 0.13 250))',
  padding: 'light-dark(oklch(0.44 0.13 150), oklch(0.8 0.13 150))',
  content: 'light-dark(oklch(0.44 0 0), oklch(0.8 0 0))',
} as const;

/**
 * Fluid Functionalism's surface system (rule 6), applied to nested regions.
 *
 * Dark mode is the ladder verbatim: an additive white-opacity climb over
 * #171717, so each nested region reads one step nearer the viewer.
 *
 * Light mode can't be: Fluid's light ladder is flat #FFFFFF from surface-3 up
 * and lets *shadow* carry elevation, which works for a popover floating over a
 * page but gives nested regions inside one card nothing to separate them. So
 * light steps down through the neutral tokens the system already defines —
 * surface-1, --muted, --accent — inverting the direction while keeping the
 * same perceptual step size.
 *
 * Index 0 is the panel itself; 1-4 are margin, border, padding and content.
 */
export const NEST = [
  pair('oklch(1 0 0)', 'oklch(0.264 0 0)'),       // --card      / surface-3
  pair('oklch(0.985 0 0)', 'oklch(0.293 0 0)'),   // surface-1   / surface-4
  pair('oklch(0.967 0 0)', 'oklch(0.321 0 0)'),   // --muted     / surface-5
  pair('oklch(0.937 0 0)', 'oklch(0.348 0 0)'),   // step        / surface-6
  pair('oklch(0.922 0 0)', 'oklch(0.375 0 0)'),   // --accent    / surface-7
] as const;

/** Written once here, read as CSS below. */
export const SEMANTIC = {
  fg: pair('oklch(0.205 0 0)', 'oklch(0.97 0 0)'),          // --foreground
  muted: pair('oklch(0.556 0 0)', 'oklch(0.715 0 0)'),      // --muted-foreground
} as const;

/** A colour pair as a CSS `light-dark()` — the one theming point (rule 7). */
export function themed(p: { light: string; dark: string }): string {
  return `light-dark(${p.light}, ${p.dark})`;
}

/** Background for a nesting level, as CSS. */
export const nest = (level: number): string => themed(NEST[level] ?? NEST[0]!);

/**
 * Fluid's shadow ladder. `light-dark()` takes colours only, so a themed shadow
 * has to be two declarations — this returns one, and the caller emits the dark
 * one inside a prefers-color-scheme block.
 *
 * Light: a hairline ring plus additive drops whose offset and blur double as
 * the spread halves. Dark: an inset highlight and ring over the same drops.
 */
const DROPS = [
  '0 1px 1px -0.5px', '0 3px 3px -1.5px', '0 6px 6px -3px', '0 12px 12px -6px',
  '0 24px 24px -12px', '0 48px 48px -24px', '0 96px 96px -48px',
];

export function surfaceShadow(level: number, dark: boolean): string {
  const n = Math.max(1, Math.min(8, Math.round(level)));
  const drops = DROPS.slice(0, n - 1);
  if (!dark) {
    const sc = 'oklch(0 0 0 / 0.06)';
    return [`0 0 0 1px ${sc}`, ...drops.map((d) => `${d} ${sc}`)].join(', ');
  }
  const highlight = [0, 0, 0.01, 0.02, 0.02, 0.04, 0.04, 0.06][n - 1]!;
  const ring = [0.02, 0.02, 0.04, 0.04, 0.06, 0.06, 0.06, 0.06][n - 1]!;
  const drop = 'oklch(0 0 0 / 0.18)';
  const parts = [`inset 0 0 0 1px oklch(1 0 0 / ${ring})`];
  if (highlight) parts.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${highlight})`);
  return [...parts, ...drops.map((d) => `${d} ${drop}`)].join(', ');
}

/**
 * Inter, with a system fallback that keeps working if the font is blocked.
 * `font-synthesis: none` (set on the panel) means a missing weight fails
 * visibly rather than being faked.
 */
export const FONT_STACK =
  'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, ' +
  '"Helvetica Neue", Arial, sans-serif';

/**
 * Type scale, named by use rather than size. Nothing here goes below 11px, and
 * only the band tags do — everything you actually read a number from is 12px+.
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
