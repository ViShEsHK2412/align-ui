import { frameCrop, looksLikeThisTab, outputSize, type Rect } from './notes';

/**
 * Screenshots of this tab, taken by the browser's own screen capture.
 *
 * A page cannot photograph itself. The two ways round that are to redraw the
 * DOM onto a canvas — what html2canvas, modern-screenshot and snapdom do — or
 * to ask the browser to share the tab. Redrawing needs no permission but gets
 * wrong exactly what a design note is usually about: backdrop-filter, blend
 * modes, cross-origin images, video, canvas, the odd font. Sharing gets every
 * pixel right, because it is the pixels, at the cost of one "Share this tab"
 * click and a sharing bar while it runs.
 *
 * So the stream is opened once and kept, not opened per note: one prompt a
 * session rather than one a screenshot. It closes when the tool does, or when
 * the browser's own Stop sharing is pressed.
 *
 * Chromium offers the current tab first (`preferCurrentTab`). Every browser
 * lets you pick something else instead, and a crop computed for the viewport
 * lands in the wrong place on a window or a screen, so the frame's shape is
 * checked before anything is cropped from it.
 */

export type StartResult = 'ok' | 'denied' | 'unsupported' | 'failed';
export type GrabResult =
  | { ok: true; blob: Blob; width: number; height: number }
  | { ok: false; reason: 'inactive' | 'wrong-surface' | 'empty' | 'failed' | 'timeout' | 'nothing'; detail?: string };

export interface TabCapture {
  active(): boolean;
  start(): Promise<StartResult>;
  /**
   * Crop a viewport region out of the next frame.
   *
   * `hide` runs first and returns its own undo: the tool's overlay is on the
   * page and would otherwise be in every screenshot it takes.
   */
  grab(region: Rect, hide: () => () => void): Promise<GrabResult>;
  stop(): void;
  /** Called when sharing ends for any reason other than `stop()`. */
  onEnded(cb: () => void): void;
}

/** How long to wait for a fresh frame before using the one there is. */
const FRAME_TIMEOUT = 600;

const nextPaint = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * A region of a whole-viewport frame, as a PNG.
 *
 * Shared by both sources. The frame's shape is checked against the viewport
 * first: a crop computed for the viewport lands in the wrong place on anything
 * else, and a picture of the wrong place is worse than none.
 */
async function cropFrame(
  source: CanvasImageSource,
  frame: { w: number; h: number },
  region: Rect,
  viewport: { w: number; h: number },
): Promise<GrabResult> {
  if (!looksLikeThisTab(frame, viewport)) return { ok: false, reason: 'wrong-surface' };
  const crop = frameCrop(region, viewport, frame);
  if (!crop) return { ok: false, reason: 'empty' };

  const size = outputSize(crop.w, crop.h);
  const out = document.createElement('canvas');
  out.width = size.w;
  out.height = size.h;
  const ctx = out.getContext('2d');
  if (!ctx) return { ok: false, reason: 'failed' };
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, crop.x, crop.y, crop.w, crop.h, 0, 0, size.w, size.h);

  const blob = await new Promise<Blob | null>((res) => out.toBlob(res, 'image/png'));
  return blob ? { ok: true, blob, width: size.w, height: size.h } : { ok: false, reason: 'failed' };
}

