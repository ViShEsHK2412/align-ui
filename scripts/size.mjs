/**
 * The size budget.
 *
 * Two numbers, because they answer different questions. Gzipped is what
 * actually crosses the wire and is the one that matters; raw is what the
 * browser parses, and it catches a bundle that has swollen in a way gzip
 * happens to flatten.
 *
 * The budget moved for edit mode. It was 110KB raw, set when the tool only
 * measured, and the edit panel — the controls, the OKLCH colour picker, the
 * slider and the scrub badges — is about half the bundle on its own. A budget
 * is there to catch accidental growth, so it is set with roughly 10% headroom
 * over a build that was inspected module by module and found to be all
 * feature. Raising it to whatever today's build happens to weigh would make it
 * decorative; leaving it where it was would make every commit red.
 *
 * If this fails, look at the per-module breakdown before changing the number:
 *
 *   npx esbuild align/index.ts --bundle --format=esm --minify \
 *     --outfile=/dev/null --analyze
 */
import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const RAW_MAX = 155 * 1024;
const GZIP_MAX = 53 * 1024;

const FILE = 'dist/align.js';

const raw = statSync(FILE).size;
const gzip = gzipSync(readFileSync(FILE)).length;

const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
const line = (label, value, max) => {
  const over = value > max;
  const pct = ((value / max) * 100).toFixed(0);
  return `  ${label.padEnd(8)}${kb(value).padStart(8)}  of ${kb(max).padStart(7)}`
    + `  ${pct.padStart(3)}%  ${over ? 'OVER' : 'ok'}`;
};

console.log(FILE);
console.log(line('gzipped', gzip, GZIP_MAX));
console.log(line('raw', raw, RAW_MAX));

if (gzip > GZIP_MAX || raw > RAW_MAX) {
  console.error('\nsize: over budget. Check what grew before raising the number.');
  process.exit(1);
}
