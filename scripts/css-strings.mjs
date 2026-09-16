/**
 * Strip the comments out of the CSS that ships inside template literals.
 *
 * Every stylesheet in the tool is a template literal handed to a <style>, and
 * those stylesheets are written with the reasoning in them — which is right for
 * the source and wrong for the bundle. A minifier removes JavaScript comments,
 * but a CSS comment inside a string is part of the string's value, so esbuild
 * is obliged to keep it. Measured before this existed: 19.7KB of comments,
 * 12% of the whole bundle, shipped to every page the tool loads on.
 *
 * Only template literals are touched, found by parsing rather than by pattern:
 * a regex over the file would pair the escaped backticks in a Markdown builder
 * with the wrong ends, and could reach into a regex literal or a string. The
 * parser is rolldown's, which Vite already installs; TypeScript 7 no longer
 * ships a JavaScript compiler API to do this with.
 *
 * Two things about its spans, both measured against all 845 template chunks in
 * the source before this was trusted: each chunk's span includes its own
 * delimiters (the backtick, `${`, `}`), and offsets are string offsets rather
 * than UTF-8 bytes, so the em dashes in the comments do not shift anything.
 *
 * Only CSS is rewritten: a literal whose text contains a declaration block.
 * The code inside `${}` is never part of a chunk, so it is never touched.
 */
import { readFile } from 'node:fs/promises';
import { parseAst } from 'rolldown/parseAst';

const COMMENT = /\/\*[\s\S]*?\*\//g;

/** Looks like a stylesheet: a brace, a property, a semicolon. */
const looksLikeCss = (text) => /\{[^{}]*:[^{}]*;/.test(text);

function squeeze(css) {
  return css
    .replace(COMMENT, '')
    // Whitespace runs are one space to CSS, and nothing this tool writes has
    // quoted content where two spaces differ from one.
    .replace(/\s+/g, ' ');
}

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node);
  for (const key in node) {
    const value = node[key];
    if (Array.isArray(value)) for (const child of value) walk(child, visit);
    else if (value && typeof value === 'object') walk(value, visit);
  }
}

/** The text of one chunk, between its delimiters. */
const inner = (q) => [q.start + 1, q.end - (q.tail ? 1 : 2)];

export function stripCssComments(source, fileName = 'file.ts') {
  if (!source.includes('`')) return source;
  const ast = parseAst(source, { lang: 'ts' });
  const edits = [];

  walk(ast, (node) => {
    if (node.type !== 'TemplateLiteral') return;
    const spans = node.quasis.map(inner);
    const text = spans.map(([a, b]) => source.slice(a, b)).join('');
    if (looksLikeCss(text)) edits.push(...spans);
  });
  if (edits.length === 0) return source;

  let out = source;
  // From the end, so earlier offsets stay valid as later text shrinks.
  for (const [a, b] of edits.sort((x, y) => y[0] - x[0])) {
    const raw = out.slice(a, b);
    /*
     * A comment that starts in one chunk and ends in the next would wrap an
     * interpolation, and stripping chunk by chunk would leave half of it
     * behind as broken CSS. None do. If one ever does, fail the build rather
     * than ship a stylesheet with a dangling comment in it.
     */
    const opens = (raw.match(/\/\*/g) ?? []).length;
    const closes = (raw.match(/\*\//g) ?? []).length;
    if (opens !== closes) {
      throw new Error(`${fileName}: a CSS comment spans an interpolation near offset ${a}`);
    }
    out = out.slice(0, a) + squeeze(raw) + out.slice(b);
  }
  return out;
}

/** The esbuild plugin: the tool's own TypeScript, with its stylesheets squeezed. */
export const cssStrings = {
  name: 'css-strings',
  setup(build) {
    build.onLoad({ filter: /[\\/]align[\\/][^\\/]+\.ts$/ }, async (args) => {
      const source = await readFile(args.path, 'utf8');
      return { contents: stripCssComments(source, args.path), loader: 'ts' };
    });
  },
};
