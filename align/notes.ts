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
  /**
   * Where the area sits inside its element, as fractions of the element's box.
   *
   * Page coordinates follow scrolling and nothing else. Inside a canvas app the
   * element moves when the canvas zooms or pans, and a pin held to the page
   * stayed where the element used to be. Fractions of the element's own box
   * scale with it, so the pin can be placed from wherever the element is now.
   */
  anchor?: { fx: number; fy: number; fw: number; fh: number };
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
 * A comment, quoted line by line.
 *
 * The comment is the one part of the paste a person typed, and typed text can
 * be Markdown. Pasted raw, a comment starting "### 99." forged a heading, so an
 * agent reading the batch found a note 99 that does not exist, and an unclosed
 * code fence swallowed every note after it. Quoted, a heading is text inside a
 * quote and a fence ends where the quote does, so nothing typed can reach the
 * structure around it. Blank lines stay inside the quote rather than ending it.
 */
export function quote(comment: string): string {
  const text = comment.replace(/\r\n?/g, '\n').trim();
  if (!text) return '> _(no comment)_';
  return text.split('\n').map((line) => (line ? `> ${line}` : '>')).join('\n');
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
      out.push(quote(note.comment));
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
    const an = o['anchor'] as Record<string, unknown> | undefined;
    if (an && isNum(an['fx']) && isNum(an['fy']) && isNum(an['fw']) && isNum(an['fh'])) {
      note.anchor = { fx: an['fx'], fy: an['fy'], fw: an['fw'], fh: an['fh'] };
    }

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

/** Overlap over union: 1 for the same rectangle, 0 for disjoint ones. */
export function iou(a: Rect, b: Rect): number {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const inter = x * y;
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
}

/**
 * Did this drag really mean one element?
 *
 * People drag around a thing as often as they click it, and a drag used to
 * produce a vaguer note than a click on the same element: "region inside
 * main.stage" rather than the tab, its text, its path and its box model — the
 * numbers a note like "increase the padding" actually needs. The gesture should
 * not decide how precise the note is.
 *
 * Two cases count as one element. The drag holds exactly one outermost
 * element, however loosely it was drawn round it. Or it holds none but sits
 * almost exactly on the element it is inside — a drag drawn just within a
 * card's edges. Anything else is genuinely an area, and stays one.
 *
 * Returns the index of the outermost element meant, 'container', or null.
 */
export function subjectOf(
  region: Rect,
  outermost: readonly Rect[],
  container: Rect | null,
  fit = 0.6,
): number | 'container' | null {
  if (outermost.length === 1) return 0;
  if (outermost.length === 0 && container && iou(region, container) >= fit) return 'container';
  return null;
}

/**
 * A drag held to the window.
 *
 * Pointer capture keeps a drag alive past the edge of the window, which is
 * right for the gesture and wrong for the note: nothing out there can be
 * pointed at, screenshotted or named. Unclamped, a drag half off the right edge
 * stored an area the picture did not show and looked for its container at a
 * centre point outside the page, where there is no element to find.
 */
export function clampToViewport(r: Rect, viewport: { w: number; h: number }): Rect {
  const x = Math.max(0, Math.min(r.x, viewport.w));
  const y = Math.max(0, Math.min(r.y, viewport.h));
  const right = Math.max(0, Math.min(r.x + r.w, viewport.w));
  const bottom = Math.max(0, Math.min(r.y + r.h, viewport.h));
  return { x, y, w: right - x, h: bottom - y };
}

/**
 * Where each pin goes, so every note stays reachable.
 *
 * A pin marks the corner of what a note is about, and two notes about the same
 * element share a corner. Drawn there, the later pin covered the earlier one
 * completely — three notes on one tab showed one pin, and the two beneath it
 * could not be opened, edited or deleted. Colliding pins fan out to the right
 * instead, in note order, so the first note keeps the true corner.
 *
 * Page coordinates in and out, so the fan does not reshuffle as you scroll.
 */
export function layoutPins(
  anchors: readonly { x: number; y: number }[],
  size: number,
  gap = 2,
): { x: number; y: number }[] {
  const placed: { x: number; y: number }[] = [];
  for (const a of anchors) {
    const p = { x: a.x, y: a.y };
    while (placed.some((q) => Math.abs(q.x - p.x) < size && Math.abs(q.y - p.y) < size)) {
      p.x += size + gap;
    }
    placed.push(p);
  }
  return placed;
}

/**
 * A pin's centre held inside the window.
 *
 * Centred on the corner it marks, a pin for anything flush with the window
 * edge hung half outside it: note 20 read as "0". It is pulled in just far
 * enough to be whole.
 */
export function clampPin(x: number, y: number, size: number, viewport: { w: number; h: number }) {
  const half = size / 2 + 1;
  return {
    x: Math.min(Math.max(x, half), Math.max(half, viewport.w - half)),
    y: Math.min(Math.max(y, half), Math.max(half, viewport.h - half)),
  };
}

/** An area as fractions of the element it is inside. Null for an element with no size. */
export function anchorIn(area: Rect, element: Rect): Note['anchor'] | null {
  if (element.w <= 0 || element.h <= 0) return null;
  return {
    fx: (area.x - element.x) / element.w,
    fy: (area.y - element.y) / element.h,
    fw: area.w / element.w,
    fh: area.h / element.h,
  };
}

/** The same area, from wherever the element is now and however big it is drawn. */
export function areaFrom(anchor: NonNullable<Note['anchor']>, element: Rect): Rect {
  return {
    x: element.x + anchor.fx * element.w,
    y: element.y + anchor.fy * element.h,
    w: anchor.fw * element.w,
    h: anchor.fh * element.h,
  };
}

/**
 * How far the notes bar has to rise to clear the page's own bottom chrome.
 *
 * Bottom centre is where the bar starts, and it is also where canvas apps put
 * their own toolbar: in the interaction lab the two sat exactly on top of each
 * other. A blocker is anything painted under the bar that looks docked to the
 * bottom rather than like content: its bottom edge near the window's, and short
 * and narrow enough to be a toolbar rather than a page. Returns the distance
 * from the window's bottom edge the bar should sit at, or null to stay put.
 */
export function barLift(
  bar: Rect,
  blockers: readonly Rect[],
  viewport: { w: number; h: number },
  gap = 8,
): number | null {
  let top = Infinity;
  for (const b of blockers) {
    const docked = b.y + b.h >= viewport.h - 120;
    const compact = b.h <= 160 && b.w <= viewport.w * 0.9;
    const overlaps = b.x < bar.x + bar.w && b.x + b.w > bar.x && b.y < bar.y + bar.h && b.y + b.h > bar.y;
    if (docked && compact && overlaps) top = Math.min(top, b.y);
  }
  return top === Infinity ? null : viewport.h - top + gap;
}
