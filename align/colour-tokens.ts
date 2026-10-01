/**
 * The page's colour tokens, for the picker to offer.
 *
 * A picker that only knows hex hands back `#2563eb`, and a hardcoded colour is
 * how a palette erodes, one "close enough" at a time. Toolcraft's palette
 * control makes the same argument for a design system: pick the token, not the
 * value. The spacing lint already names tokens; the picker should offer them.
 *
 * Custom properties come back from getComputedStyle as written, so an alias
 * reads `var(--blue-600)`, not a colour. Aliases are followed, a few hops
 * deep, so `--primary` shows the blue it actually is. Pure: tokens in, tokens
 * out, with the parsing passed in so the rules can be tested without a DOM.
 */

export interface ColourToken {
  name: string;
  /** The colour it resolves to, as CSS. */
  value: string;
  /** The token it points at, when it is an alias. */
  via?: string;
}

const VAR = /^var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)$/;
/** Deep enough for primitive → semantic → component; short of any cycle. */
const MAX_HOPS = 6;

export function colourTokens(
  tokens: readonly { name: string; value: string }[],
  isColour: (value: string) => boolean,
): ColourToken[] {
  const byName = new Map(tokens.map((t) => [t.name, t.value.trim()]));
  const out: ColourToken[] = [];
  for (const t of tokens) {
    let value = t.value.trim();
    let via: string | undefined;
    for (let hop = 0; hop < MAX_HOPS; hop++) {
      const m = VAR.exec(value);
      if (!m) break;
      via ??= m[1]!;
      const next = byName.get(m[1]!);
      if (next === undefined) { value = ''; break; }
      value = next;
    }
    if (!value || VAR.test(value) || !isColour(value)) continue;
    out.push(via ? { name: t.name, value, via } : { name: t.name, value });
  }
  return out;
}

/** The token a written value names, if it is exactly `var(--x)`. */
export function tokenIn(value: string): string | null {
  return VAR.exec(value.trim())?.[1] ?? null;
}

/** Keep the tokens whose name contains every word typed, in order of the page. */
export function filterTokens(list: readonly ColourToken[], query: string): ColourToken[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [...list];
  return list.filter((t) => words.every((w) => t.name.toLowerCase().includes(w)));
}
