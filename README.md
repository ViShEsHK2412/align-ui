# align-ui

A dev-only measuring tool that runs inside your own project. Hover any element
to see its size, click to lock it, then hover another for the exact distance
between them, fractions included.

It measures. It doesn't judge: whether `25.5px` is wrong is your call.

![Three cards locked, with the 32px gutter between them measured](docs/screenshot.png)

- One line to install, one line to wire up
- No runtime dependencies
- 65 KB minified, 24 KB gzipped
- Physically absent from production builds
- Vite, Next.js, CRA, Remix, Astro, SvelteKit

---

## Install

```bash
npm i -D github:ViShEsHK2412/align-ui
```

Nothing is built on install. `dist/` is committed deliberately, so the package
works even where npm blocks lifecycle scripts, which recent npm does by default.
Then pick the line that matches your setup.

### Vite, Astro, SvelteKit, Remix, Nuxt

One line in the config, nothing in application code:

```ts
// vite.config.ts
import align from 'align-ui/vite';

export default defineConfig({
  plugins: [align()],
});
```

The plugin is `apply: 'serve'`, so it does not exist during a production build.
There is no dev guard to remember and no way for the tool to reach a bundle by
accident. Options go straight in: `align({ hotkey: 'mod+shift+a' })`.

### Anything else

```ts
// entry file
if (import.meta.env.DEV) import('align-ui/auto');
```

Or take the handle yourself if you want to pass options:

```ts
if (import.meta.env.DEV) {
  import('align-ui').then((m) => m.initAlign({ ignore: '.my-widget' }));
}
```

### Next.js (App Router)

Next has no equivalent of Vite's HTML hook, so it takes a small client
component. No import of ours in the layout, so nothing reaches the bundle:

```tsx
// components/AlignDev.tsx
'use client';
import { useEffect } from 'react';

let didInit = false;

export default function AlignDev() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;   // must be here
    if (didInit) return;
    didInit = true;
    import('align-ui/auto');
  }, []);
  return null;
}
```

```tsx
// app/layout.tsx
{process.env.NODE_ENV !== 'production' ? <AlignDev /> : null}
```

> The env check has to wrap the dynamic `import()` itself, not just the element.
> Guarding only `<AlignDev />` leaves the component statically imported and the
> import reachable, so the whole tool ships to production.

---

## The toolbar

Top-right. It says the tool is on, counts what is locked, and carries every
control as an icon: the layers you can switch on, then freeze (the one control
that changes the page rather than the overlay), then the things that happen
once.

Icons rather than labels, but the keyboard is the point, so every button's
tooltip carries its name, its key, and a sentence on what it does. Clicking the
word **Align** opens the full list with the icons beside the keys, which is the
one place the mapping can be learned. Controls with nothing to act on, such as
copy with nothing locked or undo with an empty history, go visibly dead rather
than accepting a press and doing nothing.

The badge steps down out of the way when the rulers are up, rather than covering
the ticks they exist to show.

## Keys

