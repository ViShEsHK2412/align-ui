import { createSlider, type Slider } from '../../align/slider';

/**
 * The slider test bench.
 *
 * Every section is a case that could plausibly break it, with the right answer
 * written on the page so you can check rather than remember. Each one says what
 * to do and what should happen; if what happens is different, that is a bug and
 * the page has already told you which.
 */

interface Case {
  id: string;
  title: string;
  /** What to try. */
  doThis: string;
  /** What should happen. */
  expect: string;
  width?: number;
  /** A transform on the wrapper, for the cases about scaled ancestors. */
  transform?: string;
  dir?: 'rtl';
  sliders: {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }[];
}

const CASES: Case[] = [
  {
    id: 'continuous',
    title: '1 · The ordinary case',
    doThis: 'Drag it. Then click near a tenth, then click between two tenths.',
    expect:
      'Dragging tracks the pointer exactly, with no easing and no snapping. '
      + 'A click springs to where you clicked. A click within 3.125% of a tenth '
      + 'is pulled onto it; one further away is left exactly where you put it.',
    sliders: [{ label: 'Opacity', value: 0.5, min: 0, max: 1, step: 0.01 }],
  },
  {
    id: 'discrete',
    title: '2 · Countable steps',
    doThis: 'Look at the marks, then click anywhere.',
    expect:
      'Five positions, so there are four marks and every one is a target. A '
      + 'click lands on the nearest step, never between two.',
    sliders: [{ label: 'Columns', value: 4, min: 0, max: 10, step: 2 }],
  },
  {
    id: 'offset-range',
    title: '3 · A range that does not start at zero',
    doThis: 'Step through it with the arrow keys.',
    expect:
      'The reachable values are 3, 5, 7, 9, 11. Never 4 — the step is measured '
      + 'from the minimum, not from zero.',
    sliders: [{ label: 'Gap', value: 5, min: 3, max: 11, step: 2, unit: 'px' }],
  },
  {
    id: 'indivisible',
    title: '4 · A step that does not divide the range',
    doThis: 'Press End, then Home.',
    expect:
      '0.3 does not divide 1, but both ends are still exactly reachable: End '
      + 'gives 1.00 and Home gives 0.00. A naive snap can never reach the top.',
    sliders: [{ label: 'Ratio', value: 0.6, min: 0, max: 1, step: 0.3 }],
  },
  {
    id: 'ranges',
    title: '5 · Ranges of very different sizes',
    doThis: 'Drag each. Watch the number of decimals.',
    expect:
      'The decimals follow the step: none for a whole-number step, three for '
      + '0.001. Neither ever shows floating-point dust like 0.30000000000000004.',
    sliders: [
      { label: 'Z-index', value: 100, min: 0, max: 10000, step: 1 },
      { label: 'Offset', value: 0, min: -50, max: 50, step: 1, unit: 'px' },
      { label: 'Tracking', value: 0.02, min: 0, max: 0.05, step: 0.001, unit: 'em' },
    ],
  },
  {
    id: 'dodge',
    title: '6 · The handle must never cross the text',
    doThis: 'Drag each one slowly from end to end.',
    expect:
      'As the handle approaches the label on the left or the value on the '
      + 'right it fades almost out and squashes. It never sits on top of a '
      + 'character, and the point it gives way is different for each row '
      + 'because it is measured from that row’s own text.',
    sliders: [
      { label: 'W', value: 0.5, min: 0, max: 1, step: 0.01 },
      { label: 'Border bottom left radius', value: 0.5, min: 0, max: 1, step: 0.01 },
      { label: 'Size', value: 0.5, min: 0, max: 100000, step: 1, unit: 'px' },
    ],
  },
  {
    id: 'narrow',
    title: '7 · Not enough room',
    doThis: 'Drag it. Then try to reach 0 and 1.',
    expect:
      'At 200px the label and value nearly meet, so the handle is dodging '
      + 'almost everywhere. Both ends are still reachable and the fill still '
      + 'goes fully empty and fully full.',
    width: 200,
    sliders: [{ label: 'Padding', value: 0.5, min: 0, max: 1, step: 0.01, unit: 'px' }],
  },
  {
    id: 'wide',
    title: '8 · Plenty of room',
    doThis: 'Click near the far right, then drag well past the right edge and hold.',
    expect:
      'Past the edge the track stretches, but only after about 32px of nothing, '
      + 'and never by more than 8px however far you go. Let go and it springs '
      + 'back. The value stays pinned at the maximum the whole time.',
    width: 760,
    sliders: [{ label: 'Width', value: 0.7, min: 0, max: 1, step: 0.01 }],
  },
  {
    id: 'scaled',
    title: '9 · Inside a canvas that scales the page',
    doThis: 'Drag it. Compare where the handle lands with where the pointer is.',
    expect:
      'The wrapper is scaled to 50%. The handle stays under the pointer, '
      + 'because the control divides the ancestor scale back out. Without that '
      + 'division the handle would move at twice the speed of the pointer.',
    transform: 'scale(0.5)',
    sliders: [{ label: 'Zoomed', value: 0.4, min: 0, max: 1, step: 0.01 }],
  },
  {
    id: 'scaled-up',
    title: '10 · Scaled the other way, and rotated',
    doThis: 'Drag both.',
    expect:
      'The first is at 150% and must still track exactly. The second is '
      + 'rotated, where there is no honest horizontal scale to recover — it '
      + 'should still be usable rather than wild, since the scale is taken from '
      + 'the matrix as a length and a rotation reads as 1, not as a squash.',
    transform: 'scale(1.5)',
    sliders: [{ label: 'Big', value: 0.4, min: 0, max: 1, step: 0.01 }],
  },
  {
    id: 'rotated',
    title: '11 · Rotated',
    doThis: 'Drag it.',
    expect: 'Usable. A rotation is not a scale and must not be treated as one.',
    transform: 'rotate(8deg)',
    sliders: [{ label: 'Tilted', value: 0.4, min: 0, max: 1, step: 0.01 }],
  },
  {
    id: 'degenerate',
    title: '12 · Values that should not exist',
    doThis: 'Try to drag each. Try the arrow keys.',
    expect:
      'None of them throw, none show NaN, and none divide by zero. A zero-width '
      + 'range sits at the left. A zero step behaves as no step at all rather '
      + 'than snapping to nothing.',
    sliders: [
      { label: 'min = max', value: 5, min: 5, max: 5, step: 1 },
      { label: 'step 0', value: 0.5, min: 0, max: 1, step: 0 },
      { label: 'inverted', value: 5, min: 10, max: 0, step: 1 },
      { label: 'huge step', value: 5, min: 0, max: 10, step: 1000 },
    ],
  },
  {
    id: 'edit',
    title: '13 · Typing a value',
    doThis:
      'Rest the pointer on the number for a second. Then click it and type. '
      + 'Then start a drag from on top of the number.',
    expect:
      'After 800ms the number underlines and the cursor becomes a caret — only '
      + 'then does clicking open a field. Enter commits, Escape cancels, and a '
      + 'value outside the range is clamped rather than refused. A drag that '
      + 'starts on the number drags the slider, because the delay has not '
      + 'elapsed.',
    sliders: [{ label: 'Type me', value: 0.5, min: 0, max: 1, step: 0.01 }],
  },
  {
    id: 'keyboard',
    title: '14 · Keyboard only',
    doThis:
      'Tab to it. Arrows, Shift+arrows, PageUp/PageDown, Home, End, then Enter.',
    expect:
      'A visible focus ring. Arrows move one step, Shift and Page move ten, '
      + 'Home and End take the ends, Enter opens the field. Nothing animates — '
      + 'a held arrow repeats faster than a spring could settle, so stepping is '
      + 'instant on purpose.',
    sliders: [{ label: 'Keys', value: 50, min: 0, max: 100, step: 1 }],
  },
  {
    id: 'rtl',
    title: '15 · Right to left',
    doThis: 'Drag it.',
    expect:
      'The control is laid out for an RTL page. It should still be usable and '
      + 'the value should still follow the pointer. Known gap: the fill grows '
      + 'from the left in both directions.',
    dir: 'rtl',
    sliders: [{ label: 'عرض', value: 0.4, min: 0, max: 1, step: 0.01 }],
  },
];

