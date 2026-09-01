/**
 * Reading a element's type, and checking its numbers against the design tokens
 * that are actually in scope.
 *
 * The arithmetic here is pure so it can be tested; only `typographyOf` and
 * `tokensInScope` touch the DOM, and each is one `getComputedStyle` call.
 */

/** One line of the typography readout. */
export interface TypeRow {
  label: string;
  value: string;
  /** The number behind the value, for token matching. NaN when there isn't one. */
  px: number;
}

/** A custom property in scope, resolved to its value. */
export interface Token {
  name: string;
  value: string;
  px: number;
}

/** `16px` → 16. Anything without a number → NaN. */
function px(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : NaN;
}

/** `"Inter", sans-serif` → `Inter`. The rest is the fallback chain. */
export function firstFamily(stack: string): string {
  const first = stack.split(',')[0] ?? '';
  return first.trim().replace(/^['"]|['"]$/g, '');
}

/** 400 → `400 regular`, so the number and the name are both there. */
export function weightName(weight: string): string {
  const names: Record<string, string> = {
    100: 'thin', 200: 'extralight', 300: 'light', 400: 'regular',
    500: 'medium', 600: 'semibold', 700: 'bold', 800: 'extrabold', 900: 'black',
  };
  const name = names[weight.trim()];
  return name ? `${weight} ${name}` : weight;
}

/**
 * The type of an element, as rows.
 *
 * Computed values arrive resolved, so `line-height: 1.5` on 16px text reads as
 * 24px — which is the number you would measure, and the reason this belongs in
 * a measuring tool at all. `normal` survives as a keyword on both line-height
 * and letter-spacing, so neither can be blindly parsed.
 */
export function typographyOf(el: Element): TypeRow[] {
  const cs = getComputedStyle(el);
  return [
    { label: 'family', value: firstFamily(cs.fontFamily), px: NaN },
    { label: 'size', value: cs.fontSize, px: px(cs.fontSize) },
    { label: 'weight', value: weightName(cs.fontWeight), px: NaN },
    { label: 'line', value: cs.lineHeight, px: px(cs.lineHeight) },
    { label: 'tracking', value: cs.letterSpacing, px: px(cs.letterSpacing) },
  ];
}

/** The text an element holds itself, ignoring anything its children hold. */
export function ownText(el: Element): string {
  let out = '';
  for (const node of el.childNodes) {
    if (node.nodeType === 3) out += node.nodeValue ?? '';
  }
  return out.trim().replace(/\s+/g, ' ');
}

/**
 * Every custom property visible from this element, resolved.
 *
 * Computed style enumerates custom properties, inherited ones included — a
 * token declared on `:root` is readable from a div ten levels down, which is
 * exactly the set a design system defines.
 */
export function tokensInScope(el: Element): Token[] {
  const cs = getComputedStyle(el);
  const out: Token[] = [];
  for (const name of Array.from(cs)) {
    if (!name.startsWith('--')) continue;
    const value = cs.getPropertyValue(name).trim();
    out.push({ name, value, px: px(value) });
  }
  return out;
}

/**
 * Which tokens hold this exact number.
 *
 * This compares values. It does not claim the number *came from* the token —
 * a hardcoded `padding: 16px` matches `--space-4` just as well as one that
 * uses it. That is why the readout says *matches*, and why it is worth having:
 * a hardcoded value sitting exactly on the scale is one you probably meant to
 * write as the token.
 */
export function matchTokens(value: number, tokens: Token[]): string[] {
  if (!Number.isFinite(value)) return [];
  return tokens
    .filter((t) => t.value.endsWith('px') && Math.abs(t.px - value) < 0.01)
    .map((t) => t.name)
    // Computed style hands these back in its own order; sorted so the same
    // element reads the same way twice.
    .sort();
}

/**
 * The distinct numbers an element is built from, in the order you would read
 * them. Zero is dropped: every box has zeros and none of them are decisions.
 */
export function distinctValues(nums: number[]): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const n of nums) {
    if (!Number.isFinite(n) || n === 0 || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

/**
 * One line summarising which of an element's numbers are on the token scale.
 * A number with no match is the interesting one, so it is named rather than
 * dropped.
 */
export function tokenSummary(values: number[], tokens: Token[]): string {
  if (tokens.length === 0) return '';
  return distinctValues(values)
    .map((n) => {
      const hit = matchTokens(n, tokens);
      return hit.length ? `${n} ${hit.join(' ')}` : `${n} —`;
    })
    .join('  ·  ');
}

/** Where a measured gap between two siblings actually came from. */
export interface GapFact {
  px: number;
  /** The parent's CSS gap on that axis, or null when the parent sets none. */
  cssGap: number | null;
  /** The two facing margins, added. */
  margins: number;
  /** Provenance only means anything between siblings. */
  siblings: boolean;
}

/** The four margins of an element, top right bottom left. */
function margins(el: Element): number[] {
  const cs = getComputedStyle(el);
  return [cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft].map(px);
}

/**
 * Account for a gap: how much of it is the parent's `gap`, how much is the two
 * facing margins.
 *
 * This is the question a bare number leaves open. Twenty-four pixels between
 * two cards is a different problem depending on whether it came from a flex
 * `gap`, from margins, or from both at once, and knowing which is the
 * difference between a measurement you have to go investigate and one you can
 * act on.
 */
export function gapFactOf(a: Element, b: Element, gap: number, axis: 'x' | 'y'): GapFact {
  const parent = a.parentElement;
  const siblings = parent !== null && b.parentElement === parent;
  if (!parent || !siblings) return { px: gap, cssGap: null, margins: 0, siblings: false };

  const pcs = getComputedStyle(parent);
  const laidOut = pcs.display.includes('flex') || pcs.display.includes('grid');
  const raw = axis === 'x' ? pcs.columnGap : pcs.rowGap;
  const cssGap = laidOut && raw !== 'normal' ? px(raw) : null;

  // The margins that actually face each other across the gap.
  const [aTop, aRight, aBottom, aLeft] = margins(a);
  const [bTop, bRight, bBottom, bLeft] = margins(b);
  const n = (v: number) => (Number.isFinite(v) ? v : 0);
  const aFirst = axis === 'x'
    ? a.getBoundingClientRect().left < b.getBoundingClientRect().left
    : a.getBoundingClientRect().top < b.getBoundingClientRect().top;
  const facing = axis === 'x'
    ? (aFirst ? n(aRight!) + n(bLeft!) : n(bRight!) + n(aLeft!))
    : (aFirst ? n(aBottom!) + n(bTop!) : n(bBottom!) + n(aTop!));

  return { px: gap, cssGap, margins: facing, siblings: true };
}

/**
 * A gap fact as one line. Pure.
 *
 * When the parts do not add up to the measurement the remainder is named
 * rather than hidden — that is `justify-content`, an auto margin, or a
 * float, and a reader who sees `gap 0 · margins 0` on a 24px space would
 * otherwise conclude the tool is broken.
 */
export function describeGap(f: GapFact): string {
  if (!f.siblings) return 'not siblings';
  const parts: string[] = [];
  if (f.cssGap !== null) parts.push(`gap ${f.cssGap}`);
  if (f.margins !== 0 || f.cssGap === null) parts.push(`margins ${f.margins}`);
  const accounted = (f.cssGap ?? 0) + f.margins;
  if (Math.abs(accounted - f.px) > 0.5) parts.push('rest from layout');
  return parts.join(' · ');
}

/**
 * How many gaps came out at each size, commonest first: `24 ×3 · 18 ×1`.
 *
 * The distribution is a fact. GuideFrame appends a verdict — "inconsistent" —
 * and that is the judgement this tool deliberately does not make.
 */
export function gapDistribution(values: number[]): string {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  if (counts.size < 2) return '';
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([value, n]) => `${value} ×${n}`)
    .join(' · ');
}
