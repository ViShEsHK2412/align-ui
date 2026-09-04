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
  /**
   * The pixel texture. Its own pair rather than a faded `rulerLine`, because
   * `alpha()` appends a slash-alpha and cannot fade a colour that already has
   * one — `oklch(... / 0.28 / 0.5)` does not parse, and canvas answers an
   * unparseable colour by silently keeping the last one it was given.
   */
  pixelLine: pair('oklch(0.205 0 0 / 0.14)', 'oklch(0.97 0 0 / 0.14)'),
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
 * A film of the opposite colour: black on light, white on dark.
 *
 * It takes an alpha per theme, and that is a correction. One number for both
 * was the original idea and it is wrong for contrast, measurably: the same 0.4
 * film reads 3.81:1 as white over `#1a1a1a` and only 2.83:1 as black over
 * `#fafafa`. Low-alpha white gains contrast against a dark ground faster than
 * low-alpha black loses it against a light one, so a single number cannot hit
 * a target in both. The light film has to be heavier to say the same thing.
 *
 * Only the text roles below need two numbers; the surface ladder is background,
 * where the difference is a matter of appearance rather than legibility.
 */
function film(dark: number, light: number = dark): string {
  return themed(pair(`rgb(0 0 0 / ${light})`, `rgb(255 255 255 / ${dark})`));
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
/*
 * Measured, not chosen. Each pair is the lightest film that still clears
 * 4.5:1 against its own ground, computed rather than eyeballed:
 *
 *            dark over #1a1a1a      light over #fafafa
 *   primary   0.90 -> 14.22:1        0.90 -> 16.84:1
 *   secondary 0.60 ->  6.93:1        0.60 ->  5.67:1
 *   tertiary  0.46 ->  4.61:1        0.55 ->  4.71:1
 *
 * Tertiary was 0.4 in both, which is 3.81:1 dark and 2.83:1 light. The light
 * value failed even the 3:1 that a graphic needs when it is the only thing
 * identifying a control -- and since the toolbar buttons became icons, that is
 * exactly what they are.
 */
export const TEXT = {
  primary: film(0.9),
  secondary: film(0.6),
  tertiary: film(0.46, 0.55),
  /**
   * A control that cannot do anything right now. Deliberately below the
   * contrast floor the other three clear, which is allowed and is the point:
   * WCAG exempts disabled controls, and the whole job of this value is to look
   * unavailable rather than merely quiet.
   */
  disabled: film(0.22, 0.26),
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

/** The ruler gutter's thickness, shared by what draws it and what dodges it. */
export const RULER = 22;

/** One row height, so the toolbar and the panel share a rhythm. */
export const ROW = 36;

/**
 * The spacing scale, and the one thing in this file that has to be obeyed
 * rather than admired.
 *
 * It said 2, 4, 8 — Agentation's — and nothing imported it, while the box model
 * quietly ran on 5, 6, 10 and 14. That is not a cosmetic difference: four
 * levels of nesting multiplied those ad-hoc values until the content size, the
 * number you open the panel to read, was squeezed to 83px and ellipsised. A
 * scale that is declared and not used cannot prevent that; a scale that is used
 * cannot allow it.
 *
 * Named, because `SPACE[2]` at a call site says nothing.
 */
export const SPACE = {
  /** Between a label and the thing it labels. */
  tight: 4,
  /** The default gap, and every region's padding. */
  base: 8,
  /** Inside a cell that has to look like a box of its own. */
  roomy: 12,
  /** Between a panel and the edge of the window. */
  edge: 16,
} as const;

/**
 * Motion.
 *
 * Agentation's set had two more: `expand`, a 400ms expo-out for a width
 * change, and `enter`, a 500ms entrance that overshoots. Both are gone, and
 * not for lack of somewhere to put them. Nothing here changes width. And an
 * overshoot is what you give motion that carried momentum into it — a flick,
 * a throw; every surface in this tool is opened by a click, which carries
 * none, so the overshoot would be decoration on the two things that appear
 * most often. Inheriting a system means inheriting its reasoning, not its list.
 */
export const MOTION = {
  /** Slow in, faster out: an exit is not a reversed entrance. */
  exit: '160ms cubic-bezier(0.3, 0, 1, 1)',
  /**
   * The tier Agentation does not have, because it does not need it.
   *
   * `enter` overshoots over half a second, which is right for a toolbar that
   * unfolds once. The box model appears on every single lock, dozens of times
   * a minute, and at that frequency an overshoot stops reading as character
   * and starts reading as lag. Critically damped, and inside Apple's 0.3-0.4s
   * response band for something you touch directly.
   */
  ui: '160ms cubic-bezier(0.2, 0, 0, 1)',
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

/**
 * Is the page we are drawing over dark?
 *
 * Not the same question as `prefers-color-scheme`, and asking that one instead
 * is a mistake worth spelling out: a page is free to be dark on a machine set
 * to light, and plenty are — a docs site with its own toggle, a product whose
 * brand is dark, a demo that simply hard-codes it. Trust the media query and
 * you draw light-theme ink on a dark page, where a 14% black hairline is
 * invisible and every reading you came for is unreadable.
 *
 * Three sources, strongest first:
 *
 *  1. An explicit `color-scheme` on the root. A page that says `dark` has
 *     stated its intent, and the browser has already believed it.
 *  2. The background actually painted behind the page — body's if it has one,
 *     otherwise the root's. This is what the eye sees, so it is what the
 *     overlay has to contrast against.
 *  3. The media query, when the page is transparent and says nothing.
 */
/**
 * An explicit answer, when the caller has one. Set from the config at init, so
 * `pageIsDark` stays a plain function the overlay can call every time it needs
 * to re-check rather than a value someone has to remember to pass along.
 */
let forced: 'light' | 'dark' | null = null;

export function forceTheme(theme: 'auto' | 'light' | 'dark'): void {
  forced = theme === 'auto' ? null : theme;
}

export function pageIsDark(): boolean {
  if (forced) return forced === 'dark';
  const root = document.documentElement;
  const declared = getComputedStyle(root).colorScheme;
  if (/dark/.test(declared) && !/light/.test(declared)) return true;
  if (/light/.test(declared) && !/dark/.test(declared)) return false;

  for (const el of [document.body, root]) {
    if (!el) continue;
    const lum = luminance(getComputedStyle(el).backgroundColor);
    if (lum !== null) return lum < 0.5;
  }
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Perceived lightness of a computed background, or null if it paints nothing.
 *
 * `getComputedStyle` hands back `rgb()`/`rgba()` for a background colour on
 * every engine, so a small parse is enough — no canvas round-trip needed. A
 * mostly-transparent colour is treated as painting nothing, because whatever is
 * behind it is what will actually be seen.
 */
function luminance(color: string): number | null {
  const m = /^rgba?\(([^)]+)\)$/.exec(color.trim());
  if (!m) return null;
  const parts = m[1]!.split(/[\s,/]+/).filter(Boolean).map(Number);
  const [r, g, b, a = 1] = parts;
  if (r === undefined || g === undefined || b === undefined) return null;
  if (a < 0.5) return null;
  // Rec. 709 luma, on 0..1. Good enough to answer light-or-dark.
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** `oklch(...)` → `oklch(... / alpha)`, so alphas stay in the same colour space. */
export function alpha(color: string, a: number): string {
  return color.replace(/\)$/, ` / ${a})`);
}