// ── Mounting ────────────────────────────────────────────────────────────────

const live: Slider[] = [];
const log = document.getElementById('log') as HTMLElement;
const counts = new Map<string, { change: number; commit: number }>();

function record(key: string, kind: 'change' | 'commit'): void {
  const c = counts.get(key) ?? { change: 0, commit: 0 };
  c[kind] += 1;
  counts.set(key, c);
  render();
}

function render(): void {
  const rows = [...counts.entries()]
    .map(([k, c]) => `${k.padEnd(28)} ${String(c.change).padStart(5)} change  ${String(c.commit).padStart(4)} commit`);
  log.textContent = rows.join('\n') || 'Nothing touched yet.';
}

const host = document.getElementById('cases') as HTMLElement;

for (const c of CASES) {
  const section = document.createElement('section');
  section.className = 'case';
  section.id = c.id;

  const h = document.createElement('h2');
  h.textContent = c.title;

  const doThis = document.createElement('p');
  doThis.className = 'do';
  doThis.textContent = c.doThis;

  const expect = document.createElement('p');
  expect.className = 'expect';
  expect.textContent = c.expect;

  const stage = document.createElement('div');
  stage.className = 'stage';
  if (c.width) stage.style.width = `${c.width}px`;
  if (c.transform) {
    stage.style.transform = c.transform;
    stage.style.transformOrigin = 'left top';
  }
  if (c.dir) stage.dir = c.dir;

  // A shadow root per case, which is how the tool mounts for real.
  const shadow = stage.attachShadow({ mode: 'open' });
  const rows = document.createElement('div');
  rows.style.cssText = 'display: grid; gap: 6px;';
  shadow.appendChild(rows);

  for (const s of c.sliders) {
    const key = `${c.id}/${s.label}`;
    const slider = createSlider(shadow, {
      ...s,
      onChange: () => record(key, 'change'),
      onCommit: () => record(key, 'commit'),
    });
    rows.appendChild(slider.el);
    live.push(slider);
  }

  section.append(h, doThis, expect, stage);
  host.appendChild(section);
}