| | |
|---|---|
| `Ctrl/Cmd + Shift + A` | turn the tool on or off |
| hover | outline, dotted edge guides, size tooltip |
| click | lock an element, and open the box model |
| right-click | add to the locked set, or drop one from it. With two locked, the panel says what is different about them |
| drag the panel header | move the box model |
| `B`, or the `×` | hide the box model, and bring it back |
| `R` | rulers along the top and left edges |
| drag from a rule | pull out a guide; drag it back to remove |
| `V` / `H` | vertical / horizontal guide at the cursor |
| arrows | nudge the last guide you touched by 1px; `Shift` for 10 |
| `L` | pin that guide, so it cannot be moved or deleted |
| `Ctrl/Cmd + Z` | undo the last change to the guides: a nudge, a drag, a delete. A held arrow key undoes as one step, not thirty |
| `T` | type and token readout for the locked element |
| `\` | hide everything drawn, for a look at the page underneath. Locks, guides and layers all survive it |
| `F` | freeze the page so a moving thing can be measured |
| `X` | x-ray: outline every element on the page |
| `G` | the design grid, when one is configured |
| `K` | a 10px pixel grid, for reading an offset off the page |
| `P` | pick a colour from anywhere on screen |
| `C` | copy the numbers in the panel |
| `Ctrl/Cmd` while placing | ignore snapping |
| `Del` / `Shift + Del` | remove the guide under the cursor / all of them |
| `Esc` | close the key list, then the locks, then the tool |

Single-letter keys are ignored while you are typing in an input, a textarea or
anything `contenteditable`, so the tool never eats a keystroke meant for the
page. The activation hotkey is deliberately outside that rule: you can always
switch the tool off.

---

## What it measures

### Distances, and insets

Two things side by side have a gap between them. Something inside its container
does not. It has four edge distances, and those are the numbers you want: how
much room surrounds this inside that. Lock a container, hover a child, and all
four are drawn.

Positive is room inside. **Negative means it spills past that edge**, which is
usually the most interesting number on screen. Zeros are kept, because flush
against an edge is information.

One thing worth knowing when the panel and an inset disagree: an inset is
measured **border box to border box**, so it includes the container's border
*and* its padding. A panel reading `padding: 3` next to an inset of `3.8` is not
a contradiction. The difference is the 0.8px border.

Everything is reported in the units the elements live in. Inside a canvas app
zoomed to 150%, a 20px gap measures 30 on screen and is labelled 20, while the
line is still drawn where the pixels actually are.

### Locking more than one

Click the first element, right-click the rest, and every gutter between them is
measured at once. The set orders itself along whichever axis it varies on, so a
row reads left-to-right and a column top-to-bottom.

Right-click rather than a modifier, because every modifier+click is already
taken by the browser: Shift opens a new window, Ctrl/Cmd a new tab, Alt
downloads. While the tool is on it swallows clicks so nothing navigates out from
under you. Toggle off to use the app.

With two locked, the panel also says **what is different** about them: the
properties that differ, both values, most structural first. It is the answer to
"these two should look the same and they don't", which otherwise means measuring
each in turn and comparing by eye.

### The box model panel

Margins, borders and padding as nested bands, and under them, as they apply:

- **how the parent places it.** For a grid, the resolved track sizes (what your
  `1fr` actually became) and the cell this child landed in, measured rather than
  read off `grid-column-start`, which is `auto` for almost every real item
- **where each gap came from**: `gap 24`, `margins 24`, or `gap 8 · margins 16`,
  and `rest from layout` when `justify-content` is doing the work
- **which of its numbers are on your token scale**, and how many are not
- **which CSS rules style it**, and the file each lives in. Candidates in
  likeliest-first order, never a verdict, because the cascade cannot be
  re-derived reliably
- **its colours**, matched against the colour tokens in scope

`T` adds size, weight, line height and tracking, each checked against the scale
the same way. Line height is spacing, so it is measured like any other gap.

### Rulers and guides

**Rulers** run along the top and left edges in *page* coordinates, counting from
the top-left of the document rather than the viewport, so the numbers keep
meaning something as you scroll. Ticks step 10 / 50 / 100 px and the cursor is
marked on both rules. Locked elements are shaded on them, so a selection stays
findable once it scrolls off.

**Guides** are lines you place yourself, in page coordinates like the rulers.
Pull one out of a rule, down from the top for a horizontal or right from the
left for a vertical, so the axis is implied by where the drag started. Or press
`V` or `H` to drop one at the cursor. Drag a guide back into a rule to throw it
away.

They snap within 8px onto the edges and centre of whatever is under the cursor,
and onto other guides, because a guide meant to sit on a card's edge has to sit
*on* it rather than a pixel off and quietly lying. Hold `Ctrl/Cmd` to place one
freely. The guide's chip names what it caught (`x 760 · div.card left`), since a
guide that snapped and one that missed by a pixel look identical otherwise.

And they measure: hover a guide and it draws its distance to every locked
element; click it to keep those up. A guide passing *through* an element draws
nothing, since there is no gap to report.

### Grids

`G` draws the grid your design is built on, columns filled and gutters left
empty, so an element sitting in a gutter is visibly in the wrong place. It needs
one configured. There is no default, because a guessed grid is worse than none.

`K` lays a 10px lattice over the page in screen space, for reading an offset off
without measuring it.

### Freeze

`F` holds every animation and transition where it stands, so a hover state, a
dropdown mid-open, a toast or a loading skeleton can be measured at all. It
pauses through the animations themselves rather than disabling transitions,
which would jump each one to its end state, the value you did not ask for.

It does not stop animation driven by `requestAnimationFrame` or a timer. Doing
so means patching the page's own timers, and a tool that promises to leave the
page as it found it does not get to do that.

### What survives a reload

Guides are kept in `localStorage`, namespaced by `location.pathname`: the guides
you draw on `/pricing` describe `/pricing` and do not turn up on `/blog`. Every
stored entry is validated on read, so a hand-edited or stale value can never
throw at startup. The rulers and the two grids are remembered too.

Modes are not. X-ray, the type readout and the picker all start off, because a
tool that reopens in a mode you have forgotten looks broken rather than helpful.

---

## Configuration

Everything has a default. Nothing is required.

```ts
initAlign({
  ignore: '.third-party-widget, [data-radix-portal]',   // extra selector to skip
  hotkey: 'mod+shift+a',
  panelKey: 'b',
  rulerKey: 'r',
  guideKeys: { vertical: 'v', horizontal: 'h' },

  // 'auto' reads the page: an explicit color-scheme, then the background it
  // actually paints, and the machine's preference only if the page says
  // nothing. Right almost always, and a way out when it guesses wrong.
  theme: 'auto',

  // The grid the design is built on, for `G`. There is no default: twelve
  // columns at 24 means nothing without knowing whose system it is, and a
  // guessed grid is worse than none, because it looks authoritative.
  grid: { columns: 12, gutter: 24, margin: 24, maxWidth: 1200 },
});
```

`maxWidth` is the content width the grid is centred in; `0` fills the window.
The centring is against the layout viewport rather than `window.innerWidth`, so
it lands on the same pixels the browser centres your container on.

Mark anything the tool should never measure with `data-align-ignore`. Hovering
it walks up to the nearest ancestor that isn't ignored.

---

## How it works

The tool asks the browser one question, *what is at this coordinate?*, via
`elementFromPoint`, descending through open shadow roots so pages built from web
components measure their real inner nodes.

Nothing is cached and nothing is stored, so nothing can go stale. Measurements
are re-read every frame while the tool is open, which keeps the overlay correct
through CSS transitions, image loads and framework re-renders, and drops
anything that leaves the document. Nothing redraws unless something moved.

The whole UI lives in a closed shadow root on a host with `all: initial`, so the
page's CSS cannot reach it and it cannot reach the page's.

```
align/
  index.ts      init, hotkey, hover/lock state, lifecycle
  vite.ts       the Vite plugin
  auto.ts       one-line side-effecting entry
  overlay.ts    canvas: outlines, guides, distances, grids, rulers
  boxmodel.ts   the draggable readout panel
  indicator.ts  the toolbar and its key list
  icons.ts      Lucide icon paths, inlined
  measure.ts    geometry, hit-testing, snapping, grid arithmetic
  inspect.ts    type, tokens, gap provenance, parent layout, diffs
  colour.ts     hex / rgb / hsl / oklch conversion
  picker.ts     the eyedropper card
  freeze.ts     holding the page still
  history.ts    undo, one entry per gesture
  store.ts      what survives a reload
  xray.ts       the one thing that writes to the page
  theme.ts      colour, type, spacing and motion tokens
  types.ts      Box, Segment, Bands, Quad
  config.ts     ignore selector, hotkey, panel / ruler / guide keys
