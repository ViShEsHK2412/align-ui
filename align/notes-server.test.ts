import { mkdtempSync, readFileSync, readdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isPng, NOTE_FILE, noteFileName, notesMiddleware, NOTES_ROUTE } from './notes-server';

/**
 * The endpoint writes files on request, so it is tested the way it would be
 * attacked: wrong types, wrong names, wrong origins, too much data. A real
 * temporary directory rather than a mocked filesystem, because what matters is
 * what actually lands on disk.
 */

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

function request(method: string, url: string, body?: Uint8Array, headers: Record<string, string> = {}) {
  const listeners: Record<string, ((arg?: unknown) => void)[]> = {};
  const req = {
    method, url, headers,
    on(event: string, cb: (arg?: unknown) => void) {
      (listeners[event] ??= []).push(cb);
      return req;
    },
    destroy() { /* nothing to tear down */ },
  };
  const res = {
    statusCode: 0,
    body: '',
    setHeader() { /* ignored */ },
    end(b?: string) { this.body = b ?? ''; },
  };
  const flush = () => {
    if (body) for (const cb of listeners['data'] ?? []) cb(body);
    for (const cb of listeners['end'] ?? []) cb();
  };
  return { req, res, flush };
}

async function call(root: string, method: string, url: string, body?: Uint8Array, headers?: Record<string, string>) {
  const { req, res, flush } = request(method, url, body, headers);
  let nexted = false;
  // A fake is narrower than Node's request; the cast is the fake's, not the code's.
  const done = notesMiddleware(root)(req as never, res, () => { nexted = true; });
  // Body listeners attach synchronously inside the handler; feed them after.
  await Promise.resolve();
  flush();
  await done;
  return { status: res.statusCode, json: res.body ? JSON.parse(res.body) : null, nexted };
}

let root = '';
beforeEach(() => { root = mkdtempSync(join(tmpdir(), 'align-notes-')); });
afterEach(() => { rmSync(root, { recursive: true, force: true }); });

describe('notesMiddleware', () => {
  it('passes every other route through untouched', async () => {
    const r = await call(root, 'GET', '/src/main.ts');
    expect(r.nexted).toBe(true);
    expect(existsSync(join(root, '.align'))).toBe(false);
  });

  it('answers the probe', async () => {
    const r = await call(root, 'GET', NOTES_ROUTE);
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ ok: true });
  });

  it('writes a PNG inside the project and returns its absolute path', async () => {
    const r = await call(root, 'POST', NOTES_ROUTE, PNG);
    expect(r.status).toBe(201);
    expect(r.json.file).toMatch(NOTE_FILE);
    expect(r.json.path).toBe(join(root, '.align', 'notes', r.json.file));
    expect(Array.from(readFileSync(r.json.path))).toEqual(Array.from(PNG));
  });

  it('keeps the folder out of git without touching the project\'s own ignore file', async () => {
    await call(root, 'POST', NOTES_ROUTE, PNG);
    expect(readFileSync(join(root, '.align', '.gitignore'), 'utf8')).toMatch(/^\*$/m);
    expect(existsSync(join(root, '.gitignore'))).toBe(false);
  });

  it('refuses anything that is not a PNG, whatever it claims', async () => {
    const html = new TextEncoder().encode('<script>alert(1)</script>');
    const r = await call(root, 'POST', NOTES_ROUTE, html, { 'content-type': 'image/png' });
    expect(r.status).toBe(415);
    expect(existsSync(join(root, '.align', 'notes'))).toBe(false);
  });

  it('refuses a cross-site request', async () => {
    const r = await call(root, 'POST', NOTES_ROUTE, PNG, { 'sec-fetch-site': 'cross-site' });
    expect(r.status).toBe(403);
    expect(existsSync(join(root, '.align'))).toBe(false);
  });

  it('ignores any name or path the request tries to supply', async () => {
    const r = await call(root, 'POST', `${NOTES_ROUTE}/../../evil.png`, PNG);
    expect(r.status).not.toBe(201);
    expect(existsSync(join(root, 'evil.png'))).toBe(false);
  });

  it('deletes a file it wrote', async () => {
    const made = await call(root, 'POST', NOTES_ROUTE, PNG);
    const r = await call(root, 'DELETE', `${NOTES_ROUTE}/${made.json.file}`);
    expect(r.status).toBe(204);
    expect(readdirSync(join(root, '.align', 'notes'))).toEqual([]);
  });

  it('serves back a screenshot it wrote, and only those', async () => {
    const made = await call(root, 'POST', NOTES_ROUTE, PNG);
    const { req, res, flush } = request('GET', `${NOTES_ROUTE}/${made.json.file}`);
    let sent: unknown = null;
    res.end = (b?: unknown) => { sent = b; };
    const done = notesMiddleware(root)(req as never, res as never, () => {});
    flush();
    await done;
    expect(res.statusCode).toBe(200);
    expect(Array.from(sent as Uint8Array)).toEqual(Array.from(PNG));

    writeFileSync(join(root, 'secret.txt'), 'x');
    for (const bad of ['../../secret.txt', 'secret.txt', '..%2F..%2Fsecret.txt']) {
      expect((await call(root, 'GET', `${NOTES_ROUTE}/${bad}`)).status).toBe(400);
    }
    expect((await call(root, 'GET', `${NOTES_ROUTE}/${noteFileName()}`)).status).toBe(404);
  });

  it('treats deleting a file that is already gone as done', async () => {
    const r = await call(root, 'DELETE', `${NOTES_ROUTE}/${noteFileName()}`);
    expect(r.status).toBe(204);
  });

  it('will not delete anything it did not name', async () => {
    writeFileSync(join(root, 'package.json'), '{}');
    for (const bad of ['../../package.json', '..%2F..%2Fpackage.json', 'note-1.png', 'x.png']) {
      const r = await call(root, 'DELETE', `${NOTES_ROUTE}/${bad}`);
      expect(r.status).toBe(400);
    }
    expect(existsSync(join(root, 'package.json'))).toBe(true);
  });
});

describe('the pieces', () => {
  it('recognises a PNG by its signature', () => {
    expect(isPng(PNG)).toBe(true);
    expect(isPng(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0]))).toBe(false);
    expect(isPng(PNG.slice(0, 8))).toBe(false);
  });

  it('makes names that sort by time and match the delete pattern', () => {
    const a = noteFileName(1_700_000_000_000, 'deadbeef');
    expect(a).toBe('note-1700000000000-deadbeef.png');
    expect(NOTE_FILE.test(a)).toBe(true);
    expect(noteFileName(1, '00000000') < noteFileName(2, '00000000')).toBe(true);
  });
});
