# Instructions for Claude

## About this project

This is nahi.design — Nahi Kennedy-Nuñez's UX design portfolio, built with Astro and maintained together with their spouse Christopher. See README.md for the full breakdown of pages, components, and structure. Both Nahi and Christopher use they/them pronouns — keep documentation and generated text consistent with that.

## Tech stack

- **Astro** (v6) — the framework; pages are `.astro` files under `src/pages/`, components under `src/components/`
- **TypeScript** — strict config (`astro/tsconfigs/strict`), with path aliases (`@components`, `@data`, `@layouts`, `@img`, `@video`, `@styles`) defined in `tsconfig.json`
- **astro-font** — Google Fonts loading (Source Sans 3, Space Mono)
- **astro-seo** — per-page SEO/Open Graph tags
- **astro-mail-obfuscation** — scrambles `mailto:` links against scrapers
- **@twodft/astro-icon** — icon components
- **sharp** — build-time image optimization for everything in `src/img/`
- **Netlify** — hosting, deploying straight from this repo
- No CSS framework — plain CSS with design tokens in `src/styles/tokens.css`, no component library

When working in this codebase, check whether a relevant skill (Astro, TypeScript, CSS/design tokens, SEO, or similar) is available and would help, and suggest adding it if not. Don't assume a generic JS/React skill fits — this is Astro-native, no client-side framework in use.

## Conventional commits

Commit subject lines follow Conventional Commits (`type: short description`, e.g. `docs:`, `fix:`, `feat:`, `chore:`). Keep the subject terse.

Use the commit body when a change needs breaking down — multiple distinct edits, or reasoning that isn't obvious from the subject alone. Skip the body entirely for small, self-explanatory changes.

## No hard line breaks

Don't hard-wrap prose with manual line breaks — in commit message bodies, markdown docs, or anywhere else you're writing text for this project. Write each line as one continuous flow and let it wrap naturally. We read this in tools that handle word wrapping themselves, so manual breaks just create ragged, uneven text.
