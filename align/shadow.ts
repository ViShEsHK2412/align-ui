/**
 * Box shadows, and the one filter that is safe to edit.
 *
 * A shadow is the only property on the list that is a *list*. Everything else
 * is one value with one control; this is an ordered stack where the layering is
 * the technique — a single shadow looks flat, and three with increasing blur
 * and decreasing opacity is what depth actually is. So it needs add, remove and
 * reorder, not a row.
 *
 * The parsing is here and pure, because the shape of a computed shadow is the
 * part most likely to be wrong and the part hardest to notice being wrong: the
 * browser normalises what you wrote into its own order, and a parser that
 * assumes the order you wrote it in works until the first time it does not.
 */

export interface Shadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  colour: string;
  /** Drawn inside the box rather than outside it. */
  inset: boolean;
}

/**
 * A new shadow, at rest.
 *
 * Every number is zero, deliberately. This used to open at 0 2px 8px, which is
 * a perfectly nice shadow and exactly the problem: the panel had picked one for
 * you and then showed you its numbers as though you had. You would drag y and
 * be adjusting someone else's 2px rather than setting your own. Zero is the
 * only starting point that is not an opinion - the layer exists, draws nothing,
 * and every pixel after that is yours.
 *
 * The colour is not zero, because a transparent shadow could never become
 * visible by dragging the lengths, and a control that cannot do anything until
 * you find the one field that unlocks it is a trap rather than a default.
 */
export const EMPTY_SHADOW: Shadow = {
  x: 0, y: 0, blur: 0, spread: 0, colour: 'rgba(0, 0, 0, 0.2)', inset: false,
};

/**
 * Split on a separator that is not inside brackets.
 *
 * `rgba(0, 0, 0, 0.2)` contains three commas, so splitting a shadow list on
 * every comma tears each colour into pieces and produces four layers where
 * there was one. This is why the naive version of this function is a bug
 * waiting for anyone who uses `rgba` — which is everyone.
 */
export function splitTopLevel(value: string, separator: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth += 1;
    else if (ch === ')') depth -= 1;
    if (ch === separator && depth === 0) {
      out.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) out.push(current.trim());
  return out.filter(Boolean);
}

/**
 * One layer, from whatever order the browser wrote it in.
 *
 * The lengths are taken in order and everything else is identified by what it
 * is rather than by where it sits: `inset` is a keyword wherever it appears,
 * and the colour is whatever is left. Chrome puts the colour first, Firefox
 * last, and the spec allows either.
 */
export function parseShadow(value: string): Shadow | null {
  const text = value.trim();
  if (!text || text === 'none') return null;

  let rest = text;
  const inset = /(^|\s)inset(\s|$)/.test(rest);
  if (inset) rest = rest.replace(/(^|\s)inset(\s|$)/, ' ').trim();

  /*
   * Bracketed functions first, so rgb(0 0 0 / 20%) survives being split on
   * whitespace, which is a form the browser will happily hand back.
   *
   * The placeholder is @n. It was a raw NUL byte, which worked - nothing in a
   * CSS value can collide with it - but it made this a binary file: grep skips
   * it, diffs go unreadable, and a minifier is within its rights to mangle a
   * NUL inside a string literal. @ is as safe and stays text, because by this
   * point every name(...) group is already extracted and a bare @ cannot
   * appear in what is left.
   */
  const functions: string[] = [];
  rest = rest.replace(/[a-z-]+\([^)]*\)/gi, (m) => {
    functions.push(m);
    return `@${functions.length - 1}`;
  });

  const parts = rest.split(/\s+/).filter(Boolean)
    .map((p) => (p.startsWith('@') ? functions[Number(p.slice(1))]! : p));

  const lengths: number[] = [];
  const others: string[] = [];
  for (const part of parts) {
    // A bare number is a length; `0` is legal and unitless.
    if (/^-?\d*\.?\d+(px|em|rem|%)?$/.test(part)) lengths.push(parseFloat(part));
    else others.push(part);
  }
  if (lengths.length < 2) return null;

  return {
    x: lengths[0] ?? 0,
    y: lengths[1] ?? 0,
    blur: lengths[2] ?? 0,
    spread: lengths[3] ?? 0,
    colour: others[0] ?? 'rgba(0, 0, 0, 0.2)',
    inset,
  };
}

