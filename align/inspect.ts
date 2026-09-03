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

// ── Colour ──────────────────────────────────────────────────────────────────

/**
 * Does this look like a colour, before we ask the browser to parse it?
 *
 * A cheap syntactic filter, so a scale of eighty tokens is not eighty canvas
 * round-trips. Pure, and wrong only in the safe direction: anything it lets
 * through is still verified by the parser below.
 */
export function looksLikeColour(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (!v) return false;
  if (v.startsWith('#')) return true;
  if (/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(v)) return true;
  // Named colours are a closed set, but only the ones a design token would
  // plausibly hold are worth carrying.
  return ['black', 'white', 'transparent', 'currentcolor'].includes(v);
}

/**
 * One canvas, reused, as a colour parser.
 *
 * `fillStyle` accepts every colour syntax the browser does and hands back a
 * canonical form, so `#6ea8fe`, `rgb(110 168 254)` and the oklch that resolves
 * to the same place all compare equal. It is also the only parser guaranteed to
 * agree with the one that painted the page.
 */
let parser: CanvasRenderingContext2D | null | undefined;

function canonicalColour(value: string): string {
  if (parser === undefined) parser = document.createElement('canvas').getContext('2d');
  if (!parser) return '';
  // An unparseable value leaves fillStyle untouched, so two different sentinels
  // are what tells "it parsed" apart from "it was ignored".
  parser.fillStyle = '#000000';
  parser.fillStyle = value;
  const first = parser.fillStyle;
  parser.fillStyle = '#ffffff';
  parser.fillStyle = value;
  return first === parser.fillStyle ? String(first) : '';
}

/**
 * Which tokens hold this colour.
 *
 * The same *matches, never from* rule as the numbers: this compares resolved
 * colours, so a hardcoded `#6ea8fe` matches `--brand` exactly as well as one
 * that uses it. That is the point — an agent writing a colour one notch off
 * your brand blue is invisible by eye and obvious to a comparison.
 */
export function matchColourTokens(value: string, tokens: Token[]): string[] {
  const want = canonicalColour(value);
  if (!want) return [];
  return tokens
    .filter((t) => looksLikeColour(t.value) && canonicalColour(t.value) === want)
    .map((t) => t.name)
    .sort();
}

/** The colours an element actually paints with, skipping the invisible ones. */
export function coloursOf(el: Element): { label: string; value: string }[] {
  const cs = getComputedStyle(el);
  const out: { label: string; value: string }[] = [];
  const add = (label: string, raw: string) => {
    const v = raw.trim();
    // Fully transparent is not a colour decision, it is the absence of one.
    if (!v || v === 'transparent' || /rgba?\([^)]*,\s*0\s*\)$/.test(v)) return;
    out.push({ label, value: v });
  };
  add('text', cs.color);
  add('background', cs.backgroundColor);
  return out;
}

// ── How many others look like this one ──────────────────────────────────────

/**
 * A selector that finds this element's kind. Pure: the DOM reading is done by
 * the caller so the shape of the selector can be tested on its own.
 *
 * An id is unique by definition, so it short-circuits: counting how many
 * elements share an id answers a question nobody asked.
 */
export function buildSelector(tag: string, id: string, classes: string[]): string {
  const esc = (s: string) =>
    (typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(s) : s.replace(/[^\w-]/g, '\\$&'));
  if (id) return `#${esc(id)}`;
  if (classes.length) return tag + classes.map((c) => `.${esc(c)}`).join('');
  return tag;
}

export function selectorOf(el: Element): string {
  const classes = typeof el.className === 'string'
    ? el.className.trim().split(/\s+/).filter(Boolean)
    : [];
  return buildSelector(el.tagName.toLowerCase(), el.id, classes);
}

/**
 * How many elements on the page are built the same way.
 *
 * A number that is only interesting above one: it is the difference between a
 * value you can change locally and one that seven other places share. From
 * InterfaceKit, which shows it before you edit rather than after.
 */
