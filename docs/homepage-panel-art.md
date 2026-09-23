# Homepage panel art

**TL;DR** — Each homepage case-study panel is dressed with hand-drawn wireframe sketches, two of Nahi's doodles, and (on three panels) a dimmed employer logo, sitting on a dot grid. Each piece is its own element so it can wobble on hover. The sketches carry a baked-in pencil texture and a slight random tilt; Nahi's doodles carry the same texture at half strength; the logos are left alone. After adding or editing any sketch or doodle SVG, run `npm run art:roughen`.

## What's where

**TL;DR** — layout lives in `src/data/panel-art.ts`, the SVGs in `src/img/panels/`, the styles in `src/styles/homepage-panels.css`.

- **Which art set a panel gets** (`a`–`d`, including which logo) is set per case study by the `wireframe` field in `src/data/case-studies.ts`, not by position, so reordering the lineup keeps each logo with its own case study.
- **Where each piece sits** is `src/data/panel-art.ts`: eight shared slots (top-left, top-right, …) plus a per-set list of which sketch, doodle, and logo fills them, with their sizes. `CaseStudyCard` renders each piece as an `aria-hidden` `<span>` inside a `.panel-art` layer behind the card.
- **Paint order** — `CaseStudyCard` renders the list reversed, so the first piece listed paints on top. That's the order they had when they were stacked `background-image` layers, and it matters where the IBM logo tucks under the top-right sketch.
- **The SVGs** are 39 files in `src/img/panels/`, each exposed as a CSS custom property in `homepage-panels.css` (`--wf-a0`, `--wf-new-doodle`, `--logo-ibm`, …). Each span points its `background-image` at one of those. At build time Vite inlines the small ones (under 4KB) as data URIs and emits the rest as hashed, cacheable files.
- **The dot grid** is still a plain panel background (`data-texture="dots-32"`), under the sketches.
- **Homepage only** — `homepage-panels.css` is imported by `CaseStudies.astro`, so no other page loads it. Until September 2026 the SVGs were inlined as data URIs and the stylesheet was imported site-wide through `global.css`, which put 880KB of homepage art into every page's CSS.
- **The art never sits behind running text** — `CaseStudyCard`'s `.cs-text` column has its own solid `--paper` background.

## Pencil texture and tilt

**TL;DR** — `scripts/roughen-panel-art.mjs` writes an SVG `<filter>` (and, for sketches, a rotation) into each file. It's seeded per filename, so re-running it gives byte-identical output; it never stacks.

| Art | Texture | Tilt |
| --- | --- | --- |
| Wireframe sketches (`wf-a0`–`wf-d7`, 32 files) | full strength | random, −3° to 3° |
| Nahi's doodles (`wf-new-*`, 4 files) | half strength, rescaled to on-screen size | none |
| Employer logos (`logo-*`) | none | none |

The filter has three noise layers, each built from `feTurbulence`:

- **Wobble** — low-frequency noise into `feDisplacementMap`, nudging lines about 2–3px so they stop being ruler-straight.
- **Ink pressure** — slower noise mapped to opacity, so each stroke fades and darkens along its length (averaging ~0.9).
- **Graphite tooth** — ~1px noise through a steep opacity curve, so strokes break up like pencil on paper.

Every file gets its own seeds, frequencies, and strengths, drawn from fixed ranges in the script, so the sketches that repeat across the four panels still look different from each other.

**Doodles are rescaled first.** They're drawn much bigger than they're shown (`wf-new-doodle` is 779 units wide, shown at 212px), and the filter works in the file's own units, so unscaled it would be 2–4× too fine to see. The script divides frequencies and multiplies displacement by each doodle's viewBox-to-screen ratio, then halves the effect. Their on-screen widths are hard-coded in the script's `doodles` map — keep it in sync with `panel-art.ts` if a doodle's size changes.

**Tilt without clipping.** An SVG used as an image is clipped to its own canvas, so a rotated corner can't poke out. The script rotates each sketch about its own centre, then slides it back inside the canvas if a corner would leave it (with a 4-unit margin for the stroke and wobble), and only shrinks it if sliding isn't enough — currently two sketches, by under 0.7%. The bounding-box maths assumes absolute `M`/`L`/`Z` path data, which is all the sketches use; that's also why the doodles (curves) aren't tilted.

**Adding or changing art:** edit or drop in the SVG, run `npm run art:roughen`, and commit the regenerated files. A new sketch must match `wf-[abcd]<digit>.svg` to be picked up; a new doodle needs an entry in the `doodles` map.

## Hover easter egg

**TL;DR** — hovering a sketch or doodle plays one of three short animations at random. Logos stay still.

- **Moves:** wobble (rocks side to side), bounce (hops ~12px with a squash on landing), boing (swells and settles). 650ms each; they always finish, even if the pointer leaves, and hovering again mid-animation is ignored.
- **Where:** one delegated `pointerover` listener in `CaseStudies.astro`, so it only ships on the homepage.
- **Web Animations API, not CSS `@keyframes`** — pinned panels get moved into GSAP's pin-spacers on every refresh, which restarts CSS animations; `element.animate()` survives the move. See [`scroll-flow.md`](scroll-flow.md), "Pin-spacers restart CSS animations".
- **Mouse and pen only.** Touch is skipped so a finger scrolling past doesn't set every sketch off.
- **Logos opt out** with `still: true` in `panel-art.ts`, which renders `data-still` on the span; the listener skips anything carrying it.
- **Pointer layering:** `.cs-panel .panel-inner` has `pointer-events: none` and `.cs-content` turns it back on, so the sketches can be hovered through the empty parts of the content wrapper while the card itself stays clickable.

## Reduced motion

Under `prefers-reduced-motion` the whole `.panel-art` layer is hidden and the panels keep only the dot grid, so there's nothing to hover. The hover script also checks the preference itself and does nothing.
