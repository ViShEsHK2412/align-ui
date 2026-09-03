# Align — measurement tool

Supersedes the audit-tool plan (previous version in git history).

## The change

The tool stops judging. It measures, draws thin lines, and gets out of the way.
Deciding whether 25.5px is wrong is the user's job.

**Out:** violations, clustering, near-miss detection, spacing lint, subpixel
flags, the results panel, tolerance slider, filter tabs.

**In:** hover to inspect, click to pin, dotted edge guides, distance lines
between two elements, a cursor tooltip, and a box model panel bottom-left.

---

## 1. Interaction

| Action | Result |
|---|---|
| `Cmd/Ctrl + Shift + A` | toggle |
| hover | 1px outline on the element under the cursor, dotted guides from its four edges, `160 × 24` tooltip at the cursor |
| click | pin it — outline persists, box model panel opens bottom-left |
| hover with a pin set | distance lines between pinned and hovered, labelled in px |
| `Escape` | clear the pin; again to close |

**Clicks are swallowed while the tool is on.** Click means "pin", so it can't
also reach the app — same as DevTools inspect mode. Toggle off to use the page.

---

## 2. Visual design

### 2.1 Colour — OKLCH, `light-dark()`, Fluid Functionalism tokens

Every colour is written once as `light-dark(light, dark)` and flipped by
`color-scheme: light dark` on the panel root (Fluid rule 7). Values are the
Fluid tokens converted to OKLCH.

