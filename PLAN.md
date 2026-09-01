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