export function createTabCapture(): TabCapture {
  let stream: MediaStream | null = null;
  let video: HTMLVideoElement | null = null;
  let ended: (() => void) | null = null;

  function teardown(): void {
    for (const t of stream?.getTracks() ?? []) t.stop();
    stream = null;
    if (video) { video.srcObject = null; video = null; }
  }

  /**
   * A frame produced after the overlay was hidden.
   *
   * A tab stream only sends frames when the tab changes, which is useful here:
   * hiding the overlay is itself a change, so the next frame is the one
   * without it. `requestVideoFrameCallback` says when that frame is on the
   * video. Where it is missing, or where nothing changed because the overlay
   * was not visible to begin with, the timeout takes whatever frame is there.
   */
  function freshFrame(v: HTMLVideoElement): Promise<void> {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      const rvfc = (v as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
      }).requestVideoFrameCallback;
      if (rvfc) rvfc.call(v, finish);
      setTimeout(finish, FRAME_TIMEOUT);
    });
  }

  const isActive = (): boolean =>
    stream !== null && stream.getVideoTracks().some((t) => t.readyState === 'live');

  return {
    active: isActive,

    async start(): Promise<StartResult> {
      if (stream) return 'ok';
      const md = navigator.mediaDevices as MediaDevices | undefined;
      if (!md?.getDisplayMedia) return 'unsupported';
      try {
        stream = await md.getDisplayMedia({
          video: { displaySurface: 'browser', cursor: 'never', frameRate: { ideal: 30 } },
          audio: false,
          // Not yet in the DOM typings. Chromium reads all four; others ignore them.
          preferCurrentTab: true,
          selfBrowserSurface: 'include',
          surfaceSwitching: 'exclude',
          monitorTypeSurfaces: 'exclude',
        } as DisplayMediaStreamOptions);
      } catch {
        return 'denied';
      }

      const track = stream.getVideoTracks()[0];
      track?.addEventListener('ended', () => {
        teardown();
        ended?.();
      });

      video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        teardown();
        return 'failed';
      }
      // Dimensions are zero until the first frame has decoded.
      // Bounded: a stream that never produces a frame must not leave the
      // first note waiting forever.
      if (!video.videoWidth) {
        const v = video;
        await new Promise<void>((r) => {
          v.addEventListener('loadeddata', () => r(), { once: true });
          setTimeout(r, 2000);
        });
      }
      return 'ok';
    },

    async grab(region: Rect, hide: () => () => void): Promise<GrabResult> {
      const v = video;
      if (!v || !isActive()) return { ok: false, reason: 'inactive' };

      const restore = hide();
      let frame: { w: number; h: number };
      let canvas: HTMLCanvasElement;
      const viewport = { w: innerWidth, h: innerHeight };
      try {
        // Two paints so the hide has reached the compositor, then a frame
        // produced after it.
        await nextPaint();
        await nextPaint();
        await freshFrame(v);

        frame = { w: v.videoWidth, h: v.videoHeight };
        // Snapshot the whole frame now, while the overlay is still hidden;
        // the crop can happen after it is back.
        canvas = document.createElement('canvas');
        canvas.width = frame.w;
        canvas.height = frame.h;
        canvas.getContext('2d')?.drawImage(v, 0, 0, frame.w, frame.h);
      } catch {
        restore();
        return { ok: false, reason: 'failed' };
      }
      restore();

      return cropFrame(canvas, frame, region, viewport);
    },

    stop(): void {
      teardown();
    },

    onEnded(cb: () => void): void {
      ended = cb;
    },
  };
}

/**
 * What a host supplies to take screenshots without the share prompt.
 *
 * It returns the whole visible tab, the way chrome.tabs.captureVisibleTab
 * does — a PNG Blob, a data URL, a canvas or an ImageBitmap — and the tool
 * crops it. Asking the host for the whole frame rather than a region keeps the
 * contract to one thing every capture API can already do, and keeps the crop
 * maths, and its checks, in one place.
 */
export type CaptureFrame = () => Promise<Blob | string | HTMLCanvasElement | ImageBitmap | null | undefined>;

/** How long a host gets to produce a frame before the note goes on without one. */
export const HOOK_TIMEOUT = 5000;

async function decode(
  frame: Blob | string | HTMLCanvasElement | ImageBitmap,
): Promise<{ source: CanvasImageSource; w: number; h: number }> {
  if (typeof HTMLCanvasElement !== 'undefined' && frame instanceof HTMLCanvasElement) {
    return { source: frame, w: frame.width, h: frame.height };
  }
  if (typeof ImageBitmap !== 'undefined' && frame instanceof ImageBitmap) {
    return { source: frame, w: frame.width, h: frame.height };
  }
  const blob = typeof frame === 'string' ? await (await fetch(frame)).blob() : frame;
  const bitmap = await createImageBitmap(blob);
  return { source: bitmap, w: bitmap.width, h: bitmap.height };
}

/**
 * A capture backed by the host's hook instead of screen sharing.
 *
 * Always active and never prompts: if the host can supply frames there is
 * nothing to ask. A hook that throws, hangs or returns the wrong shape costs
 * that one screenshot and says why — it never falls back to the share prompt,
 * which would surprise anyone whose setup exists to avoid it.
 */
export function createHookCapture(hook: CaptureFrame): TabCapture {
  return {
    active: () => true,
    start: async () => 'ok',
    async grab(region: Rect, hide: () => () => void): Promise<GrabResult> {
      const viewport = { w: innerWidth, h: innerHeight };
      const restore = hide();
      const TIMED_OUT = Symbol('timeout');
      let raw: Awaited<ReturnType<CaptureFrame>> | typeof TIMED_OUT;
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        // Two paints, so a host that captures real screen pixels does not
        // capture the tool on its way out.
        await nextPaint();
        await nextPaint();
        raw = await Promise.race([
          hook(),
          new Promise<typeof TIMED_OUT>((res) => { timer = setTimeout(() => res(TIMED_OUT), HOOK_TIMEOUT); }),
        ]);
      } catch (err) {
        return { ok: false, reason: 'failed', detail: err instanceof Error ? err.message : String(err) };
      } finally {
        clearTimeout(timer);
        restore();
      }
      if (raw === TIMED_OUT) return { ok: false, reason: 'timeout' };
      if (!raw) return { ok: false, reason: 'nothing' };
      try {
        const { source, w, h } = await decode(raw);
        return await cropFrame(source, { w, h }, region, viewport);
      } catch (err) {
        return { ok: false, reason: 'failed', detail: err instanceof Error ? err.message : String(err) };
      }
    },
    stop: () => {},
    onEnded: () => {},
  };
}