| Token | Light | Dark | Source |
|---|---|---|---|
| `--surface` | `oklch(1 0 0)` | `oklch(0.264 0 0)` | Fluid surface-3 / `--card` |
| `--fg` | `oklch(0.205 0 0)` | `oklch(0.97 0 0)` | `--foreground` |
| `--muted` | `oklch(0.556 0 0)` | `oklch(0.715 0 0)` | `--muted-foreground` |
| `--border` | `color-mix(in oklab, var(--fg) 12%, transparent)` | same formula | `--border` |
| `--accent` | `oklch(0.693 0.161 265.2)` | same | `--focus-ring` (#6B97FF) |
| `--measure` | `oklch(0.637 0.208 25.3)` | `oklch(0.711 0.166 22.2)` | `--destructive` |

Box model bands are a derived family — **one lightness, one chroma, four hues**,
so no band reads heavier than another (better-colors: equal C% for consistent
vividness):

| Band | Colour |
|---|---|
| margin | `oklch(0.72 0.13 70)` |
| border | `oklch(0.72 0.13 250)` |
| padding | `oklch(0.72 0.13 150)` |
| content | `oklch(0.72 0 0)` |

Canvas can't evaluate `light-dark()`, so `overlay.ts` resolves the pair once via
`matchMedia('(prefers-color-scheme: dark)')` and listens for changes.

### 2.2 Line work

Nothing thicker than 1px. Keeps the existing `translate(0.5, 0.5)` grid offset so
strokes land on a pixel instead of straddling two.

| Element | Style |
|---|---|
| Hovered outline | 1px solid `--accent` @ 70% |
| Pinned outline | 1px solid `--accent` |
| Edge guides | 1px **dotted** `--measure` @ 70%, `[2, 2]` dash, spanning the viewport from each of the hovered element's four edges |
| Distance lines | 1px solid `--measure`, 5px perpendicular end caps, label at midpoint |

### 2.3 Typography

| Property | Value | Why |
|---|---|---|
| Family | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | numeric readout; system stack, no font to load |
| **`font-variant-numeric: tabular-nums`** | on every number | numbers change on each mousemove; proportional digits jitter the tooltip. The single highest-value detail here |
| Scale | 12px header · 11px numbers · 10px band labels | |
| Tracking | `0.01em` on the 10px labels | small text needs positive tracking |
| Line-height | `1` on readouts, `1.4` on the header | |
| `font-synthesis: none` | | no faked bold from a missing weight |
| `-webkit-font-smoothing: antialiased` | on the panel root | |
| `user-select: none` | whole overlay | it's chrome, not content |

Sizes sit below the 12px floor in better-typography. Deliberate: this is a
developer HUD over someone else's page, the same class of surface as DevTools'
own 11px chrome, and it must occlude as little as possible. Contrast still
clears AA — `--fg` on `--surface` is far past 4.5:1 in both themes.

### 2.4 Surfaces

Panel is Fluid **surface-3** with the matching level-3 shadow (light: stacked
drops; dark: inset highlight + ring + drops). Shadows, not borders.

**Concentric radius** — outer = inner + padding. Panel `12px` with `10px`
padding gives inner rectangles `2px`, which is also just right for a box model
diagram: these are boxes, not cards.

---

## 3. Motion

`find-animation-opportunities` gate applied to every candidate. Default is no.

| Candidate | Frequency | Verdict |
|---|---|---|
| Hover outline / guides / tooltip | hundreds per session | **Reject.** Instant. Motion here is friction on every single use |
| Hotkey toggle | keyboard-initiated | **Reject.** Never animate a keyboard action — Raycast precedent |
| Distance lines appearing | hundreds per session | **Reject.** Instant |
| Panel values changing on re-pin | frequent, information-critical | **Reject.** Data-dense UI defaults to static |
| **Box model panel enter/exit** | occasional — a few times per session | **Accept.** One animation |

So the tool has **exactly one animation**. That is the correct outcome, not an
oversight.

**Panel entrance.** Fluid tier `spring.moderate` — a panel that must land
exactly. No motion library here, so the CSS equivalent:

```css
/* enter: 160ms, critically damped, strong ease-out */
transition: transform 160ms cubic-bezier(0.2, 0, 0, 1),
            opacity   160ms cubic-bezier(0.2, 0, 0, 1);
transform: translateY(4px) scale(0.98);   /* → none */
opacity: 0;                                /* → 1 */
```

Exit is one tier quicker at **120ms**, no bounce — slow in, faster out (Fluid
rule 2). Transform and opacity only, so it stays on the compositor. Never
`transition: all`. Starts at `scale(0.98)`, never `scale(0)`.

**Reduced motion.** Fluid rule 5 — fewer and gentler, not none: keep the opacity
fade (it aids comprehension), drop the transform.

```css
@media (prefers-reduced-motion: reduce) {
  .panel { transition: opacity 120ms linear; transform: none; }
}
```

This is where Fluid and the animations.dev course disagree — the course says
`animation: none` outright. Following Fluid, since the ask was to keep the
design consistent with it.

---

## 4. Box model panel

Bottom-left, 16px inset, 232px wide.

```
┌─ div.card ─────────── 160 × 24 ─┐
│           margin 24             │
│  ┌───── border 1 ───────────┐   │
│  │  ┌── padding 16 ──────┐  │   │
│  │  │    128 × 20        │  │   │
│  │  └────────────────────┘  │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

- Values from `getComputedStyle`, all `tabular-nums`.
- Zeros render as `–` in `--muted` so the numbers that matter stand out.
- Header: element label left, `W × H` right.
- Bands tinted at 14% of their hue; label sits on the band it describes.

---

## 5. Architecture

```
align/
  index.ts      init, hotkey, hover/pin state, lifecycle    ~110 lines
  overlay.ts    canvas: outlines, guides, distances, tooltip ~150 lines
  boxmodel.ts   the bottom-left panel                        ~110 lines
  measure.ts    pure geometry + computed-style reads          ~80 lines
  theme.ts      OKLCH tokens, light/dark resolution           ~40 lines
  types.ts      Box, Segment, Bands                           ~25 lines
  config.ts     ignore selector, hotkey                       ~20 lines
```

**Deleted:** `cluster.ts`, `cluster.test.ts`, `panel.ts`, **`scan.ts`**.

`scan.ts` goes because nothing needs a DOM walk any more: guides come from the
hovered element's own rect, distances from exactly two elements. Measuring on
demand through `elementFromPoint` also removes the cache, the `MutationObserver`,
the stale state and the rescan affordance. Nothing is stored, so nothing can go
stale — an animating page can no longer show a wrong number.

Rules that survive: only `overlay.ts` / `boxmodel.ts` write to the DOM; only
`index.ts` touches window globals and `import.meta.hot`; geometry in `measure.ts`
stays pure and unit-tested.

Expected bundle: **~8KB**, down from 16.7KB.

### On Base UI

Not usable here, and I'd rather say so than pretend. Base UI is
`@base-ui/react` — React components. This tool is zero-dependency vanilla TS
injected into arbitrary host pages inside a **closed** shadow root; adding React
plus Base UI means a peer React in every host app and a bundle five-plus times
the size, for two static panels with no popover, focus-trap, or keyboard-nav
behaviour to manage.

What I do take is its **structural model**, applied to plain DOM: named anatomy
parts, state expressed as data attributes (`[data-pinned]`, `[data-empty]`)
styled by attribute selectors rather than class toggling, and geometry passed as
CSS custom properties. If you want the real Base UI components, the panel would
have to become a React island — say so and I'll do it that way.

---

## 6. Build order

Each step ends with something you can open and use.

**Step 1 — Strip and re-point.**
Delete the four files. Cut `Box` to geometry plus label, `Config` to
`{ ignore, hotkey }`. Rebuild `index.ts` around hover state; add `theme.ts`.
*Ships:* hover draws a 1px outline and the tooltip.
*Check:* hovering anything on the demo outlines it and reads its true size;
tooltip numbers don't jitter as the cursor moves.

**Step 2 — Guides, pinning, distances.**
Dotted edge guides on hover; click to pin; distance lines with end caps and px
labels between pinned and hovered.
*Check:* the demo's 13.5px fixture reads exactly 13.5; guides are crisp 1px;
Escape clears the pin before it closes the tool.

**Step 3 — Box model panel.**
`boxmodel.ts` into the same shadow root, with the one animation.
*Check:* every number matches DevTools' computed panel including fractions;
panel enters in 160ms and leaves in 120ms; reduced-motion drops the transform
but keeps the fade; light and dark both legible.

**Step 4 — Tests, docs, verification.**
Move unit tests onto `measure.ts` geometry (overlapping, diagonal, touching,
fractional). Rewrite README. Re-run what still applies from the old Phase 6:
30 saves leave one host and one listener, `next build` ships nothing, both
example apps work.

---

## 7. Open points

- The demo keeps its 25.5px card and 13.5px gap — no longer "defects", now
  fixtures with known exact values to measure against.
- Scroll and resize recompute from fresh rects for the two live elements. Cheap
  enough to run directly, no debounce.
- `data-align-ignore` still works: if the hit element carries it, walk up to the
  nearest ancestor that doesn't.
- **Guide legibility over arbitrary pages.** A dotted red line at 70% can get
  lost on a red hero. Starting simple, as asked; if it bites, the fix is a 1px
  dark halo under each guide, which is a few lines in one function.

---

# Guides (custom lines)

Lines you place yourself, to check things line up against.

## Model

```ts
interface Guide { id: number; axis: 'x' | 'y'; at: number }
```

`at` is a **page** coordinate, like the rulers — a guide stays on the same part
of the document as you scroll, rather than floating in the viewport.

They live for the session: kept across toggling the tool off and on, gone on
reload. Nothing is written to the host page's storage, which keeps the "nothing
is stored, so nothing can go stale" property intact.

## Placing

**Drag out of a ruler.** Pull down from the top ruler for a horizontal line,
right from the left ruler for a vertical one — the axis is implied by where the
drag started, so there is nothing to remember. Release back inside the ruler to
cancel.

**Or press a key**, for when the rulers are off:

| | |
|---|---|
| `V` | vertical line at the cursor |
| `H` | horizontal line at the cursor |

Two keys rather than one key plus shift: told to "press G", anyone types a
capital G, so the modifier that was meant to pick the axis gets held by reflex
and every guide comes out horizontal.

## Snapping

While placing or moving, a guide snaps to the edges of whatever is under the
cursor when it comes within 4px — so a guide meant to sit on a card's edge sits
*on* it, rather than a pixel off and quietly lying. Hold `Alt` to place freely.

## Moving and removing

- Hover within 5px of a guide to pick it up; it brightens.
- Drag to move it. Drag it into a ruler to delete it.
- `Delete` or `Backspace` removes the guide under the cursor.
- `Shift + Delete` clears them all.

## Measuring

A guide is not just a line to eyeball. When you hover an element, the nearest
guide on each axis draws the gap between them and labels it — at most two extra
lines, so it answers "is this aligned to my guide" with a number without
crowding the screen. A guide passing *through* the element draws nothing, since
there is no gap to report.

## Drawing

1px, in a hue of its own — measurements are red and the selection is blue, so
guides are teal and can't be confused with either. Dimmed slightly at rest,
full strength when the cursor is on one. Each guide also marks its position on
the rulers.

## Precedence

`mousedown` resolves in this order, so the gestures never fight:

1. inside a ruler gutter → start a new guide
2. within grab range of a guide → move that guide
3. otherwise → the existing lock behaviour

---

# What to take from Mesurer and GuideFrame

Both were read at source (Mesurer `005f9fa`, GuideFrame `aee6735`, both MIT).
The filter for this list is narrow on purpose: it has to be a **measurement**
feature, it has to state a fact rather than pass a verdict, and it has to be
small enough that the tool still reads as one idea. Mesurer is 11,889 lines and
GuideFrame ~3,200 against our 2,408; most of that difference is things we should
not want.

## Taking

**1. Gap provenance.** A measured gap also says where the number came from:
`24 · gap 24 · margins 0`. A bare 24 leaves the only question that matters
unanswered — flex `gap`, margins, or both. Reads `getComputedStyle` on the
shared parent and compares each side's margins. Pure and testable. ~40 lines.

**2. Snapping says what it caught.** Today `snapTo` returns a bare number, so a
snapped guide and a nearly-snapped guide look identical — the exact failure
snapping exists to prevent. It returns a labelled result instead, and the
guide's chip reads `x 760 · card left`. ~30 lines on top of point 3.

**3. Snap to more than the hovered box.** We only offer that box's left and
right edges. Add its centre, and every other guide, as candidates with a
priority so edges beat centres on ties. ~40 lines.

**4. Distance connectors.** When two locked elements are offset on the other
axis, the gap line ends in empty space beside the second one — correct number,
but it never visually reaches what it measures. A short perpendicular stub joins
them, the way a dimension line works on a drawing. We have this bug now.
~25 lines in `gapSegments`.

**5. Guides survive a reload.** `localStorage`, namespaced by `location.pathname`
so guides drawn on one route stay there, and every entry validated on read so a
stale value can never throw at startup. ~50 lines.

**6. Arrow-key nudge.** Arrow moves the selected guide 1px, Shift+Arrow 10px.
Removes the mouse from the loop once a guide is roughly placed. ~30 lines.

**7. A locked guide.** One you can select but not nudge or delete. Matters as
soon as you have a reference guide you keep almost-dragging. ~15 lines.

**8. Undo the last guide wipe.** Shift+Del already clears every guide, and there
is no way back. One level of undo for that one action — not a command history.
~20 lines.

**9. Gap distribution, without the verdict.** Measuring several gutters at once
can report `24 ×3, 18 ×1`. GuideFrame appends `· inconsistent`; we stop before
that. The distribution is a fact, the grade is the violation detector we deleted
on day one. ~25 lines.

**10. Copy the reading.** One key puts the current measurements on the clipboard
as text. The numbers are the output of this tool and right now the only way out
of it is retyping them. ~20 lines.

## Deciding separately

**CSS-variable provenance.** Mesurer traces a computed value back to the
`var(--x)` that produced it, so a readout can say `16 (--space-4)` — it tells you
*where to change it*, which is the natural end of "where did this number come
from". Genuinely valuable with design tokens, and by far the most expensive item
here: it walks the CSSOM and handles inheritance (~200 lines, and it is the one
thing on this page that could go stale against browser behaviour). Worth doing,
worth doing on its own.

## Not taking, and why

- **Screenshots, colour picker, X-ray, draggable toolbar** — good features, not
  measurement. They are most of why Mesurer is five times our size. Mesurer's
  purpose is feeding context to coding agents, so a region screenshot is its core
  loop; here it would be a second product sharing a toolbar.
- **A settings panel.** Every setting is a decision refused. Guide colour, dash
  pattern, ruler opacity each have one right answer today, which is why there is
  no panel.
- **Layout grid overlay** (columns, gutters, breakpoints). A different job —
  checking a design grid, not measuring what rendered.
- **Undo/redo as a command history.** Point 8 covers the one destructive action.
  A general history is a state model the tool does not otherwise need.
- **React.** Mesurer requires it. GuideFrame split a core out to avoid it. We
  never had it, and that is the one place we are unambiguously better placed than
  the bigger tool.

## Order

1 needs the box-model reader that already exists, so it can go first or last;
everything else is cheap. The dependency that matters: **3 before 2** (candidates
before labels), and **7 before 6** (lock before nudge, since a click currently
both selects and locks).


---

# Build plan: everything from the teardown

Fourteen items, decided together. This is the design that has to be settled
before any of them is written, because several of them want the same surface and
would otherwise be built twice.

## Budget

`dist/align.js` is 29,286 bytes against a 32,768 cap with 3.4KB of headroom, and
this is roughly 8KB of new code. The cap moves to **49,152** (48KB). It was our
own number, not anyone's requirement, and the tool is private — but a budget only
means anything if raising it is a decision, so: raised once, deliberately, here.
No lazy chunk. One bundle stays simpler and nothing about a dev-only tool
justifies the split.

## The one surface rule

Four new readouts want somewhere to live — typography, token matches, gap
provenance, a picked colour. They all go in the box model panel, which becomes
*the* readout, gaining sections that appear only when they have something to say.
Nothing new floats.

The canvas stays exactly as clean as it is now. Provenance and distribution are
**panel** facts, not label text — a gap line still reads `24` and nothing more.
This is the whole reason the canvas is legible at density and it does not get
spent on prose.

## Guides gain a keyboard target, not a selection model

Today: hover measures, click locks, Del removes the one under the cursor. Arrow
nudge cannot target "the guide under the cursor" because nudging moves it out of
grab range within ten presses.

So the guide most recently clicked or dragged becomes the **keyboard target**.
That is not a new user-facing concept — clicking already does something, this
adds keyboard reach to the thing you just clicked. Arrows nudge it, `L` pins it.
Esc clears it along with everything else.

Two flags on a guide, deliberately named apart:

| Flag | Set by | Means |
|---|---|---|
| `locked` | click | keeps measuring after the pointer leaves |
| `pinned` | `L` | cannot be dragged or deleted |

## Keys

Free letters, no collisions with the eleven bindings already in use.

| Key | Does |
|---|---|
| `X` | x-ray: outline every element on the page |
| `T` | typography readout in the panel |
| `P` | pick a colour from anywhere on screen |
| `C` | copy the current reading to the clipboard |
| `L` | pin / unpin the keyboard-target guide |
| arrows | nudge that guide 1px, 10px with Shift |
| `Ctrl/Cmd+Z` | restore the guides last deleted |

The help list goes from 15 rows to 22. It already caps its height and scrolls.

## What persists

Guides per `location.pathname`, so guides drawn on one route stay there. Rulers
and the panel position globally. Every entry validated on read — a hand-edited or
stale value must never throw at startup.

Modes do not persist. X-ray, typography and the picker all start off; a tool that
reopens in a mode you forgot you left it in is a tool that appears broken.

## The fourteen

### Measurement

1. **Gap provenance.** Every gap between two siblings reports where the number
   came from — `24 · gap 24 · margins 0`. Panel only.
2. **Gap distribution.** With several gaps measured: `24 ×3 · 18 ×1`. The
   distribution is a fact; the grade GuideFrame appends is not, and we stop
   before it.
3. **Named snapping.** `snapTo` returns a labelled result instead of a bare
   number; the guide chip reads `x 760 · card left`. Today a snapped and a
   nearly-snapped guide are indistinguishable, which is the exact failure
   snapping exists to prevent.
4. **More snap candidates.** Element centres and every other guide, each with a
   priority so edges beat centres on ties.
5. **Distance connectors.** A perpendicular stub joining a gap line to an element
   it does not reach. A bug we have now, visible whenever two locked elements are
   offset on the other axis.
6. **Persistence.** As above.
7. **Pinned guides.** `L`.
8. **Nudge.** Arrows, 1px and 10px.
9. **Undo.** One level, covering `Del` and `Shift+Del`. Not a command history.
10. **Copy the reading.** `C` puts the panel's numbers on the clipboard as text.

### Inspection

11. **Typography.** Family, size, weight, line-height, tracking, shown only when
    the locked element holds text. Line-height is spacing, so this closes a real
    gap rather than adding a second product.
12. **Token matching.** Every distinct number in the element gets checked against
    the custom properties in scope: `16 --space-4 · 13 no match`. It compares
    values, so the wording is **matches**, never *from* — a hardcoded 16 matches
    too, and surfacing that is the point.
13. **X-ray.** One stylesheet on the host document, one exclusion for our own
    host. Our overlay is in a closed shadow root, so the page rule cannot reach
    inside it — no exclusion list needed, unlike Mesurer's.
14. **Colour picker.** Native EyeDropper, then hex / rgb / hsl / oklch, each row
    click-to-copy. The conversion chain is real work: sRGB to linear, linear to
    LMS, LMS to OKLab, OKLab to polar.

## Order

Dependencies first, bug fixes before features, the expensive readout last.

1. Raise the budget — otherwise every later step fails the build
2. Snap candidates, then labels (4 then 3) — pure, lands with tests
3. Connectors (5) — a bug we have now
4. Persistence (6)
5. Pin, nudge, undo (7, 8, 9) — pin first, it decides what the others target
6. Typography and token matching (11, 12) — the panel grows here
7. Gap provenance and distribution (1, 2) — wants the panel from step 6
8. Copy (10) — wants everything it will be copying
9. X-ray (13)
10. Colour picker (14)

## Testing

A second hard-cases page, `tokens.html`, seeded with a real design-token set,
deliberate off-scale values, flex and grid gaps against equivalent margin
spacing, and text at sizes whose line-heights are and are not on the scale. Every
expected number stated in the page, the way `complex.html` does it.


## Progress

Shipped and verified in a browser: named snapping with more candidates,
extension lines, persistence, nudge and pin, token matching, gap provenance,
and the `tokens.html` fixtures for all of it.

Built, unit-tested, and deliberately **not** shipped until each has been walked
through in a browser: undo, the type readout, copy, x-ray, and the colour
picker with its four-format conversion. Holding them back is the point — a
measuring tool that reports something it has never been watched reporting is
the one kind of bug it cannot afford.

---

# The workbench: twelve features and a toolbar

Decided after reading six tools at source — mesurer, guide-frame, dialkit,
interface-kit, agentation, and the Interaction Lab prompt. The infinite canvas
is specced separately; nothing here depends on it.

## What this is for

The loop this serves is: **ask an agent for UI, look at it, find what is wrong,
say what is wrong.** Everything below earns its place by helping one of those
four steps. A feature that helps you admire the page is not in scope.

## Design system

**Agentation's, rebased.** Chosen over dialkit for one disqualifying reason:
dialkit is glassmorphic, and a `backdrop-filter: blur(20px)` panel sits over
the thing being measured and smears it. Every other tool in that list can
afford blur because none of them ask you to judge a 1px edge through the panel.

The thing that made this an easy choice: agentation's surfaces are **white
alpha over an opaque ground**, not fixed greys. That model is theme-portable by
construction — the same alphas over a light ground give light mode for free. So
taking it costs us nothing, where taking dialkit's would have.

### Tokens

| | Value | From |
|---|---|---|
| Ground | `#1a1a1a` dark · near-white light | agentation |
| Surface ladder | alpha over ground: `.07 .08 .10 .12 .15 .20` | agentation |
| Text | alpha: `.9` primary · `.6` secondary · `.4` tertiary | agentation + dialkit's explicit third level |
| Shadow | `0 2px 8px rgb(0 0 0 / .2), 0 4px 16px rgb(0 0 0 / .1)` | agentation |
| Spacing | `2 · 4 · 8` px | agentation |
| Row height | `36px`, one constant | dialkit |
| Type | `13 · 11 · 10` px | agentation |
| Gamut | sRGB, then `color(display-p3 ...)` behind `@supports` | agentation |
| Expand | `width` 400ms `cubic-bezier(0.19, 1, 0.22, 1)` | agentation |
| Entrance | 500ms `cubic-bezier(0.34, 1.2, 0.64, 1)`, slight overshoot | agentation |

Replaces Fluid Functionalism's opaque eight-step ladder. Same idea — depth by
surface rather than by border — expressed as alpha, which is what makes it work
in both themes from one set of numbers.

### Two things kept from before, deliberately

**Square corners.** Both source systems use 8-22px radii. Radius 0 was an
explicit instruction for this tool and it still reads as an instrument rather
than an app. Adopting their radii would undo it for no gain.

**Inter.** Both use system-ui. Inter with `tabular-nums` was an explicit
instruction, and tabular figures are not optional in a tool whose entire output
is columns of numbers.

### Not taken

agentation's defensive CSS reset — 30 lines of `:where(button, input, ...) {
background: unset; ... }`. It portals into `document.body`, so host page globals
leak in and must be unset. We are in a closed shadow root and the page cannot
reach us.

## The toolbar

mesurer solves feature sprawl with a mode palette — two groups, `inspect` and
`annotate`, in 1,204 lines. Wrong shape for us, because **almost nothing we
have is a mode.** Sorted by kind:

| Kind | Behaviour | Members |
|---|---|---|
| **Layers** | independent, stack freely | rulers, layout grid, pixel grid, x-ray |
| **Page state** | changes the page, not the view | freeze, and scrub while frozen |
| **Readouts** | what the panel says about the locked element | box model, type, tokens, gaps, source |
| **Actions** | one-shot | copy, pick colour, undo, clear guides |

So it is a **layers bar**, not a tool palette: toggles that stack rather than
tools that exclude one another.

**It grows out of the badge.** The badge already sits top-right and already
reads `Align · 2 locked`. It expands into a row rather than us inventing a
third surface — the panel is the readout, the badge is the controls, and there
is no third thing.

```
Align   ▦ ▤ ⊞ ◫  │  ❄ freeze  │  ⧉ ⊙ ↺   2 locked
        └ layers ┘  └  state  ┘  └ actions ┘