/** Every layer of a computed `box-shadow`, outermost first as written. */
export function parseShadows(value: string): Shadow[] {
  if (!value || value.trim() === 'none') return [];
  return splitTopLevel(value, ',')
    .map(parseShadow)
    .filter((s): s is Shadow => s !== null);
}

/** One layer, in the order every stylesheet writes it. */
export function formatShadow(s: Shadow): string {
  const body = `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.colour}`;
  return s.inset ? `inset ${body}` : body;
}

/**
 * The stack, as a value.
 *
 * An empty stack is `none` rather than an empty string: an empty string removes
 * the declaration and lets whatever the stylesheet said come back, which is not
 * what "I deleted every layer" means.
 */
export function formatShadows(shadows: readonly Shadow[]): string {
  return shadows.length === 0 ? 'none' : shadows.map(formatShadow).join(', ');
}

/** Move a layer, for reordering. Out-of-range indices are left alone. */
export function moveLayer<T>(list: readonly T[], from: number, to: number): T[] {
  const out = [...list];
  if (from < 0 || from >= out.length || to < 0 || to >= out.length) return out;
  const [item] = out.splice(from, 1);
  if (item !== undefined) out.splice(to, 0, item);
  return out;
}

// ── backdrop-filter ─────────────────────────────────────────────────────────

/**
 * The blur radius out of a `backdrop-filter`.
 *
 * Only blur, and only `backdrop-filter`. `filter` is excluded from the panel
 * on purpose: on an ancestor it creates a containing block and changes how
 * `fixed` children position, so the tool would be able to move things by
 * editing a property that does not look like it moves anything.
 * `backdrop-filter` creates no containing block, so the objection does not
 * reach it — and it is how every glass surface is built.
 */
export function parseBackdropBlur(value: string): number {
  const m = /blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(value || '');
  return m ? parseFloat(m[1]!) : 0;
}

/**
 * Zero means none, not `blur(0px)`.
 *
 * `blur(0px)` still promotes the element to its own compositing layer and still
 * costs what a backdrop filter costs. A control returning to zero has to
 * actually remove the effect, or the panel leaves behind a performance
 * characteristic the page never had.
 */
export function formatBackdropBlur(px: number): string {
  return px <= 0 ? 'none' : `blur(${px}px)`;
}

// ── Which edge a shadow lands on ────────────────────────────────────────────

export type Edge = 'top' | 'right' | 'bottom' | 'left';
/** `all` is the ordinary four-sided shadow, and the absence of confinement. */
export type Side = Edge | 'all';

/**
 * `box-shadow` has no side. It draws the whole box, always.
 *
 * A one-sided shadow is a shape trick, not a property: shrink the shadow with
 * a negative spread until three of its edges hide behind the element, then
 * push it out from under one of them with the offset. Every tool that offers
 * "shadow on the bottom" is doing this; it is just usually done by hand, from
 * a recipe copied off a blog, and the numbers are chosen by nudging.
 *
 * The geometry is exact, so the panel can do the arithmetic instead.
 *
 * With the element at `[0, W] x [0, H]`, a spread of `-m` insets the shadow
 * rect by `m` on all four sides; the offset moves it by `(x, y)`; the blur
 * then reaches `r = blur / 2` further out in every direction — that is what
 * the blur radius means, a transition centred on the shadow's own edge.
 *
 * So the shadow shows past the element's right edge when `x > m - r`, past the
 * left when `x < r - m`, and the same pair vertically. Writing `t = m - r` for
 * the slack, it escapes on the right when `x > t`, on the left when `x < -t`,
 * below when `y > t` and above when `y < -t`.
 *
 * Which makes the rest fall out: a negative `t` escapes on all four sides at
 * once, so `m` must be at least `r` before a side can mean anything.
 */
