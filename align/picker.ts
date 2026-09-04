import { formats } from './colour';
import { FLAG_H, INSET, STEP } from './indicator';
import { GROUND, HAIRLINE, MOTION, SHADOW, SPACE, surface, TEXT, TYPE } from './theme';

/**
 * The colour picker: sample a pixel, then read it in four formats.
 *
 * Sampling is the browser's own EyeDropper, which takes over the whole screen —
 * so this can pick out of a design file sitting beside the browser, not just
 * out of the page. Everything after the sample is arithmetic in `colour.ts`.
 */

export interface Picker {
  /** Sample a pixel. Resolves once the card is up, or immediately if cancelled. */
  open(): Promise<void>;
  /** True if it was showing — lets Escape dismiss the topmost layer first. */
  close(): boolean;
  destroy(): void;
}

interface EyeDropperCtor {
  new (): { open(): Promise<{ sRGBHex: string }> };
}

const CSS = `
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${INSET + FLAG_H + STEP}px; right: ${INSET}px; width: 200px;
  padding: ${SPACE.base}px; border-radius: 0;
  user-select: none;
  font-family: ${TYPE.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${TYPE.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${TEXT.primary};
  background: ${GROUND};
  box-shadow: ${SHADOW};
  /*
   * It comes from the button that opened it. The card is parked directly under
   * the toolbar and the colour button is at its right end, so an origin in the
   * top right corner is that button — the card grows out of the control you
   * pressed rather than arriving from nowhere.
   *
   * Visibility rather than display, which cannot be transitioned; delayed out
   * by the duration on close so the fade finishes before it stops existing.
   * The same treatment the key list gets, because it is the same shape.
   */
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: scale(0.98) translateY(-4px);
  transform-origin: top right;
  transition: opacity ${MOTION.ui}, transform ${MOTION.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${MOTION.ui}, transform ${MOTION.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .picker { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .picker[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${HAIRLINE};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${TEXT.primary};
}
.picker button:hover { background: ${surface(2)}; }
.picker button:focus-visible { outline: 1px solid ${TEXT.primary}; outline-offset: -1px; }
.picker .k { color: ${TEXT.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${HAIRLINE};
  color: ${TEXT.secondary};
}
`;

export function createPicker(root: ShadowRoot): Picker {
  const style = document.createElement('style');
  style.textContent = CSS;
  root.appendChild(style);

  const card = document.createElement('div');
  card.className = 'picker';
  root.appendChild(card);

  const swatch = document.createElement('div');
  swatch.className = 'swatch';

  const hint = document.createElement('div');
  hint.className = 'hint';

  function show(hex: string) {
    swatch.style.background = hex;
    const rows = formats(hex).map(({ label, value }) => {
      const b = document.createElement('button');
      b.type = 'button';
      const k = document.createElement('span');
      k.className = 'k';
      k.textContent = label;
      const v = document.createElement('span');
      v.className = 'v';
      v.textContent = value;
      b.append(k, v);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(value).then(
          () => { hint.textContent = `copied ${label}`; },
          () => { hint.textContent = 'clipboard refused'; },
        );
      });
      return b;
    });
    hint.textContent = 'click a row to copy';
    card.replaceChildren(swatch, ...rows, hint);
    card.setAttribute('data-open', '');
  }

  return {
    async open() {
      const Ctor = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
      if (!Ctor) {
        card.replaceChildren(
          Object.assign(document.createElement('div'), {
            className: 'hint',
            textContent: 'this browser has no eyedropper',
          }),
        );
        card.setAttribute('data-open', '');
        return;
      }
      try {
        const { sRGBHex } = await new Ctor().open();
        show(sRGBHex);
      } catch {
        // Escape during the pick rejects. Nothing was chosen, so show nothing.
      }
    },

    close() {
      const wasOpen = card.hasAttribute('data-open');
      card.removeAttribute('data-open');
      return wasOpen;
    },

    destroy() { card.remove(); style.remove(); },
  };
}
