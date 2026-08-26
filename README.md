# nahi.design

Nahi Kennedy-Nuñez's UX design portfolio — built with [Astro](https://astro.build), styled by hand, and put together with their developer spouse (hi, that's me 👋).

Live at [nahi.design](https://www.nahi.design).

## What's on the site

**Home page** (`src/pages/index.astro`) stacks five sections top to bottom:

1. **Hero** (`HomeHero`) — intro/landing section.
2. **Case Studies** (`CaseStudies`) — a grid linking out to the three case study pages below.
3. **How It's Built** (`HowItsBuilt`) — a fun behind-the-scenes card grid explaining the tools used to make the site (Claude, Notion, Figma, Windsurf... and "Spousal Privileges").
4. **About Nahi** (`AboutNahi`) — bio blurb plus a grid of looping, click-to-zoom videos (woodworking, the pea puffer fish, Mercer Labs, their cat Dante).
5. **Contact** (`Contact`) — short pitch, resume download button, and an email link.

**Case study pages** (`src/pages/case-studies/*.astro`) — three in-depth write-ups, each using a shared `CaseStudyLayout`:

- **IBM — Data Lineage** (`ibm-data-lineage`): redesigning IBM's data lineage tooling for watsonx. Red Dot Award winner.
- **HPE — AI Troubleshooting Agent** (`hpe-ai-troubleshooting-agent`): a RAG-powered assistant proof-of-concept for debugging ML data pipelines.
- **QuantaLyric — MVP** (`quantalyric-mvp`): scoping and shipping an MVP, brand, and design system for an AI energy-forecasting startup.

Each case study page pulls its title/summary/status/tags from one shared source of truth — `src/data/case-studies.ts` — and composes it with per-page sections built from reusable blocks: `CaseStudySection`, `Description` (with `variant="case-study"`), `CaseStudyStatCards`, `CaseStudyDecisionCard`, `TextAndImageBlock`, `Testimonial`, and friends. Every screenshot rendered through `TextAndImageBlock` is click-to-zoom via `LightboxImage`, and the About section's videos get the same treatment via `LightboxVideo` — both driven by one shared `Lightbox` custom element; see [`docs/lightbox.md`](docs/lightbox.md) for how it's built.

**Nav bar** (`NavBar`) — sticky header with a logo and a mobile menu toggle; on the home page it scroll-links to the sections above, on case study pages it links back home. The active nav item on the home page tracks actual scroll position via `IntersectionObserver`, so it's correct whether you scroll there by hand or land on a section directly from a `#hash` link elsewhere on the site.

## Project structure

```
/
├── public/              → static files served as-is (favicon, resume PDF, videos, nav logo)
├── src/
│   ├── components/      → all the reusable Astro components listed above
│   ├── data/
│   │   └── case-studies.ts   → the case study content (titles, summaries, stats, copy)
│   ├── img/              → images used inside case studies (optimized by Astro at build time)
│   ├── video/             → the IBM case study hero video
│   ├── layouts/
│   │   ├── BaseLayout.astro       → shared <head>, fonts, SEO tags, nav
│   │   └── CaseStudyLayout.astro  → shared case-study header/footer wrapper
│   ├── pages/
│   │   ├── index.astro                    → the home page
│   │   └── case-studies/*.astro           → the three case study pages
│   └── styles/            → global.css, reset.css, tokens.css (design tokens: color, spacing, type)
└── package.json
```

## Notable pieces under the hood

- **Fonts**: Source Sans 3 (body) and Space Mono (headings/labels), loaded via `astro-font` from Google Fonts.
- **SEO**: page titles, descriptions, and Open Graph tags are handled per-page via `astro-seo`.
- **Icons**: `@twodft/astro-icon`.
- **Email obfuscation**: `astro-mail-obfuscation` scrambles the `mailto:` links against scraper bots.
- **Images**: everything in `src/img/` is processed by `sharp` at build time (Astro's built-in image optimization).
- **Design tokens**: colors, spacing, and type scale live in `src/styles/tokens.css` — that's the single place to tweak the visual system.
- **Reduced motion**: the looping "About" videos and the IBM case study's hero video (marked `data-ambient`) only autoplay when the visitor hasn't set `prefers-reduced-motion` — handled client-side in `BaseLayout`, since a static site has no server-side way to know that preference ahead of time. Opening one of the About videos in the lightbox plays it regardless (a deliberate click, not forced motion), then hands the preference back once closed.

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