```

Only `overlay.ts`, `boxmodel.ts`, `indicator.ts` and `picker.ts` write to the
DOM. Only `index.ts` touches window globals and `import.meta.hot`. The geometry
in `measure.ts`, the arithmetic in `inspect.ts` and the undo stack in
`history.ts` are pure and unit-tested.

**Design.** Type is Inter on a three-step scale with tabular figures, so the
numbers don't jitter as the cursor moves. Surfaces are a film of alpha over an
opaque ground, black on light and white on dark, which is what lets one set of
values work in both themes. The text levels carry a value per theme, because a
single alpha measurably cannot hit the same contrast on both grounds. Every text
and icon pair in the toolbar and the panel clears 4.5:1 in light and dark,
measured against the composited background.

The theme comes from the page, not the machine: an explicit `color-scheme`
first, then the background actually painted, and `prefers-color-scheme` only
when the page says nothing. A page is free to be dark on a light machine, and
plenty are.

Motion is deliberately scarce. Hovering happens hundreds of times a session, so
the canvas has none at all and never will: a dimension line that fades in is
showing a wrong position while it fades. What does move is the panel, the key
list and the colour picker arriving, and the badge stepping out of the ruler
gutter. All of it honours `prefers-reduced-motion`.

---

## Known limits

Three things it cannot see. All follow from hit-testing rather than oversight.

| | |
|---|---|
| `pointer-events: none` | the browser looks straight through these, so a decorative overlay measures as its parent |
| inside an `<iframe>` | a separate document. Hit-testing stops at the boundary and reports the `iframe` |
| closed shadow roots | nothing can pierce them, by design. Open roots work normally |

---

## Development

```bash
npm install
npm run demo        # http://localhost:5173
npm test            # 185 unit tests on the pure logic
npm run typecheck
npm run build       # dist/{align,auto,vite}.js + types
npm run verify:dist # fails if the committed dist/ is stale
npm run size        # fails over 80 KB
```

### The demo pages

`npm run demo` serves four:

| | |
|---|---|
| `index.html` | simple fixtures of known size, for checking a reading against DevTools |
| `complex.html` | twelve hard cases, each stating the numbers it should produce |
| `tokens.html` | tokens and provenance: where a gap came from, which numbers are on the scale |
| `stress.html` | the hard cases, each section stating what the right answer is |

`stress.html` is the one to reach for when changing anything: scaled subtrees,
every shape a grid and a flex row come in, out-of-flow children, scroll
containers, four kinds of moving thing, open and closed shadow roots, tables,
vertical writing modes, and 1500 elements to keep hover honest about what it
costs. Most of the bugs found late were found there.

`examples/next-app` is a minimal App Router app used to verify the SSR guard,
HMR cleanup, and that nothing reaches the production bundle.

### Why `dist/` is committed

Installing from git used to build via a `prepare` script, and modern npm blocks
install scripts by default, so the package silently arrived unbuilt. Shipping
the build removes the dependency on a script running at all.

The cost is that the committed output can drift from the source, so there is a
check for exactly that. Run it before committing:

```bash
npm run verify:dist   # rebuilds and fails if dist/ is out of date
```

To check a change to the packaging itself, install it somewhere real rather than
trusting it:

```bash
npm pack                                    # align-ui-0.1.0.tgz
cd <some other project>
npm i -D <path>/align-ui-0.1.0.tgz
```

`npm pack` produces exactly what a `github:` install resolves to, so if it works
from the tarball it works from the repo.

---

## Credits

Icon paths are [Lucide](https://lucide.dev), inlined rather than depended on.
The tool ships as one file with no dependencies and lives in a closed shadow
root, so an icon package would be a build dependency for ten glyphs and an icon
font a request into someone else's page.

The snapping tolerance, the nudge steps and the `Ctrl` bypass follow what
tldraw, Excalidraw, Penpot and Figma converge on. `\` hides the overlay
because that is the key Figma uses to hide its own UI.

Reading [ruler-mode](https://github.com/timothymaarv/ruler-mode) is what turned
up the missing guard on typing, and the case for a hide toggle that keeps your
state rather than tearing the tool down.

## License

MIT, see [LICENSE](LICENSE), which also carries Lucide's ISC notice.
