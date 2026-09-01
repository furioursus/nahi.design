# Presentation mode

A "Present" button that turns a case study's text-and-image content into a fullscreen, interview-ready slide deck — driven live, not exported to a file. Currently wired into `ibm-data-lineage.astro` only, as a v1; the pattern generalizes to other case studies once it's been used live and refined.

## How it's built

Two pieces:

- **`src/data/presentations/ibm-data-lineage.ts`** — a hand-curated, ordered `Slide[]` array. Slide content is trimmed/reused from the case study's own copy, not auto-derived from the page's existing sections — the pacing is built for presenting out loud, not for browsing. A small discriminated union (`title`, `text`, `image`, `text-image`, `stat`, `quote`) covers everything the story needs; images are imported directly (same `@img` aliases the case study page itself uses).

- **`src/components/Presentation.astro`** — self-contained (markup, scoped styles, and script together, like `LightboxImage.astro`), taking `slides: Slide[]` as a prop. Renders a trigger button and every slide, all pre-built by `slides.map(...)` at build time, wrapped in a `<slide-deck>` custom element registered on `connectedCallback` (the same pattern `Lightbox.astro` uses for `<lightbox-media>`, but a separate element — this is multi-slide and keyboard-navigated, not a single-media zoom).

## Behavior decisions worth knowing about

- **All slides render into the DOM immediately, none are lazy.** `.deck-slides` is a CSS grid with every `.deck-slide` stacked on the same `grid-area: 1 / 1`; only a `.is-active` class (opacity/visibility) marks which one is showing. Slide images get `loading="eager"` on Astro's `<Image>`. This is deliberate: presenting live to a hiring manager is the wrong moment to discover an image is still fetching because it was offscreen a slide ago.
- **`inert`, not `hidden`, marks inactive slides.** `hidden` would remove them from layout — and pull images out of the loading pipeline right when you need them pre-fetched. `inert` drops inactive slides from the tab order and accessibility tree without touching layout or paint.
- **No backdrop-click-to-close**, unlike `Lightbox`. An accidental click during a live presentation shouldn't kill the deck. Escape and the explicit close button are the only ways out.
- **Grid track sizing must be pinned explicitly** (`grid-template-rows: 100%; grid-template-columns: 100%` on `.deck-slides`, plus `height: 100%; min-height: 0;` on each `.deck-slide`). Without it, the browser's default `auto` track sizing lets the grid grow to the height of whichever stacked slide has the *most* content (even the ones currently invisible), pushing the actually-visible slide's content down out of view. Found by inspecting `getBoundingClientRect()` directly — a slide's content was rendering correctly but 1000+px below the fold.
- **`min-width: 0` on every slide-type wrapper** (`.slide-title`, `.slide-text`, `.slide-stat`, `.slide-quote`, `.slide-text-image`, `.slide-image`). These are flex/grid children of `.deck-slide`; without an explicit `min-width: 0` they default to `min-width: auto`, which — for a lone flex/grid item — resolves to content's own max-content size rather than shrinking to the available space. The visible symptom is text that overflows past the slide edge instead of wrapping, even though the container "looks" correctly sized.
- **Focus restoration on close doesn't rely solely on the dialog's native `close` event.** The close button's own click handler calls `trigger.focus()` directly, in addition to the `dialog.addEventListener("close", ...)` fallback (which still covers the Escape-key path). Belt and suspenders — cheap to add, and removes any dependency on event-firing order for the most common close path.
- Keyboard nav: `ArrowRight`/`Space`/`PageDown` advance, `ArrowLeft`/`PageUp` go back, `Home`/`End` jump to the first/last slide. Navigation clamps at both ends rather than wrapping — prev/next buttons disable accordingly.
- Respects `prefers-reduced-motion` for the open/close transition, same convention as `Lightbox.astro` and the ambient-video handling in `BaseLayout`.

## Adding a new case study's deck

Write a new `Slide[]` array in `src/data/presentations/<case-study-id>.ts`, importing `Slide` from `@components/Presentation.astro`, then render `<Presentation slides={...} />` on that case study's page.