```

- Layers are toggles, each with its own on-state, because they are independent.
- Freeze sits in its own compartment with a stronger on-state: it is the only
  control that changes the page rather than the overlay. Its scrub track appears
  beside it only while frozen.
- Readouts never appear here. They are sections in the panel, which is how
  type, tokens and gaps are already built.

**Every control shows its key on hover.** The toolbar does not replace the
keyboard, it teaches it — the same job the key list does, discoverable by
pointing instead of remembering. Clicking the badge still opens the full list.

This is also the argument against a settings panel, for the third time: nearly
everything one would hold is a layer toggle, and layer toggles now have a home.

**The risk to watch.** Panel bottom-left, toolbar top-right, measurements
everywhere between. Build it, then deliberately measure something in the
top-right corner and see whether it is in the way.

## The twelve

Grouped by which step of the loop each serves.

### See — find what is wrong

1. **Freeze** *(agentation)*. Patch `setTimeout`, `setInterval` and `rAF`;
   inject `animation-play-state: paused`; pause running WAAPI animations only,
   since pausing finished ones restarts them on `play()`; pause video; queue
   what was skipped and replay it on unfreeze. Hover states, open dropdowns,
   toasts and loading skeletons are currently unmeasurable. This is what makes
   them measurable, and it is the cheapest large win here.

2. **X-ray** *(mesurer)*. One stylesheet. `outline`, never `border`, so layout
   cannot move. Neutral grey, because structure is not a measurement, a
   selection or a guide. One exclusion — our own host — since a page rule
   cannot reach into a closed shadow root.

3. **Layout grid** *(guide-frame)*. Columns, gutter, margin, per breakpoint.
   A reference to measure against; the same category as a guide.

4. **Pixel grid** *(prompt)*. One uniform tier, fading out below ~8px on
   screen. Their note is emphatic that two tiers were tried and rejected: the
   grid must read as a single texture.

### Measure — get the number

5. **Canvas-true measuring.** `measure.ts:24` is the only place a rect is read
   for measurement, so teaching the tool to measure inside a transformed
   subtree is one function plus a few boundary conversions. Needed for our own
   canvas apps regardless of anything else here, and the fix that stops a gap
   inside a zoomed canvas reading 30 when it is 20.

6. **Field-consensus corrections** — *snap tolerance, dashed extensions and
   the Ctrl bypass are done. Two are deliberately deferred: d3 ruler ticks earn
   nothing until a camera zoom exists, since our rulers draw page px at 1:1 and
   fixed 10/50/100 is currently correct; nudge-undo coalescing waits for undo to
   come off the branch.* *(the prompt, citing tldraw, Excalidraw,
   Penpot and Figma source)*. Snap tolerance `8 / zoom`, not our flat 4. Ruler
   ticks at the nice step `1/2/5 × 10ⁿ` spanning ≥ 56 screen px, rather than a
   fixed 10/50/100. Extension lines dashed, the way Figma draws them. `Ctrl` to
   bypass snapping, which is what Figma and guide-frame both use where we use
   `Alt`.

### Explain — why it is that number

7. **CSS rule and file** *(mesurer's technique)*. `set by .card in
   cards.css:42`. The missing link: it turns a measurement from an observation
   into an instruction. Reports **candidate** rules and never a verdict — the
   cascade cannot be re-derived reliably, and `:is()`, `:where()`, cascade
   layers and cross-origin sheets each defeat it.

8. **Colour tokens.** Numbers are already matched against the custom properties
   in scope; nothing matches *colours*. This is the exact failure mode of
   agent-written CSS — a `#6ea8fe` one notch off the brand blue, invisible by
   eye and obvious to a comparison.

