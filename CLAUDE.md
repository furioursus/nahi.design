# Instructions for Claude

## Read this first: document in markdown, not in code comments

**TL;DR** — Every change to how the site works gets written up in `README.md` or `docs/*.md` in the same commit. Code comments stay short: a one-line pointer to the doc, or one line on something truly non-obvious at that exact spot. Never a paragraph.

These rules apply to every Claude surface used on this project — Claude Code, Claude (claude.ai), and Claude Design. Claude Code loads this file automatically; the other two only see it if it's pasted into their project instructions or the repo is attached, so keep this section self-contained enough to paste on its own.

- **Where explanations go.** How a feature works, why it's built that way, gotchas, and anything a future reader needs lives in markdown: `README.md` for the overview, `docs/FEATURENAME.md` for anything too long for the README. Link from one to the other.
- **What a code comment may be.** A one-line pointer (`// See README "Reduced motion".`) or a one-line note on something that would look wrong without it. If a comment needs a second sentence, the explanation belongs in the docs instead.
- **Same commit, not a follow-up.** A change to behavior and the doc update describing it land together. If a change makes an existing doc line wrong, fix that line in the same commit.
- **Leave it better.** When you touch a file that has long legacy comments, move their explanation into the docs and leave a one-line pointer behind. Don't do a repo-wide sweep unless asked.
- **Check before you finish.** Before calling a task done, re-read the doc sections that cover what you changed and confirm they still match the code.

**Why:** long inline comments drift from the code silently, and nothing flags it. The September 2026 audit ([`docs/codebase-audit-2026-09.md`](docs/codebase-audit-2026-09.md)) found a comment in `BaseLayout` promising videos never autoplay for reduced-motion visitors while three components did exactly that. Markdown docs are the one place every agent, on both Nahi's and Christopher's machines, reads, so that's where the truth has to live.

## About this project

This is nahi.design — Nahi Kennedy-Nuñez's UX design portfolio, built with Astro and maintained together with their spouse Christopher. See README.md for the full breakdown of pages, components, and structure. Both Nahi and Christopher use they/them pronouns — keep documentation and generated text consistent with that.

## Tech stack

- **Astro** (v7) — the framework; pages are `.astro` files under `src/pages/`, components under `src/components/`
- **TypeScript** — strict config (`astro/tsconfigs/strict`), with path aliases (`@components`, `@data`, `@layouts`, `@img`, `@styles`, `@pages`, and the catch-all `@/` for `src/`) defined in `tsconfig.json`
- **GSAP + ScrollTrigger** — the pin-and-cover scroll mechanic in `src/scripts/scroll-sections.ts` (see README "Scroll-flow panels")
- **astro-font** — Google Fonts loading (Shippori Mincho, Noto Serif JP, M PLUS 1, Space Mono — roles listed in README "Fonts"). Keep `preload: false`; README "Fonts" explains why turning it on costs about 30MB per page
- **astro-seo** — per-page SEO/Open Graph tags
- **astro-mail-obfuscation** — scrambles `mailto:` links against scrapers
- **sharp** — build-time image optimization for everything in `src/img/`
- **postcss-custom-media + @csstools/postcss-global-data** — `@custom-media` breakpoint tokens, see `postcss.config.cjs` and README "Breakpoints"
- **Prettier + prettier-plugin-astro** — formatting, configured in `.prettierrc.json`
- **Netlify** — hosting, deploying straight from this repo, plus a local build plugin for Telegram deploy notifications (`docs/deploy-notifications.md`)
- No CSS framework — plain CSS with design tokens in `src/styles/tokens.css`, no component library, no icon library (icons are inline SVGs)

Videos live in `public/video/` and are referenced by URL, not imported — there is no `src/video/`.

When working in this codebase, check whether a relevant skill (Astro, TypeScript, CSS/design tokens, SEO, or similar) is available and would help, and suggest adding it if not. Don't assume a generic JS/React skill fits — this is Astro-native, no client-side framework in use.

## Working across machines

After pulling, run `npm install` before `npm run dev` or `npm run build`. A dependency added on one machine (e.g. `gsap`) shows up in `package-lock.json` but not in the other machine's `node_modules`, and the build fails with a "failed to resolve import" error until it's installed.

## Conventional commits

Commit subject lines follow Conventional Commits (`type: short description`, e.g. `docs:`, `fix:`, `feat:`, `chore:`). Keep the subject terse.

Use the commit body when a change needs breaking down — multiple distinct edits, or reasoning that isn't obvious from the subject alone. Skip the body entirely for small, self-explanatory changes.

## Documenting new features

When a new feature lands — a new component, a new library/integration, a new page, anything a future reader would want to know exists — document it in README.md as part of that change, not as a follow-up. Follow the structure already there: which section it belongs under, and how existing entries are described.

If README.md ever gets unwieldy (a section grows too long, covers too much to skim), split that section out into its own `./docs/FEATURENAME.md` file and leave a short pointer to it in README.md. Don't preemptively create the docs/ split — only do it once the single file actually becomes hard to navigate.

## No hard line breaks

Don't hard-wrap prose with manual line breaks — in commit message bodies, markdown docs, or anywhere else you're writing text for this project. Write each line as one continuous flow and let it wrap naturally. We read this in tools that handle word wrapping themselves, so manual breaks just create ragged, uneven text.