// ── The bulk case, which is about cost rather than behaviour ────────────────

const bulkHost = document.getElementById('bulk') as HTMLElement;
const bulkShadow = bulkHost.attachShadow({ mode: 'open' });
const bulkRows = document.createElement('div');
bulkRows.style.cssText = 'display: grid; gap: 4px; max-height: 320px; overflow: auto;';
bulkShadow.appendChild(bulkRows);

for (let i = 0; i < 200; i++) {
  const slider = createSlider(bulkShadow, {
    label: `Row ${i + 1}`,
    value: (i % 100) / 100,
    min: 0,
    max: 1,
    step: 0.01,
    onChange: () => {},
  });
  bulkRows.appendChild(slider.el);
  live.push(slider);
}

// ── A frame-time readout, so "does it drop frames" has an answer ────────────

const fpsEl = document.getElementById('fps') as HTMLElement;
let last = performance.now();
let worst = 0;
let frames = 0;
let sum = 0;

function tick(now: number): void {
  const dt = now - last;
  last = now;
  // The first frame after an idle period is not a dropped frame.
  if (dt < 200) {
    worst = Math.max(worst, dt);
    sum += dt;
    frames += 1;
  }
  if (frames >= 30) {
    fpsEl.textContent = `mean ${(sum / frames).toFixed(1)}ms · worst ${worst.toFixed(1)}ms`;
    frames = 0;
    sum = 0;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

document.getElementById('reset-worst')?.addEventListener('click', () => {
  worst = 0;
});

// Boot is the worst frame on any page and says nothing about the control, so
// the counter starts once the page has settled rather than at the first frame.
setTimeout(() => { worst = 0; }, 2000);

render();

// Handy in the console while poking at it.
(window as unknown as { __sliders: Slider[] }).__sliders = live;

/*
 * The tool itself, on the bench page.
 *
 * Partly so the bench matches the other demo pages, and partly because the
 * slider is going to live inside this tool: measuring it with the thing it is
 * being built for is the fastest way to notice that a row is off the spacing
 * scale or that the text sits a pixel high.
 */
if (import.meta.env.DEV) {
  import('../../align/index').then((m) => m.initAlign());
}

import.meta.hot?.accept();
