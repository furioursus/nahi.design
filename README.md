# nahi.design

Nahi Kennedy-Nuñez's UX design portfolio — built with [Astro](https://astro.build), styled by hand, and put together with their developer spouse (hi, that's me 👋).

Live at [nahi.design](https://www.nahi.design).

## What's on the site

**Home page** (`src/pages/index.astro`) is a pinned, one-screen-at-a-time sequence rather than a single scrolling page: a merged hero/about panel (`HomeHero`, name treatment plus a short bio, a woodblock portrait and a hand-drawn Baybayin mark whose gradient fill tracks the mouse), one full-panel card per case study (`CaseStudies` + `CaseStudyCard`, each on its own dot-grid-and-hand-drawn-sketch background), and a closing dark contact panel (`Contact`, wrapped in the homepage's own `section#contact` panel — the component itself carries no `id`, since About and CV reuse it in their closing panels). See "Scroll-flow panels" below for the mechanic behind the pinning.

**About** (`src/pages/about.astro`) and **CV** (`src/pages/cv.astro`) are their own pages rather than homepage sections — About covers the non-work side (photo, a few facts, four hobby videos), CV is the full work history plus an "Open as PDF" link to the CV in `public/`, with its content in `src/data/cv.ts`. Both open and close on a pinned panel too (via `PageFlow`), with the body between scrolling normally.

**Case study pages** (`src/pages/case-studies/*.astro`) — four in-depth write-ups, each composed directly from a shared component kit and wrapped in `CaseStudyLayout`:

- **IBM — Data Lineage** (`ibm-data-lineage`): redesigning IBM's data lineage tooling for watsonx. Red Dot Award winner.
- **HPE — AI Troubleshooting Agent** (`hpe-ai-troubleshooting-agent`): a coded proof-of-concept AI assistant for debugging ML data pipelines, built and shipped the week before the team was laid off.
- **QuantaLyric — MVP** (`quantalyric-mvp`): scoping and shipping an MVP, brand, and design system for an AI energy-forecasting startup in forty hours.
- **HIVAZ.org — HIV care in Arizona** (`hivaz-hiv-care-arizona`): redesigning the front door to HIV care for Aunt Rita's Foundation and Arizona's Department of Health and Human Services.

Each page composes the same shared kit: `CaseStudyHero`, `CaseStudyMeta`, `Figure` (numbered, captioned images with a labeled-placeholder fallback when no screenshot exists, or a looping muted screen recording in place of a still image via its `video` prop), `Pull` (quotes), `ProcessColumns` (a grid of captioned frames, with optional step labels and frame numbers for when the columns are a real sequence), `Pivot` (the thesis slab where the argument turns, with an optional `label` for its eyebrow, which defaults to "What changed"), `Strip` (a row of frames, numbered only when `frameN` is given), `ImagePair` (before/after), `Metrics`, and `NextCaseStudy`. `CaseStudyLayout` wraps all of it with a sticky topbar (back link, live reading-progress bar and section wayfinding label, a "View as deck" trigger) and the deck lightbox itself — see [`docs/deck-lightbox.md`](docs/deck-lightbox.md) for how a case study's own markup turns into a fullscreen slide deck with no separate slide list to maintain.

**Nav bar** (`NavBar`) — sticky header with a wordmark and a mobile menu toggle, shared by the homepage, About, and CV. Case study pages use their own topbar instead (`BaseLayout`'s `showNav={false}`).

## Project structure

```
/
├── docs/                → longer write-ups split out of this README (deck lightbox, deploy notifications, audit records)
├── plugins/
│   └── telegram-notify/ → local Netlify build plugin, see "Deployment"
├── public/              → static files served as-is (favicon, CV PDF, hobby videos, case study screen recordings, OG image)
├── src/
│   ├── components/       → the shared case-study kit, marketing nav, and page-specific pieces
│   ├── data/
│   │   ├── case-studies.ts   → homepage card metadata (title, blurb, meta line, thumb) — full case
│   │   │                       study copy lives in each page file
│   │   └── cv.ts              → CV experience, education, and certifications content
│   ├── img/               → case study and homepage images (optimized by Astro at build time)
│   ├── layouts/
│   │   ├── BaseLayout.astro       → shared <head>, fonts, SEO tags, marketing nav (`showNav`, `scrollMode` props)
│   │   └── CaseStudyLayout.astro  → case-study topbar, deck lightbox, reading-progress/wayfinding script, wraps content in `PageFlow`
│   ├── pages/
│   │   ├── index.astro                    → the home page
│   │   ├── about.astro                    → the About page
│   │   ├── cv.astro                       → the CV page
│   │   └── case-studies/*.astro           → the four case study pages
│   ├── scripts/
│   │   └── scroll-sections.ts     → the pin-and-cover scroll mechanic (see "Scroll-flow panels") and the `.rev` scroll-reveal every page shares
│   └── styles/            → global.css, reset.css, tokens.css, site-kit.css, marketing.css, scroll-sections.css, homepage-panels.css
├── CLAUDE.md             → rules for Claude agents working in this repo (read the top section first)
├── astro.config.mjs      → site URL and integrations
├── netlify.toml          → registers the Telegram deploy plugin (build settings stay in the Netlify dashboard)
├── postcss.config.cjs    → wires up postcss-custom-media (breakpoint tokens, see below)
├── .prettierrc.json      → Prettier + prettier-plugin-astro config
├── css-custom-data.json  → teaches VS Code's CSS language service about @custom-media (see "Breakpoints")
└── package.json
```

## Notable pieces under the hood

- **Fonts**: Shippori Mincho (display headings), Noto Serif JP (body prose), M PLUS 1 (interactive chrome — buttons, nav, the topbar's back link and section label, the deck lightbox's controls, the homepage's wayfinding rail), and Space Mono (metadata only — eyebrows, dates, figure/frame numbers, the deck's slide counter), loaded via `astro-font` from Google Fonts. `--font-ui` is the token for the M PLUS 1 role.
- **Scroll-flow panels**: every page pins its opening hero in place while the next section slides up and covers it (a torn-paper edge and a matching drop shadow at the seam), then reads as a normal document until a closing panel — the homepage's "Get in touch," or the case-study/About/CV `page-close` — pins the same way. The homepage instead pins *every* panel in sequence (hero/about, one panel per case study, contact), with a wayfinding rail built from each panel's `data-label`. No scroll-snap between panels — it fought wheel/trackpad momentum and stuttered. Built with GSAP + ScrollTrigger (`src/scripts/scroll-sections.ts`, styles in `src/styles/scroll-sections.css`), driven by `data-scroll="flow"` (default) or `"paged"` (homepage only, set via `BaseLayout`'s `scrollMode` prop) on `<html>`. `PageFlow.astro` is the shared shell (`hero`/default/`close` named slots) that every non-homepage page wraps its content in to get the open/close panels; `CaseStudyLayout` does this for case studies automatically. Three things fall back to plain scrolling, any one of them enough: reduced motion, a missing GSAP, or a panel whose content measures taller than the viewport (checked on load, on font-load, and on resize) — a pinned panel clips its overflow, so locking a page that doesn't fit would hide content with no way to reach it. The homepage's four case-study panels also carry a dot-grid texture plus hand-drawn UI-mockup sketches and (on three of them) a dimmed employer logo, composed as layered background-images in `src/styles/homepage-panels.css`. Which art set (`a`–`d`, including which logo) a panel gets is set per case study by the `wireframe` field in `src/data/case-studies.ts`, not by position, so reordering the lineup keeps each logo with its own case study.
- **Hero entrance**: the homepage hero's staggered fade-in (`.hero-anim` elements in `HomeHero`, each with a `data-enter-delay` in ms) runs on the Web Animations API from a small inline script placed right after the hero markup — not on CSS `@keyframes`. That's deliberate: ScrollTrigger pins a panel by moving it into a `div.pin-spacer`, and does it again on every `ScrollTrigger.refresh()` (on load, on font-load, on resize). Moving an element out of the page and back cancels and restarts its CSS animations, so a keyframe entrance on the hero played twice — fully visible, then blank, then fading in again about a second later. A Web Animations API animation survives the move and keeps its place. Rule of thumb for anything inside a pinned panel: no CSS `@keyframes` entrances; use `element.animate()` or a CSS transition. The script skips itself under reduced motion and when `element.animate` isn't supported, so the hero simply shows; without JavaScript it shows too.
- **Design tokens & the "Techo" palette**: `src/styles/tokens.css` defines a warm paper/ink color system (`--paper`, `--ink`, `--ink-mid`, `--ink-soft`, `--accent`, `--mark`, `--rule`, `--surface`) with a real dark-mode block — both a `@media (prefers-color-scheme: dark)` block and an explicit `:root[data-theme="dark"]` override. `BaseLayout` currently sets `data-theme="light"` on every page, which the dark-mode media query already treats as an explicit override (`:root:not([data-theme="light"])` is the exact condition it checks for) — so the site reads light regardless of the visitor's OS preference; drop that attribute to let the dark-mode block take over automatically again. `src/styles/site-kit.css` holds the shared case-study component kit (topbar, numbered frames, pull quotes, the pivot slab, metrics grid, the deck lightbox) and `src/styles/marketing.css` holds the nav/contact chrome shared by the homepage, About, and CV — both are pulled in once via `global.css` so no page has to import them individually.
- **View as deck**: see [`docs/deck-lightbox.md`](docs/deck-lightbox.md).
- **Hand-built diagram assets**: the IBM case study's three "Three sources, one view" process-column diagrams (`src/img/ibm-05.svg` through `ibm-07.svg`) are recreated SVGs, not screenshots — the originals never made it into this repo. `astro:assets`/`Image` handles SVG imports the same as raster ones, no special-casing needed.
- **SEO**: page titles, descriptions, and Open Graph tags are handled per-page via `astro-seo`. `site: "https://www.nahi.design"` in `astro.config.mjs` is what lets `astro-seo` emit absolute canonical/`og:url` values instead of falling back to the dev server's `localhost` origin. `BaseLayout`'s `ogType` prop (default `"website"`) sets `og:type`; `CaseStudyLayout` passes `"article"`.
- **Icons**: inline SVGs written straight into the markup (e.g. `Contact`, `CaseStudyTopbar`). No icon library — `@twodft/astro-icon` was installed early on but never used, and was removed.
- **Formatting**: Prettier with `prettier-plugin-astro`, configured in `.prettierrc.json` (tabs). Both are `devDependencies`, so `npm install` is all a fresh machine needs — Zed's format-on-save (`.zed/settings.json`) resolves them from `node_modules`. The existing files haven't all been run through it yet, so expect formatting-only diffs the first time you save an older file.
- **Email obfuscation**: `astro-mail-obfuscation` scrambles the `mailto:` links against scraper bots.
- **Images**: everything in `src/img/` is processed by `sharp` at build time (Astro's built-in image optimization).
- **Breakpoints**: defined once in `tokens.css` as `@custom-media` (`--bp-xs` 30rem, `--bp-sm` 40rem, `--bp-md` 48rem, `--bp-lg` 60rem, `--bp-xl` 64rem, `--bp-2xl` 80rem) and used in any component's `<style>` block as `@media (--bp-md) { ... }` (or `@media screen and (--bp-md) { ... }`). Plain CSS can't reference a custom property inside a media condition, so this is resolved at build time by the `postcss-custom-media` plugin, configured in `postcss.config.cjs` — that file also loads `@csstools/postcss-global-data` to make the `tokens.css` breakpoint definitions visible to every component's `<style>` block, since Astro/Vite processes each one as its own separate stylesheet. Nothing to run by hand: `npm install` pulls both packages in, and `npm run dev`/`build` pick up `postcss.config.cjs` automatically. Add a new breakpoint by adding one more `@custom-media --bp-name (min-width: ...)` line in `tokens.css`. The underlying CSS language service (used by both VS Code and Zed) doesn't know this at-rule and would otherwise flag it as "Unknown at rule" — handled per editor since the fix isn't portable:
  - **VS Code**: `css-custom-data.json` at the repo root describes `@custom-media` to the language service (with a hover description), wired in via `.vscode/settings.json`'s `css.customData`.
  - **Zed**: the same fix doesn't work — its bundled CSS server only accepts custom-data file paths through a notification VS Code's own client extension sends, which Zed doesn't implement, so `css.customData` is a no-op there regardless of how it's wired up. `.zed/settings.json` instead sets `css.lint.unknownAtRules` to `"ignore"` for the language server, which silences the whole "unknown at-rule" category (not just `@custom-media` — Zed has no way to scope this narrower).
- **Reduced motion**: looping videos marked `data-ambient` — the About page's hobby videos and any case study `Figure` passed a `video` prop instead of `src` — only play when the visitor hasn't set `prefers-reduced-motion`. None of them carry an `autoplay` attribute — that attribute would start them regardless of the preference — so `BaseLayout` calls `play()` on every `video[data-ambient]` client-side, since a static site has no server-side way to know that preference ahead of time. The deck lightbox generates its slides after that one-time pass has run, so it calls the same reduced-motion check (`playAmbient`) on each slide it renders — see [`docs/deck-lightbox.md`](docs/deck-lightbox.md). Keep `autoplay` out of any new ambient video markup. The case study pages' scroll-reveal and deck-open animations, the homepage hero's entrance animation, the scroll-flow pin-and-cover mechanic, and the hero marks' mouse-tracking gradient (which sits at a fixed resting position instead) all collapse under the same media query.

## Keeping docs in sync

This README and `docs/*.md` are the source of truth for how the site works — not code comments. Every behavior change updates the matching section here in the same commit, and code comments stay to a one-line pointer back to it. The full rule, written for the Claude agents that work on this repo (Claude Code, Claude, and Claude Design), is the top section of [`CLAUDE.md`](CLAUDE.md). The [September 2026 audit](docs/codebase-audit-2026-09.md) is why: it found an inline comment that had drifted into describing the opposite of what the code did.

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
