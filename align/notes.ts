/**
 * Notes: point at a piece of the page, say what is wrong with it, and hand the
 * whole batch to whoever fixes it in one paste.
 *
 * The loop this replaces is manual: take a screenshot in the operating system,
 * paste it into the agent, describe the fix, go back, repeat — one round trip
 * per problem. Agentation collapses the round trips into a single paste of
 * selectors and positions, but it copies no pictures, and a picture is most of
 * what "this looks wrong" means.
 *
 * The clipboard cannot carry several images and a block of text in one paste,
 * so the images go to disk and the paste carries their paths. A coding agent
 * opens an image path it is given, which makes a path as good as the picture
 * and a batch of them one paste instead of many.
 *
 * Everything here is pure: no DOM, no network, no storage. The capture, the
 * upload and the drawing live in their own modules, so the parts with an
 * exact right answer can be tested without a browser.
 */

import type { Quad } from './types';

/** A rectangle in page pixels: it stays on the same content as you scroll. */
export interface Rect { x: number; y: number; w: number; h: number }

export interface Note {
  id: string;
  /** Shown on the pin and in the paste. Stable once given. */
  n: number;
  comment: string;
  /** Where on the site. Notes span pages, so each carries its own. */
  page: { path: string; viewport: { w: number; h: number } };
  /** The area pointed at, in page pixels. */
  rect: Rect;
  /**
   * A dragged area rather than a clicked element. `target` is then the
   * smallest element that contains the area: context for finding it in the
   * source, not the thing the note is about.
   */
  region?: boolean;
  /** The element, when one was clicked rather than a region dragged. */
  target?: {
    selector: string;
    label: string;
    size: { w: number; h: number };
    padding: Quad;
    border: Quad;
    margin: Quad;
    /**
     * The element's visible text, trimmed. A class selector is usually shared
     * — four tabs are all `a.tab` — and the text is what tells an agent which
     * one, and what it greps the source for.
     */
    text?: string;
    /** Ancestors down to the element, with a position where siblings match. */
    path?: string;
  };
  /**
   * For a dragged area: the outermost elements it contains, grouped when they
   * share a selector. The container alone says where; this says what.
   */
  inside?: { selector: string; count: number; text?: string }[];
  /** What edit mode had changed on that element when the note was taken. */
  changes?: { prop: string; from: string; to: string }[];
  /**
   * The screenshot, if there is one.
   *
   * `path` is absolute and exists only when a dev server wrote the file, which
   * is the case the paste is designed around. `file` alone means it went to
   * the browser's downloads folder, whose location a page is never told.
   */
  image?: { file: string; path?: string };
}

// ── Geometry ───────────────────────────────────────────────────────────────

/** A drag in either direction, as a rectangle with positive size. */
export function rectFrom(ax: number, ay: number, bx: number, by: number): Rect {
  return {
    x: Math.min(ax, bx),
    y: Math.min(ay, by),
    w: Math.abs(bx - ax),
    h: Math.abs(by - ay),
  };
}

/**
 * Where a viewport rectangle falls in a captured frame, in frame pixels.
 *
 * A tab capture is the viewport at device resolution — or smaller, when the
 * browser scales a large tab down to keep the stream cheap. Neither ratio can
 * be assumed, so both axes are measured from the frame itself. Rounded outward
 * so an edge that lands on a half pixel is kept rather than shaved, and
 * clamped so a region dragged past the window edge crops to what exists.
 */
export function frameCrop(
  region: Rect,
  viewport: { w: number; h: number },
  frame: { w: number; h: number },
): Rect | null {
  if (viewport.w <= 0 || viewport.h <= 0) return null;
  const sx = frame.w / viewport.w;
  const sy = frame.h / viewport.h;
  const left = Math.max(0, Math.floor(region.x * sx));
  const top = Math.max(0, Math.floor(region.y * sy));
  const right = Math.min(frame.w, Math.ceil((region.x + region.w) * sx));
  const bottom = Math.min(frame.h, Math.ceil((region.y + region.h) * sy));
  if (right - left < 1 || bottom - top < 1) return null;
  return { x: left, y: top, w: right - left, h: bottom - top };
}

/**
 * Did the stream capture this tab, or something else?
 *
 * The share dialog offers the current tab first but lets you pick a window or a
 * whole screen, and a crop computed for the viewport lands somewhere arbitrary
 * on either. A tab capture has the viewport's shape; anything that is not
 * within a couple of percent of it is not this tab, and every crop from it
 * would be a picture of the wrong place.
 */
