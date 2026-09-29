# View as deck

**TL;DR** — "View as deck" on a case study opens a fullscreen 16:9 slide deck generated from the page's own markup when it opens, in document order. There's no slide list to maintain: mark content up with the kit components (see [`case-study-kit.md`](case-study-kit.md)) and it shows up. All of it is `src/components/DeckLightbox.astro`, styled in `site-kit.css`.

Every case study page has a "View as deck" button in its topbar (and a sticky mobile CTA bar) that opens a fullscreen, 16:9 slide deck built from the page's own content. There's no separate slide list to author or keep in sync — the deck is generated at open time by scanning the page's DOM for already-marked-up content, in document order.

## How it's built

**TL;DR** — On open, a script scans the page for six kinds of marked-up content and builds one slide per match, after a generated title slide.

`DeckLightbox.astro` renders the modal markup (`.deck-lb`, the canvas, the thumbnail rail, prev/next controls) plus one inline `<script>` that does the work. When a visitor clicks "View as deck", the script queries the page for:

- `.pull` — quote blocks become quote slides
- `figure[data-deck]` — figures marked `data-deck="image"` become image slides; a figure holding a `video` (a looping, muted screen recording passed via `Figure`'s `video` prop instead of `src`) is rebuilt as a `<video data-ambient>` on its slide too, and `playAmbient` starts it only when the visitor hasn't set `prefers-reduced-motion` — the deck's canvas is `innerHTML`'d in after `BaseLayout`'s load-time play pass has already run, so it has to do this itself
- `[data-deck="strip"]` — a `Strip` or `ProcessColumns` marked this way becomes a side-by-side (or stacked, with `data-deck-stack`) slide of its frames; `data-deck-solo` instead gives each frame its own full-size slide
- `[data-deck="pair"]` — an `ImagePair` becomes a two-up slide, each cell keeping its own caption
- `.deck-stat` — a `<strong class="deck-stat">` wrapped around a sentence inside a paragraph (or the `Pivot` thesis line) becomes a statement slide
- `.metrics` — a `Metrics` grid becomes a metrics slide

A title slide is always generated first, built from the page's `<h1>`, eyebrow tags, and the first sentence of the lede.

Every one of these lives in document order, so the deck always mirrors the reading order of the case study. Optional `data-deck-label`, `data-deck-eyebrow`, `data-deck-foot`, and `data-deck-caption` attributes (set by the component props — see `Figure`, `Strip`, `ProcessColumns`, `ImagePair`, `Pivot`) override the slide's rail label, eyebrow, footer, or caption where the section heading isn't the right default.

## Controls

- Arrow keys move between slides, Esc closes, and focus returns to the button that opened it. At phone width the arrows give way to swipe, and the topbar trigger becomes a sticky bar at the bottom of the page. `body:has(.deck-cta)` gets 76px of bottom padding so the bar never covers the end of the page; it's scoped with `:has()` because pages without the bar (homepage, About, CV) would otherwise end on a blank 76px strip below their closing panel.
- A thumbnail rail under the canvas jumps to any slide.
- The lightbox is the only fixed-dark surface on the site, by design. Slide type is sized in `cqw` so it scales with the canvas.

## Adding a new case study

Nothing to wire up — see [`case-study-kit.md`](case-study-kit.md), "Adding a case study". `CaseStudyLayout` renders one `DeckLightbox` per page.

## Retired: the old click-to-zoom lightbox and presentation mode

**TL;DR** — Two older features were removed in the Sept 2026 "Techo" redesign. Don't bring them back; the deck covers both.

The "Techo" redesign (Sept 2026) replaced two older, more limited features with this one:

- The old `Lightbox`/`LightboxImage`/`LightboxVideo` click-to-zoom system, which enlarged a single screenshot or About-page video on click.
- `Presentation.astro`, a bespoke `<slide-deck>` custom element used only on the IBM case study, backed by a hand-authored `Slide[]` list in `src/data/presentations/`.

Both are gone. The deck lightbox covers the same "let someone skim the highlights" need for every case study at once, without a slide list to maintain per page.