export function similarCount(el: Element): number {
  try {
    return document.querySelectorAll(selectorOf(el)).length;
  } catch {
    return 0;          // a class name no selector can express
  }
}


// ── Where a style was set ───────────────────────────────────────────────────

/** A rule that matches the element and sets something we measure. */
export interface RuleSource {
  selector: string;
  /** The stylesheet, shortened to the part that identifies it. */
  file: string;
}

/**
 * `http://localhost:5173/src/styles/cards.css?t=1` -> `src/styles/cards.css`.
 *
 * A dev server serves CSS from its real path, so the tail of the URL is the
 * file you would open. The query is a cache-buster and never part of it. Pure.
 */
export function shortFile(href: string | null): string {
  if (!href) return 'inline <style>';
  const noQuery = href.split('?')[0] ?? href;
  try {
    const path = new URL(noQuery, 'http://x').pathname;
    // A pathname is percent-encoded, and a file with a space in its name is
    // meant to be read, not decoded by eye.
    return decodeURI(path).replace(/^\//, '') || noQuery;
  } catch {
    return noQuery;
  }
}

/** The properties worth tracing: the ones the panel puts a number on. */
const TRACKED = [
  'width', 'height', 'padding', 'margin', 'border-width', 'gap',
  'font-size', 'line-height', 'letter-spacing', 'color', 'background-color',
];

function setsSomethingTracked(style: CSSStyleDeclaration): boolean {
  for (let i = 0; i < style.length; i += 1) {
    const prop = style.item(i);
    if (TRACKED.some((t) => prop === t || prop.startsWith(`${t}-`))) return true;
  }
  return false;
}

/**
 * Every rule that matches this element and sets one of the things we measure.
 *
 * These are **candidates**, in document order, and deliberately not a verdict.
 * Naming the winning rule would mean re-implementing the cascade — specificity,
 * `!important`, source order, layers — which is what Mesurer does and what
 * `:is()`, `:where()`, `@layer` and `@scope` each break. A short list of places
 * to look is honest and is what you actually need.
 *
 * Cross-origin stylesheets throw on `.cssRules` and are skipped: their rules
 * are unreadable by design, not missing.
 */
export function stylingRules(el: Element): RuleSource[] {
  const out: RuleSource[] = [];
  const seen = new Set<string>();

  const walk = (rules: CSSRuleList, file: string) => {
    for (const rule of Array.from(rules)) {
      // A rule inside a media query that does not currently apply is not
      // styling anything, and listing it would send you to the wrong place.
      if (rule instanceof CSSMediaRule) {
        if (matchMedia(rule.conditionText).matches) walk(rule.cssRules, file);
        continue;
      }
      if (rule instanceof CSSSupportsRule) {
        if (CSS.supports(rule.conditionText)) walk(rule.cssRules, file);
        continue;
      }
      // @layer and anything else that simply groups.
      const grouping = (rule as CSSGroupingRule).cssRules;
      if (grouping && !(rule instanceof CSSStyleRule)) { walk(grouping, file); continue; }

      if (!(rule instanceof CSSStyleRule)) continue;
      let matches = false;
      try {
        matches = el.matches(rule.selectorText);
      } catch {
        continue;                     // a selector this browser cannot parse
      }
      if (!matches || !setsSomethingTracked(rule.style)) continue;

      const key = `${rule.selectorText}|${file}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ selector: rule.selectorText, file });
    }
  };

  for (const sheet of Array.from(document.styleSheets)) {
    if (sheet.ownerNode instanceof Element
        && sheet.ownerNode.hasAttribute('data-align-ignore')) continue;
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;                       // cross-origin, unreadable by design
    }
    walk(rules, shortFile(sheet.href));
  }

  // Later rules win more often than earlier ones, so the likeliest is first.
  return out.reverse();
}