export function looksLikeThisTab(
  frame: { w: number; h: number },
  viewport: { w: number; h: number },
  tolerance = 0.02,
): boolean {
  if (frame.w <= 0 || frame.h <= 0 || viewport.w <= 0 || viewport.h <= 0) return false;
  const a = frame.w / frame.h;
  const b = viewport.w / viewport.h;
  return Math.abs(a - b) / b <= tolerance;
}

/**
 * The size an image is written at.
 *
 * A region the size of the whole screen at 2x is five megabytes of PNG, and an
 * agent reading it scales it down anyway. The longest side is capped; anything
 * smaller is kept at full resolution, because a 1px misalignment is precisely
 * what these are taken to show.
 */
export function outputSize(w: number, h: number, max = 2000): { w: number; h: number } {
  const longest = Math.max(w, h);
  if (longest <= max) return { w, h };
  const s = max / longest;
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
}

// ── The paste ──────────────────────────────────────────────────────────────

const r = (v: number) => String(Math.round(v * 100) / 100);

/** A Quad in the order CSS writes it, collapsed the way a person would. */
export function shorthand([t, rt, b, l]: Quad): string {
  if (t === rt && t === b && t === l) return r(t);
  if (t === b && rt === l) return `${r(t)} ${r(rt)}`;
  if (rt === l) return `${r(t)} ${r(rt)} ${r(b)}`;
  return `${r(t)} ${r(rt)} ${r(b)} ${r(l)}`;
}

/**
 * A path as a Markdown link target.
 *
 * Angle brackets, because a project under "My Projects" or a Windows user
 * folder has a space in it, and a bare space ends a Markdown link.
 */
function linkTarget(path: string): string {
  return /[\s()<>]/.test(path) ? `<${path.replace(/[<>]/g, '')}>` : path;
}

/**
 * The batch, as one paste.
 *
 * Grouped by page, in the order the notes were taken, because that is the
 * order the problems were noticed in and usually the order they matter.
 * Numbers are the pins' numbers, so "fix 3" in a reply means the pin you can
 * see.
 */
export function notesToMarkdown(notes: readonly Note[]): string {
  if (notes.length === 0) return '';

  const out: string[] = [];
  const count = `${notes.length} note${notes.length === 1 ? '' : 's'}`;
  out.push(`# UI feedback — ${count}`);
  out.push('');

  const withImages = notes.filter((n) => n.image);
  if (withImages.some((n) => n.image!.path)) {
    out.push('Each note has a screenshot saved on disk. Open the image path to see exactly what the note is about before changing anything.');
    out.push('');
  } else if (withImages.length) {
    out.push('Screenshots were saved to the browser\'s downloads folder under the file names below.');
    out.push('');
  }

  const pages = new Map<string, Note[]>();
  for (const note of notes) {
    const list = pages.get(note.page.path) ?? [];
    list.push(note);
    pages.set(note.page.path, list);
  }

  for (const [path, list] of pages) {
    const vp = list[0]!.page.viewport;
    out.push(`## ${path}  (viewport ${vp.w}×${vp.h})`);
    out.push('');

    for (const note of list) {
      const heading = !note.target
        ? `### ${note.n}. Region`
        : note.region
          ? `### ${note.n}. Region inside \`${note.target.label}\``
          : `### ${note.n}. \`${note.target.label}\``;
      out.push(heading);
      out.push('');
      out.push(note.comment.trim() || '_(no comment)_');
      out.push('');

      if (note.image) {
        if (note.image.path) {
          out.push(`![note ${note.n}](${linkTarget(note.image.path)})`);
        } else {
          out.push(`Screenshot: \`${note.image.file}\` (downloads folder)`);
        }
        out.push('');
      }

      if (note.target && !note.region) {
        const t = note.target;
        out.push(`- Selector: \`${t.selector}\`${t.text ? ` — "${t.text}"` : ''}`);
        if (t.path && t.path !== t.selector) out.push(`- Path: \`${t.path}\``);
        out.push(`- Size: ${r(t.size.w)}×${r(t.size.h)}`
          + ` · padding ${shorthand(t.padding)}`
          + ` · border ${shorthand(t.border)}`
          + ` · margin ${shorthand(t.margin)}`);
      }
      if (note.region) {
        /*
         * A container's box model says nothing about an area dragged inside
         * it, so a region names the container and what the area holds, and
         * leaves the numbers to the picture.
         */
        if (note.target) {
          out.push(`- Inside: \`${note.target.path ?? note.target.selector}\``);
        }
        if (note.inside?.length) {
          const parts = note.inside.map((i) =>
            `\`${i.selector}\`${i.count > 1 ? ` ×${i.count}` : ''}${i.text ? ` ("${i.text}")` : ''}`);
          out.push(`- Contains: ${parts.join(', ')}`);
        }
      }
      out.push(`- Area: x ${r(note.rect.x)}, y ${r(note.rect.y)}, ${r(note.rect.w)}×${r(note.rect.h)} (page px)`);

      if (note.changes?.length) {
        out.push('- Tried in the browser, not yet in source:');
        for (const c of note.changes) {
          out.push(`  - \`${c.prop}\`: \`${c.from || '(unset)'}\` → \`${c.to}\``);
        }
      }
      out.push('');
    }
  }

  return out.join('\n').trimEnd() + '\n';
}

