# Case study component kit

**TL;DR** — Every case study page (`src/pages/case-studies/*.astro`) is composed by hand from the same ten components, wrapped in `CaseStudyLayout`. There's no content collection and no slide list: the page's own markup is the content, the deck (see [`deck-lightbox.md`](deck-lightbox.md)), and the topbar's section labels. Styles for all of it live in `src/styles/site-kit.css`. To add a case study, copy an existing page and follow "Adding a case study" at the bottom.

## Page skeleton

**TL;DR** — `hero` slot, then `<section id>` blocks with numbered heads, then `NextCaseStudy` in the `close` slot.

```astro
<CaseStudyLayout title={title} description={description}>
	<Fragment slot="hero">
		<CaseStudyHero eyebrow={[...]} title="...">Lede paragraph.</CaseStudyHero>
		<CaseStudyMeta items={[...]} />
	</Fragment>

	<section id="audit">
		<div class="sec-head"><span class="sec-num">01</span><h2>Heading</h2><span class="sec-rule"></span></div>
		<p>…</p>
		<Figure … />
	</section>
	<!-- more sections -->

	<NextCaseStudy slot="close" href="/case-studies/…" label="…" />
</CaseStudyLayout>
```

- **`CaseStudyLayout`** (props: `title`, `description`) renders `BaseLayout` with the marketing nav off, `og:type` set to `article`, a skip link, `CaseStudyTopbar`, `PageFlow` (see [`scroll-flow.md`](scroll-flow.md)), and one `DeckLightbox`.
- **Topbar wayfinding** is built from every `main section[id]`: the label is the `.sec-num` text plus the `<h2>`, e.g. "01 · A tool built only for the audit". A section without an `id` doesn't get a label. Under reduced motion the label swaps instantly instead of fading.
- **Reading progress** runs from the top of `<main>` to the `.next` block, capped at the furthest point the page can actually scroll so the bar always fills.
- **`.deck-stat`** — wrap one sentence of a paragraph in `<strong class="deck-stat">` to make it a statement slide. Optional `data-deck-label` (rail label) and `data-deck-foot` (footer, two parts separated by `|`).

## Components

**TL;DR** — "Deck" says whether it becomes a slide. Required props are in **bold**.

| Component | Props | Slot | Deck |
| :-- | :-- | :-- | :-- |
| `CaseStudyHero` | **`eyebrow`** (string[]), **`title`** | The lede paragraph | Title slide from the `<h1>`, eyebrow, and the lede's first sentence |
| `CaseStudyMeta` | **`items`** (`{ label, value }[]`) | — | No |
| `Figure` | **`alt`**, **`figNum`**, **`lead`**, `src` or `video`, `wide`, `tall`, `bare`, `fit`, `deck`, `deckLabel`, `placeholderLabel` | Caption text after the bold lead | Only with `deck` |
| `Pull` | **`quote`**, **`attribution`**, `deckLabel` | — | Always, as a quote slide |
| `ProcessColumns` | **`items`**, **`deckLabel`**, **`deckCaption`**, `land` | — | Always, as a strip slide |
| `Pivot` | **`heading`**, `label` (default "What changed") | The body text | Always — the heading is a statement slide |
| `Strip` | **`items`**, **`figNum`**, **`lead`**, **`deckLabel`**, `land`, `full`, `solo`, `spaced` (default `true`) | Caption text after the bold lead | Always, as a strip slide (or one slide per frame with `solo`) |
| `ImagePair` | **`items`**, **`deckLabel`**, `mid` | — | Always, as a two-up slide |
| `Metrics` | **`items`** (`{ n, label }[]`), `three` | — | Always, as a metrics slide |
| `NextCaseStudy` | **`href`**, **`label`** | — | No |

### Prop details

- **`Figure`**
  - `src` is an imported image (`@img/...`); `video` is `{ poster, sources: [{ src, media? }] }` for a looping, muted screen recording from `public/video/`. With neither, it renders a labeled placeholder: `placeholderLabel` in bold, then `alt`.
  - Video renders as `<video data-ambient>` with no `autoplay` — see [`reduced-motion.md`](reduced-motion.md).
  - `wide` breaks out past the text column (up to 1080px); `tall` gives the frame a 5:4 ratio; `bare` drops the frame's border and background (image only).
  - `fit` (`"contain"` or `"center"`) only changes how the image sits on its deck slide.
- **Frame items** (`ProcessColumns`, `Strip`, `ImagePair`) each take `imgSrc` (optional), `imgAlt`, and `placeholderLabel` for the no-image fallback.
  - `ProcessColumns` items: **`title`**, **`body`**, and optional `stepLabel` and `frameN` — use those two only when the columns are a real sequence. `land` makes frames 3:1 and stacks them on the deck slide.
  - `Strip` items: **`dataLabel`** (the frame's label on the deck) and optional `frameN`; frames are numbered only when it's given. `land` makes frames 5:4; `full` stacks them full width at 16:10, for screenshots too detailed to survive a thumbnail column; `solo` gives each frame its own deck slide; `spaced={false}` drops the 40px top margin.
  - `ImagePair` items: **`fn`** (the figure number) and **`caption`**, which is rendered as HTML so it can carry `<strong>`. Optional `fit` per item. `mid` tightens the pair's margins when it sits mid-paragraph.
- **`Metrics`** is two columns by default; `three` makes it three (one column on phones).

## Page-level pieces

- **`CaseStudyTopbar`** (props: `title`, `backHref` default `/#work`) — back link, title, the live section label, the "View as deck" trigger, and the progress bar. Rendered by `CaseStudyLayout`; pages don't use it directly.
- **`DeckLightbox`** (prop: `title`) — the deck itself and the sticky "View as deck" bar shown at phone width. Also rendered by `CaseStudyLayout`.
- **`PageFlow`** — see [`scroll-flow.md`](scroll-flow.md). About and CV use it directly.
- **`Contact`**, **`NavBar`**, **`HomeHero`**, **`CaseStudies`**, **`CaseStudyCard`** — homepage and marketing-page pieces, described in the README's "What's on the site". `Contact` carries no `id`, because About and CV reuse it in their closing panels; the homepage wraps it in its own `section#contact`.

## Adding a case study

1. Copy an existing page in `src/pages/case-studies/` and replace its content. Import images from `@img/`; put videos in `public/video/` and pass their URLs.
2. Give every section an `id` and a numbered `.sec-head` so the topbar can label it.
3. Pass `deck`/`deckLabel` on any `Figure` that should appear in the deck. Everything else in the table above joins the deck on its own, in document order.
4. Point the previous case study's `NextCaseStudy` at the new page.
5. For the homepage card, add an entry to `src/data/case-studies.ts` (`slug`, `label`, `eyebrow`, `title`, `blurb`, `meta`, `thumb`, `thumbAlt`, and `wireframe` for its panel art set — see [`homepage-panel-art.md`](homepage-panel-art.md)). The card's order in that array is its order on the homepage.
6. Run `npm run build` and open the page's deck to check the slides.
