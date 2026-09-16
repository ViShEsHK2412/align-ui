import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';

/**
 * The dev-server half of notes: take a screenshot from the page, put it on
 * disk inside the project, and say where.
 *
 * A page can save a file only by downloading it, and it is never told where
 * the download went — so a pasted note could name a file but not find it. A
 * dev server can write wherever it likes and knows the absolute path it wrote
 * to, which is what makes "open this path" work for the agent reading the
 * paste. That is the whole reason this exists.
 *
 * It writes files on request, so it is written like it does:
 *
 * - The name is chosen here, never taken from the request. Nothing a page
 *   sends can steer where a file lands.
 * - Only PNGs, checked by their signature rather than by what the request
 *   claims, and only up to a size a screenshot can reasonably be.
 * - Cross-site requests are refused. A dev server reachable on the network
 *   (`--host`) is visitable by any page in a browser on that network, and
 *   `Sec-Fetch-Site` is set by the browser, not by the page, so it cannot be
 *   forged from one.
 * - Deletes take a name that matches the pattern names are made with, so a
 *   delete can only ever reach a file this wrote.
 *
 * No dependencies and no Vite types, so the same function mounts in any
 * Connect-style server.
 */

export const NOTES_ROUTE = '/__align/notes';

/** 20MB. A full 4K screen as PNG is well under this; anything larger is not a screenshot. */
const MAX_BYTES = 20 * 1024 * 1024;

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** The only names this ever writes, and so the only ones it will delete. */
export const NOTE_FILE = /^note-\d{13}-[0-9a-f]{8}\.png$/;

export function isPng(bytes: Uint8Array): boolean {
  return bytes.length > PNG_SIGNATURE.length
    && PNG_SIGNATURE.every((b, i) => bytes[i] === b);
}

export function noteFileName(now = Date.now(), rand = randomBytes(4).toString('hex')): string {
  return `note-${String(now).padStart(13, '0')}-${rand}.png`;
}

/** The subset of Node's request and response this touches. */
interface Req {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  on(event: 'data', cb: (chunk: Uint8Array) => void): unknown;
  on(event: 'end' | 'error', cb: (err?: unknown) => void): unknown;
  destroy(): void;
}
interface Res {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string | Uint8Array): void;
}

function send(res: Res, status: number, body?: unknown): void {
  res.statusCode = status;
  if (body === undefined) { res.end(); return; }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function header(req: Req, name: string): string {
  const v = req.headers[name];
  return (Array.isArray(v) ? v[0] : v) ?? '';
}

function readBody(req: Req): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    let size = 0;
    req.on('data', (chunk: Uint8Array) => {
      size += chunk.length;
      if (size > MAX_BYTES) {
        req.destroy();
        resolve(null);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const out = new Uint8Array(size);
      let at = 0;
      for (const c of chunks) { out.set(c, at); at += c.length; }
      resolve(out);
    });
    req.on('error', reject);
  });
}

/**
 * `.align/notes/`, with a `.gitignore` that ignores the folder's own contents.
 *
 * Screenshots of work in progress have no business in a commit, and asking
 * every project that installs this to edit its own ignore file would mean most
 * of them forget. A `*` inside the folder keeps it out of git on its own.
 */
async function notesDir(root: string): Promise<string> {
  const base = join(root, '.align');
  const dir = join(base, 'notes');
  await mkdir(dir, { recursive: true });
  const ignore = join(base, '.gitignore');
  if (!existsSync(ignore)) {
    await writeFile(ignore, '# Written by align-ui. Screenshots from notes stay local.\n*\n');
  }
  return dir;
}

export type Next = (err?: unknown) => void;

export function notesMiddleware(root: string) {
  return async function handle(req: Req, res: Res, next: Next): Promise<void> {
    const url = (req.url ?? '').split('?')[0] ?? '';
    if (url !== NOTES_ROUTE && !url.startsWith(NOTES_ROUTE + '/')) { next(); return; }

    try {
      if (header(req, 'sec-fetch-site') === 'cross-site') {
        send(res, 403, { error: 'cross-site' });
        return;
      }

      // A probe, so the page can tell a served endpoint from a 404 page.
      if (req.method === 'GET' && url === NOTES_ROUTE) {
        send(res, 200, { ok: true });
        return;
      }

      if (req.method === 'POST' && url === NOTES_ROUTE) {
        const body = await readBody(req);
        if (!body) { send(res, 413, { error: 'too large' }); return; }
        if (!isPng(body)) { send(res, 415, { error: 'not a png' }); return; }
        const dir = await notesDir(root);
        const file = noteFileName();
        const path = join(dir, file);
        await writeFile(path, body);
        send(res, 201, { file, path });
        return;
      }

      /*
       * A screenshot it wrote, served back so a note opened for editing can
       * show its picture. The same name pattern as delete, so it can only ever
       * hand out a file this middleware made.
       */
      if (req.method === 'GET' && url.startsWith(NOTES_ROUTE + '/')) {
        const file = decodeURIComponent(url.slice(NOTES_ROUTE.length + 1));
        if (!NOTE_FILE.test(file)) { send(res, 400, { error: 'bad name' }); return; }
        let bytes: Uint8Array;
        try {
          bytes = await readFile(join(root, '.align', 'notes', file));
        } catch {
          send(res, 404, { error: 'gone' });
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-store');
        res.end(bytes);
        return;
      }

      if (req.method === 'DELETE' && url.startsWith(NOTES_ROUTE + '/')) {
        const file = decodeURIComponent(url.slice(NOTES_ROUTE.length + 1));
        if (!NOTE_FILE.test(file)) { send(res, 400, { error: 'bad name' }); return; }
        try {
          await unlink(join(root, '.align', 'notes', file));
        } catch (err) {
          // Already gone is the outcome that was asked for.
          if ((err as { code?: string }).code !== 'ENOENT') throw err;
        }
        send(res, 204);
        return;
      }

      send(res, 405, { error: 'method' });
    } catch (err) {
      send(res, 500, { error: err instanceof Error ? err.message : 'failed' });
    }
  };
}
