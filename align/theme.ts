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

export const TYPE = {
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  tooltip: 11,
} as const;

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