9. **Parent diagnostics** *(guide-frame)*. When the locked element sits in a
   flex or grid container, show the container's resolved tracks and its real
   gaps. Half the time the number is strange because the parent decided it.

10. **similarCount** *(interface-kit)*. Six other elements match this selector —
    known before you touch it rather than after.

### Fix — change it and hand it back

11. **Diffs, not edits** *(interface-kit)*. Record `padding-left: 16 → 20`,
    revertable one at a time or wholesale. This is why the editor built in an
    earlier session felt wrong: an editor was built where the right object was
    a diff. Element-level, and token-level — change `--space-4` and everything
    using it moves at once.

12. **Copy out.** Already shipped as `C`. dialkit states the philosophy the
    whole of section 4 rests on: **preview, copy, replace.** The tool is never
    the source of truth.

## Build order

Foundational first, then the thing that unlocks the most, then the rest.

**0. Land the branch.** `wip/inspection` already holds the type readout, copy,
undo, x-ray and the colour picker, built and unit-tested but never watched
working. Two of them — x-ray and the type readout — are on the list of twelve.
Verify them in a browser and merge before building anything new, or the same
work gets done twice.

**1. The design system.** `theme.ts` moves from Fluid's opaque ladder to the
alpha-over-ground model, gains a third text level and a row constant, and picks
up the p3 enhancement. Everything visual sits on this, so it goes before the
toolbar rather than after.

