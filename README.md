# nahi.design

Nahi Kennedy-Nuñez's UX design portfolio — built with [Astro](https://astro.build), styled by hand, and put together with their developer spouse (hi, that's me 👋).

Live at [nahi.design](https://www.nahi.design).

**TL;DR** — A static Astro 7 site with no CSS framework and no client-side framework. Seven pages: the homepage, About, CV, and four case studies. Every page pins its opening and closing panels as you scroll (GSAP), and every case study can be viewed as a slide deck generated from its own markup. How each piece works lives in [`docs/`](docs/) — start with the table below. Agents: read [`CLAUDE.md`](CLAUDE.md) first.

## Docs

| Doc | Covers | Read it before you… |
| :-- | :-- | :-- |
| [`CLAUDE.md`](CLAUDE.md) | Rules for agents: where docs go, commits, the "before you touch" checklist | …change anything |
| [`docs/scroll-flow.md`](docs/scroll-flow.md) | Pinned panels, torn edges, the `.rev` scroll-reveal, the hero entrance and mark gradient, smooth scrolling | …animate anything, or touch a page's layout or `scroll-sections.*` |
| [`docs/case-study-kit.md`](docs/case-study-kit.md) | Every case study component and its props, and how to add a case study | …edit or add a case study |
| [`docs/deck-lightbox.md`](docs/deck-lightbox.md) | "View as deck": how slides are generated from the page | …change which content becomes a slide |
| [`docs/homepage-panel-art.md`](docs/homepage-panel-art.md) | The sketches, doodles, and logos on the homepage panels, the pencil texture, the hover animation | …edit panel art or `case-studies.ts` ordering |
| [`docs/styling.md`](docs/styling.md) | Stylesheet map, the "Techo" palette, dark mode, breakpoints and editor setup, legacy tokens | …write CSS |
| [`docs/fonts.md`](docs/fonts.md) | The four fonts, their roles, why they're self-hosted, adding a weight | …touch typography or `fonts.ts` |
| [`docs/reduced-motion.md`](docs/reduced-motion.md) | Everything that moves and what it does under `prefers-reduced-motion` | …add anything that moves, or any video |
| [`docs/deploy-notifications.md`](docs/deploy-notifications.md) | The Telegram deploy plugin and its setup | …touch `plugins/` or Netlify config |
| [`docs/open-decisions.md`](docs/open-decisions.md) | Known issues, waiting on Nahi or on a follow-up PR | …starting cleanup work |
| [`docs/history/`](docs/history/) | Dated records (the September 2026 audit). Not current reference | …digging into why something changed |

## What's on the site

- **Home** (`src/pages/index.astro`) — one pinned panel after another: a hero with Nahi's name, a short bio, a woodblock portrait, and a hand-drawn Baybayin mark (`HomeHero`); one full-panel card per case study, each dressed in hand-drawn sketches (`CaseStudies` + `CaseStudyCard`, data in `src/data/case-studies.ts`); and a dark "Get in touch" panel (`Contact`).
- **About** (`src/pages/about.astro`) — the non-work side: a photo, a few facts, four hobby videos.
- **CV** (`src/pages/cv.astro`) — the full work history from `src/data/cv.ts`, plus an "Open as PDF" link to the CV in `public/`.
- **Case studies** (`src/pages/case-studies/*.astro`), each built from the shared kit in `CaseStudyLayout`:
  - **IBM — Data Lineage** (`ibm-data-lineage`): redesigning IBM's data lineage tooling for watsonx. Red Dot Award winner.
  - **HPE — AI Troubleshooting Agent** (`hpe-ai-troubleshooting-agent`): a coded proof-of-concept AI assistant for debugging ML data pipelines, built and shipped the week before the team was laid off.
  - **QuantaLyric — MVP** (`quantalyric-mvp`): scoping and shipping an MVP, brand, and design system for an AI energy-forecasting startup in forty hours.
  - **HIVAZ.org — HIV care in Arizona** (`hivaz-hiv-care-arizona`): redesigning the front door to HIV care for Aunt Rita's Foundation and Arizona's Department of Health and Human Services.
- **Nav** — `NavBar` (wordmark, links, mobile menu) on the homepage, About, and CV. Case studies use their own topbar instead, with a reading-progress bar, the current section's name, and the "View as deck" button.

## Project structure

```
/
├── docs/                → how things work (see the table above); docs/history/ holds dated records
├── plugins/
│   └── telegram-notify/ → local Netlify build plugin for deploy notifications
├── scripts/
│   └── roughen-panel-art.mjs → bakes pencil texture and tilt into the homepage panel art (`npm run art:roughen`)
├── public/              → served as-is: favicon, CV PDF, fonts/, video/ (hobby videos, case study screen recordings), OG image
├── src/
│   ├── components/      → the case study kit, homepage pieces, NavBar, Contact, PageFlow, DeckLightbox
│   ├── data/
│   │   ├── case-studies.ts → homepage card content and order (case study copy lives in each page file)
│   │   ├── cv.ts           → CV content
│   │   ├── fonts.ts        → astro-font config
│   │   └── panel-art.ts    → which sketch, doodle, and logo sits where on each homepage panel
│   ├── img/             → images, optimized by sharp at build time; img/panels/ holds the panel art SVGs
│   ├── layouts/
│   │   ├── BaseLayout.astro      → <head>, fonts, SEO, nav, ambient-video start (props: title, description, showNav, scrollMode, ogType)
│   │   └── CaseStudyLayout.astro → case study topbar, deck, reading-progress script, wraps content in PageFlow
│   ├── pages/           → index, about, cv, case-studies/*
│   ├── scripts/
│   │   └── scroll-sections.ts    → pinned panels, scroll-reveal, hero mark gradient
│   └── styles/          → global.css and what it imports, plus homepage-panels.css (see docs/styling.md)
├── CLAUDE.md            → rules for agents
├── astro.config.mjs     → site URL and integrations
├── netlify.toml         → registers the deploy plugin only; build settings live in the Netlify dashboard
├── postcss.config.cjs   → breakpoint tokens (see docs/styling.md)
├── css-custom-data.json → teaches VS Code about @custom-media
├── .prettierrc.json     → Prettier + prettier-plugin-astro
└── package.json
```

Path aliases in `tsconfig.json`: `@components`, `@data`, `@layouts`, `@img`, `@styles`, `@pages`, and `@/` for `src/`. Videos are referenced by URL from `public/video/`; there is no `src/video/`.

## Commands

Run from the project root. Requires Node.js ≥ 22.12.0. Run `npm install` after every pull.

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run art:roughen` | Re-bake pencil texture and tilt into the panel art SVGs — run after adding or editing one |
| `npm run astro ...` | Any Astro CLI command (e.g. `astro check`) |

## Smaller pieces

- **SEO** — `astro-seo`, per page, through `BaseLayout`. `site` in `astro.config.mjs` is what makes canonical and `og:url` absolute. `ogType` defaults to `website`; `CaseStudyLayout` passes `article`.
- **Images** — everything in `src/img/` goes through Astro's image pipeline (sharp). The IBM case study's three "Three sources, one view" diagrams (`ibm-05.svg`–`ibm-07.svg`) are hand-rebuilt SVGs, not screenshots — the originals never made it into this repo.
- **Icons** — inline SVGs in the markup. No icon library.
- **Email** — `astro-mail-obfuscation` scrambles `mailto:` links against scrapers.
- **Formatting** — Prettier with `prettier-plugin-astro` (tabs), both dev dependencies. Zed formats on save (`.zed/settings.json`). Most older files haven't been through it yet, so expect formatting-only diffs the first time you save one.

## Deployment

Netlify deploys straight from this repo. Build command and publish directory are set in the Netlify dashboard, not in `netlify.toml`. Every deploy posts to Telegram — see [`docs/deploy-notifications.md`](docs/deploy-notifications.md).

## Keeping docs in sync

This README and `docs/*.md` are the source of truth for how the site works — not code comments. A behavior change updates the matching doc in the same commit, and code comments stay to a one-line pointer. The full rule is the top of [`CLAUDE.md`](CLAUDE.md); the [September 2026 audit](docs/history/codebase-audit-2026-09.md) is why.
