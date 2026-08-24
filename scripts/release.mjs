/**
 * Cut a release: rebuild, bump the version, tag it, push.
 *
 * The tool is installed straight from git, and a git dependency has no
 * registry to publish to — the tag *is* the release. npm records the commit it
 * resolved in the consumer's lockfile and, on a later `npm install`, considers
 * that entry to satisfy the request and leaves it alone. Only `npm update
 * align-ui` re-resolves, so a version that actually moves is what lets anyone
 * see which build they are on and confirm the update landed.
 *
 *   node scripts/release.mjs            patch: 0.1.0 -> 0.1.1
 *   node scripts/release.mjs minor      0.1.0 -> 0.2.0
 *   node scripts/release.mjs major      0.1.0 -> 1.0.0
 *   node scripts/release.mjs 1.4.2      exactly that
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const run = (cmd, args) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();

const die = (message) => { console.error(`release: ${message}`); process.exit(1); };

// Anything uncommitted would be swept into the release commit below, so the
// tree has to be clean before we start. dist is the one exception: the build
// rewrites it, and committing that is the point.
const dirty = run('git', ['status', '--porcelain'])
  .split('\n')
  .filter((line) => line && !line.slice(3).startsWith('dist/'));
if (dirty.length) die(`commit your work first:\n  ${dirty.join('\n  ')}`);

const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
if (branch !== 'main') die(`releases come off main, not ${branch}`);

console.log('release: building');
run('npm', ['run', 'build']);

const pkgPath = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);

const bump = process.argv[2] ?? 'patch';
const next =
  bump === 'major' ? `${major + 1}.0.0`
  : bump === 'minor' ? `${major}.${minor + 1}.0`
  : bump === 'patch' ? `${major}.${minor}.${patch + 1}`
  : /^\d+\.\d+\.\d+$/.test(bump) ? bump
  : die(`not a version or a bump: ${bump}`);

pkg.version = next;
// Trailing newline, so the file stays byte-identical to what npm itself writes.
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

run('git', ['add', 'package.json', 'dist']);
run('git', ['commit', '-m', `chore: release v${next}`]);
run('git', ['tag', '-a', `v${next}`, '-m', `v${next}`]);
run('git', ['push', '--follow-tags', 'origin', 'main']);

console.log(`release: v${next} pushed`);
console.log('consumers pick it up with:  npm update align-ui');