**2. The toolbar.** Grown out of the badge, with the expand curve from
agentation. It is where every later feature is switched on, so building it early
means each one arrives with a home instead of a new key nobody remembers.

**3. Freeze.** The largest single win, and independent of everything above.
Turns hover states, open dropdowns, toasts and loading skeletons from
un-measurable into measurable.

**4. Colour and type tokens.** Extends the matching already shipped for
numbers. Catches the exact failure of agent-written CSS: values that are almost
right.

**5. CSS rule and file.** Turns a measurement into an instruction.

**6. The rest**, in the order they stop being blocked: canvas-true measuring,
the field-consensus corrections, layout and pixel grids, parent diagnostics,
`similarCount`, then diffs.

Steps 1 and 2 are scaffolding; 3, 4 and 5 are the three that would be built
first if only three ever got built.

## If only three get built

**Freeze**, **colour and type tokens**, and **CSS rule and file**. With what is
already on `main`, the tool then answers *is it right · is it on system · where
do I change it*, which is the whole of what needs saying back to an agent.

## Still deliberately out

- **dialkit's parameter panel** — needs hooks wired into your components.
  Everything else here works on a page it has never seen.
- **Annotations: arrows, pen, text** — mesurer's direction, and right for
  mesurer, whose job is passing feedback to a person. A whole second UI.
