# nahi.design

Nahi Kennedy-Nuñez's UX design portfolio — built with [Astro](https://astro.build), styled by hand, and put together with their developer spouse (hi, that's me 👋).

Live at [nahi.design](https://www.nahi.design).

## What's on the site

**Home page** (`src/pages/index.astro`) is a full-bleed name-treatment hero (`HomeHero`), followed by a compact about blurb (`HomeAbout`), a stacked list of case study cards (`CaseStudies` + `CaseStudyCard`) linking out to the four case studies below, and a closing contact slab (`Contact`).

**About** (`src/pages/about.astro`) and **CV** (`src/pages/cv.astro`) are their own pages rather than homepage sections — About covers the non-work side (photo, a few facts, four hobby videos), CV is the full work history plus an "Open as PDF" link to the CV in `public/`, with its content in `src/data/cv.ts`.

**Case study pages** (`src/pages/case-studies/*.astro`) — four in-depth write-ups, each composed directly from a shared component kit and wrapped in `CaseStudyLayout`:

- **HIVAZ.org — HIV care in Arizona** (`hivaz-hiv-care-arizona`): redesigning the front door to HIV care for Aunt Rita's Foundation and Arizona's Department of Health and Human Services.
- **IBM — Data Lineage** (`ibm-data-lineage`): redesigning IBM's data lineage tooling for watsonx. Red Dot Award winner.
- **HPE — AI Troubleshooting Agent** (`hpe-ai-troubleshooting-agent`): a coded proof-of-concept AI assistant for debugging ML data pipelines, built and shipped the week before the team was laid off.
- **QuantaLyric — MVP** (`quantalyric-mvp`): scoping and shipping an MVP, brand, and design system for an AI energy-forecasting startup in forty hours.

Each page composes the same shared kit: `CaseStudyHero`, `CaseStudyMeta`, `Figure` (numbered, captioned images with a labeled-placeholder fallback when no screenshot exists), `Pull` (quotes), `ProcessColumns` (the "Try 01/02/03" grid), `Pivot` (the thesis slab where the argument turns), `Strip` (a numbered sequence of frames), `ImagePair` (before/after), `Metrics`, and `NextCaseStudy`. `CaseStudyLayout` wraps all of it with a sticky topbar (back link, live reading-progress bar and section wayfinding label, a "View as deck" trigger) and the deck lightbox itself — see [`docs/deck-lightbox.md`](docs/deck-lightbox.md) for how a case study's own markup turns into a fullscreen slide deck with no separate slide list to maintain.

**Nav bar** (`NavBar`) — sticky header with a wordmark and a mobile menu toggle, shared by the homepage, About, and CV. Case study pages use their own topbar instead (`BaseLayout`'s `showNav={false}`).

## Project structure

```
/
├── public/              → static files served as-is (favicon, CV PDF, hobby videos, OG image)
├── src/
│   ├── components/       → the shared case-study kit, marketing nav, and page-specific pieces
│   ├── data/
│   │   ├── case-studies.ts   → homepage card metadata (title, blurb, meta line, thumb) — full case
│   │   │                       study copy lives in each page file
│   │   └── cv.ts              → CV experience, education, and certifications content
│   ├── img/               → case study and homepage images (optimized by Astro at build time)
│   ├── layouts/
│   │   ├── BaseLayout.astro       → shared <head>, fonts, SEO tags, marketing nav (`showNav` prop)
│   │   └── CaseStudyLayout.astro  → case-study topbar, deck lightbox, scroll-reveal/wayfinding scripts
│   ├── pages/
│   │   ├── index.astro                    → the home page
│   │   ├── about.astro                    → the About page
│   │   ├── cv.astro                       → the CV page
│   │   └── case-studies/*.astro           → the four case study pages
│   └── styles/            → global.css, reset.css, tokens.css, site-kit.css, marketing.css
├── postcss.config.cjs    → wires up postcss-custom-media (breakpoint tokens, see below)
└── package.json
```

## Notable pieces under the hood

- **Fonts**: Fraunces (display headings), Source Serif 4 (body prose), and Space Mono (labels, metadata, mono UI), loaded via `astro-font` from Google Fonts.
- **Design tokens & the "Techo" palette**: `src/styles/tokens.css` defines a warm paper/ink color system (`--paper`, `--ink`, `--ink-mid`, `--ink-soft`, `--accent`, `--mark`, `--rule`, `--surface`) with a real dark-mode block — both a `@media (prefers-color-scheme: dark)` block and an explicit `:root[data-theme="dark"]` override, so a future theme toggle just needs to set that attribute. `src/styles/site-kit.css` holds the shared case-study component kit (topbar, numbered frames, pull quotes, the pivot slab, metrics grid, the deck lightbox) and `src/styles/marketing.css` holds the nav/contact chrome shared by the homepage, About, and CV — both are pulled in once via `global.css` so no page has to import them individually.
- **View as deck**: see [`docs/deck-lightbox.md`](docs/deck-lightbox.md).
- **SEO**: page titles, descriptions, and Open Graph tags are handled per-page via `astro-seo`.
- **Icons**: `@twodft/astro-icon`.
- **Email obfuscation**: `astro-mail-obfuscation` scrambles the `mailto:` links against scraper bots.
- **Images**: everything in `src/img/` is processed by `sharp` at build time (Astro's built-in image optimization).
- **Breakpoints**: defined once in `tokens.css` as `@custom-media` (`--bp-xs` 30rem, `--bp-sm` 40rem, `--bp-md` 48rem, `--bp-lg` 60rem, `--bp-xl` 64rem, `--bp-2xl` 80rem) and used in any component's `<style>` block as `@media (--bp-md) { ... }` (or `@media screen and (--bp-md) { ... }`). Plain CSS can't reference a custom property inside a media condition, so this is resolved at build time by the `postcss-custom-media` plugin, configured in `postcss.config.cjs` — that file also loads `@csstools/postcss-global-data` to make the `tokens.css` breakpoint definitions visible to every component's `<style>` block, since Astro/Vite processes each one as its own separate stylesheet. Nothing to run by hand: `npm install` pulls both packages in, and `npm run dev`/`build` pick up `postcss.config.cjs` automatically. Add a new breakpoint by adding one more `@custom-media --bp-name (min-width: ...)` line in `tokens.css`. The underlying CSS language service (used by both VS Code and Zed) doesn't know this at-rule and would otherwise flag it as "Unknown at rule" — handled per editor since the fix isn't portable:
  - **VS Code**: `css-custom-data.json` at the repo root describes `@custom-media` to the language service (with a hover description), wired in via `.vscode/settings.json`'s `css.customData`.
  - **Zed**: the same fix doesn't work — its bundled CSS server only accepts custom-data file paths through a notification VS Code's own client extension sends, which Zed doesn't implement, so `css.customData` is a no-op there regardless of how it's wired up. `.zed/settings.json` instead sets `css.lint.unknownAtRules` to `"ignore"` for the language server, which silences the whole "unknown at-rule" category (not just `@custom-media` — Zed has no way to scope this narrower).
- **Reduced motion**: the About page's looping hobby videos (marked `data-ambient`) only autoplay when the visitor hasn't set `prefers-reduced-motion` — handled client-side in `BaseLayout`, since a static site has no server-side way to know that preference ahead of time. The case study pages' scroll-reveal and deck-open animations, and the homepage hero's entrance animation, all collapse under the same media query.

## Commands

Run from the project root:

| Command           | Action                                       |
| :----------------- | :-------------------------------------------- |
| `npm install`       | Install dependencies                           |
| `npm run dev`       | Start local dev server at `localhost:4321`     |
| `npm run build`     | Build the production site to `./dist/`         |
| `npm run preview`   | Preview the production build locally           |
| `npm run astro ...` | Run any Astro CLI command (e.g. `astro check`) |

Requires Node.js ≥ 22.12.0.

## Deployment

Hosted on Netlify, deploying straight from this repo. A local Netlify Build Plugin (`plugins/telegram-notify/`, registered in `netlify.toml`) posts a Telegram message on every deploy success or failure — see [`docs/deploy-notifications.md`](docs/deploy-notifications.md) for how it's built and how to set up the bot on a new Netlify site.