function slack(s: Shadow): number {
  return -s.spread - s.blur / 2;
}

/**
 * Which edge this shadow actually shows on, derived rather than remembered.
 *
 * Derived, because the four numbers are editable on their own. A side stored
 * as its own field would be a fifth piece of state that the first drag of the
 * y slider makes a lie, and the panel would then be reporting a shadow that
 * is not the one on the page.
 */
export function sideOf(s: Shadow): Side {
  const t = slack(s);
  const escapes: Edge[] = [];
  if (s.y < -t) escapes.push('top');
  if (s.x > t) escapes.push('right');
  if (s.y > t) escapes.push('bottom');
  if (s.x < -t) escapes.push('left');
  // None at all is a shadow hidden entirely behind its element. It is not
  // confined to a side, it is invisible, and saying `all` is the honest answer
  // because that is the state every slider is free to move out of.
  return escapes.length === 1 ? escapes[0]! : 'all';
}

/**
 * Put a shadow on one edge, keeping as much of it as the geometry allows.
 *
 * The spread is set to the smallest magnitude that can hide three edges, which
 * is half the blur. Tightening it further would only eat into the shadow.
 */
export function confineToSide(s: Shadow, side: Side): Shadow {
  if (side === 'all') {
    // Not "spread zero" as a value judgement — a negative spread is the only
    // thing holding the other three sides back, so releasing it is what
    // returning to four sides means.
    return { ...s, spread: Math.max(0, s.spread) };
  }
  const m = Math.ceil(s.blur / 2);
  const t = m - s.blur / 2;
  /*
   * Far enough out to clear the slack. The existing offset is kept when it
   * already does, so switching sides on a shadow you have tuned moves it round
   * rather than resetting how far it sits. A blur of zero leaves no slack at
   * all, and 1px is then the smallest visible answer.
   */
  let d = Math.max(Math.abs(s.x), Math.abs(s.y));
  if (d <= t) d = t + Math.max(1, Math.round(s.blur / 2));
  const spread = -m;
  switch (side) {
    case 'top': return { ...s, x: 0, y: -d, spread };
    case 'bottom': return { ...s, x: 0, y: d, spread };
    case 'left': return { ...s, x: -d, y: 0, spread };
    case 'right': return { ...s, x: d, y: 0, spread };
  }
}

/**
 * The same confinement, said the way it actually is.
 *
 * Four sides is one too many ideas. Top and bottom are not two settings, they
 * are one axis and the sign of `y`; left and right are the same for `x`. A
 * panel offering all four asks you to choose something you have already
 * chosen, and then disagrees with the slider when you drag it past zero.
 *
 * So the choice is the axis, and the direction stays where it was always
 * legible: on the offset itself. Drag `y` negative and the shadow is above the
 * element, because that is what a negative `y` means everywhere else in CSS.
 */
export type Axis = 'x' | 'y';
export type Confine = Axis | 'all';

/** Which axis this shadow is confined to, derived like `sideOf` is. */
export function axisOf(s: Shadow): Confine {
  const side = sideOf(s);
  if (side === 'all') return 'all';
  return side === 'top' || side === 'bottom' ? 'y' : 'x';
}

export function confineToAxis(s: Shadow, axis: Confine): Shadow {
  if (axis === 'all') return confineToSide(s, 'all');
  /*
   * The direction it already leans is kept. Switching axis on a shadow sitting
   * above its element should move it to the side, not quietly drop it below —
   * and a shadow with no lean yet gets down and right, which is where light
   * comes from in every interface anyone has built.
   */
  if (axis === 'y') return confineToSide(s, s.y < 0 ? 'top' : 'bottom');
  return confineToSide(s, s.x < 0 ? 'left' : 'right');
}