- **Screenshots** — only worth it if they are being sent somewhere.


## Progress, after the toolbar

Built and verified: freeze, x-ray, type readout, copy, undo, colour picker,
colour tokens, similarCount, CSS rule and file, and the toolbar itself. Three
of the five field-consensus corrections. The design system is rebased.

All twelve are built and verified in the browser. The last five went in as:
canvas-true measuring, the layout grid and the pixel grid, parent flex/grid
diagnostics, and diffs.

Three things came out of building them that were not in the plan.

- **The theme has to be read off the page, not off the machine.** The demo is
  hard-coded dark on a machine set to light, and the tool was drawing a 14%
  black hairline on a near-black ground. `prefers-color-scheme` is a statement
  about the viewer, and the overlay's question is about the page. Now it reads
  an explicit `color-scheme` first, then the background actually painted, and
  falls back to the media query only when the page says nothing. The same
  answer is set inline on the shadow host, so the canvas and the panels'
  `light-dark()` cannot disagree.

- **`alpha()` cannot fade a colour that already has one.** It appends
  `/ a`, so a faded `rulerLine` came out as `oklch(... / 0.28 / 0.5)` — which
  does not parse, and which canvas answers by silently keeping the last colour
  it was given. The pixel grid was drawing in the guide hue. It has its own
  token now.

- **A grid centres in the layout viewport, not `innerWidth`.** A classic
  scrollbar takes width from what the browser centres in, and half a scrollbar
  is exactly enough to make a correct layout look wrong.

Two corrections still wait on a camera zoom that does not exist yet: d3-style
ruler ticks, and coalescing a run of nudges into one undo.
