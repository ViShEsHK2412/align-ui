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
} as const;

/**
 * One lightness, one chroma, four hues — so no band reads heavier than another.
 */
export const BAND = {
  margin: 'oklch(0.72 0.13 70)',
  border: 'oklch(0.72 0.13 250)',
  padding: 'oklch(0.72 0.13 150)',
  content: 'oklch(0.72 0 0)',
} as const;

/**
 * The same hues as text. A fill can sit at L 0.72 in both themes, but a label
 * cannot: on white that lightness reads around 2.4:1, well under the 4.5:1
 * floor. Contrast is fixed on the L channel alone, so the hue and chroma are
 * untouched and the label still obviously belongs to its band.
 */
export const BAND_INK = {
  margin: 'light-dark(oklch(0.44 0.13 70), oklch(0.8 0.13 70))',
  border: 'light-dark(oklch(0.44 0.16 250), oklch(0.8 0.13 250))',
  padding: 'light-dark(oklch(0.44 0.13 150), oklch(0.8 0.13 150))',
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