// ── Surviving a reload ─────────────────────────────────────────────────────

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isQuad = (v: unknown): v is Quad => Array.isArray(v) && v.length === 4 && v.every(isNum);

/**
 * Anything read back from storage, checked field by field.
 *
 * Notes have to survive a reload for the loop to work at all: the agent edits
 * your source, the dev server reloads the page, and a batch that vanished at
 * that moment would be lost exactly when you came back to write the next one.
 * So they are stored, and anything stored can come back hand-edited or from an
 * older version. A bad note is dropped rather than allowed to throw at startup.
 */
export function reviveNotes(raw: unknown): Note[] {
  if (!Array.isArray(raw)) return [];
  const out: Note[] = [];
  for (const v of raw) {
    if (typeof v !== 'object' || v === null) continue;
    const o = v as Record<string, unknown>;
    const page = o['page'] as Record<string, unknown> | undefined;
    const vp = page?.['viewport'] as Record<string, unknown> | undefined;
    const rect = o['rect'] as Record<string, unknown> | undefined;
    if (typeof o['id'] !== 'string' || !isNum(o['n']) || typeof o['comment'] !== 'string') continue;
    if (!page || typeof page['path'] !== 'string' || !vp || !isNum(vp['w']) || !isNum(vp['h'])) continue;
    if (!rect || !isNum(rect['x']) || !isNum(rect['y']) || !isNum(rect['w']) || !isNum(rect['h'])) continue;

    const note: Note = {
      id: o['id'],
      n: o['n'],
      comment: o['comment'],
      page: { path: page['path'], viewport: { w: vp['w'], h: vp['h'] } },
      rect: { x: rect['x'], y: rect['y'], w: rect['w'], h: rect['h'] },
    };
    if (o['region'] === true) note.region = true;

    const t = o['target'] as Record<string, unknown> | undefined;
    const size = t?.['size'] as Record<string, unknown> | undefined;
    if (t && typeof t['selector'] === 'string' && typeof t['label'] === 'string'
      && size && isNum(size['w']) && isNum(size['h'])
      && isQuad(t['padding']) && isQuad(t['border']) && isQuad(t['margin'])) {
      note.target = {
        selector: t['selector'], label: t['label'],
        size: { w: size['w'], h: size['h'] },
        padding: t['padding'], border: t['border'], margin: t['margin'],
      };
      if (typeof t['text'] === 'string') note.target.text = t['text'];
      if (typeof t['path'] === 'string') note.target.path = t['path'];
    }

    if (Array.isArray(o['inside'])) {
      const inside: NonNullable<Note['inside']> = [];
      for (const i of o['inside'] as unknown[]) {
        if (typeof i !== 'object' || i === null) continue;
        const e = i as Record<string, unknown>;
        if (typeof e['selector'] !== 'string' || !isNum(e['count'])) continue;
        const entry: NonNullable<Note['inside']>[number] = { selector: e['selector'], count: e['count'] };
        if (typeof e['text'] === 'string') entry.text = e['text'];
        inside.push(entry);
      }
      if (inside.length) note.inside = inside;
    }

    if (Array.isArray(o['changes'])) {
      const changes = (o['changes'] as unknown[]).filter((c): c is { prop: string; from: string; to: string } =>
        typeof c === 'object' && c !== null
        && typeof (c as Record<string, unknown>)['prop'] === 'string'
        && typeof (c as Record<string, unknown>)['from'] === 'string'
        && typeof (c as Record<string, unknown>)['to'] === 'string');
      if (changes.length) note.changes = changes;
    }

    const img = o['image'] as Record<string, unknown> | undefined;
    if (img && typeof img['file'] === 'string') {
      note.image = { file: img['file'] };
      if (typeof img['path'] === 'string') note.image.path = img['path'];
    }

    out.push(note);
  }
  return out;
}

/**
 * The next pin number: one past the highest still standing.
 *
 * Deleting note 2 of 3 leaves a gap rather than renumbering, so the pins you
 * can see keep the numbers you may already have said out loud. A number is
 * only reused once nothing on the page carries it.
 */
export function nextNumber(notes: readonly Note[]): number {
  return notes.reduce((m, n) => Math.max(m, n.n), 0) + 1;
}
