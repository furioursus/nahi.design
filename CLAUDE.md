# Instructions for Claude

**TL;DR** — Rules for working in this repo. How the site works is in `README.md` and `docs/`, not here: the README's "Docs" table says which doc to read before touching what. Three things to hold onto: explanations go in markdown, not code comments; docs change in the same commit as the code; and check the "Before you touch…" list below before editing.

## Read this first: document in markdown, not in code comments

**TL;DR** — Every change to how the site works gets written up in `README.md` or `docs/*.md` in the same commit. Code comments stay short: a one-line pointer to the doc, or one line on something truly non-obvious at that exact spot. Never a paragraph.

These rules apply to every Claude surface used on this project — Claude Code, Claude (claude.ai), and Claude Design. Claude Code loads this file automatically; the other two only see it if it's pasted into their project instructions or the repo is attached, so keep this section self-contained enough to paste on its own.

- **Where explanations go.** How a feature works, why it's built that way, gotchas, and anything a future reader needs lives in markdown: `README.md` for the overview and the docs index, `docs/FEATURENAME.md` for how each feature works. A new doc gets a row in the README's "Docs" table.
- **What a code comment may be.** A one-line pointer (`// See docs/reduced-motion.md.`) or a one-line note on something that would look wrong without it. If a comment needs a second sentence, the explanation belongs in the docs instead.
- **Same commit, not a follow-up.** A change to behavior and the doc update describing it land together. If a change makes an existing doc line wrong, fix that line in the same commit.
- **Docs describe the code as it is.** Not the design handoff, not the plan. If something was designed but never built, say so (see `docs/open-decisions.md`).
- **Current reference vs history.** `docs/*.md` describes the site today. Dated records (audits, retrospectives) go in `docs/history/` and aren't updated afterwards. Anything still open goes in `docs/open-decisions.md`, and comes out in the commit that resolves it.
- **Leave it better.** When you touch a file that has long legacy comments, move their explanation into the docs and leave a one-line pointer behind. Don't do a repo-wide sweep unless asked.
- **Check before you finish.** Before calling a task done, re-read the doc sections that cover what you changed and confirm they still match the code.

**Why:** long inline comments drift from the code silently, and nothing flags it. The September 2026 audit ([`docs/history/codebase-audit-2026-09.md`](docs/history/codebase-audit-2026-09.md)) found a comment in `BaseLayout` promising videos never autoplay for reduced-motion visitors while three components did exactly that. The docs reorganization a day later found three more: a homepage wayfinding rail described in four places that was never built, a deck-open animation that doesn't exist, and a CSS comment calling a translucent backing opaque. Markdown docs are the one place every agent, on both Nahi's and Christopher's machines, reads, so that's where the truth has to live.

## Before you touch…

**TL;DR** — The rules that break something when they're missed. Each links to the doc that explains why.

- **Anything that animates inside a pinned panel** — no CSS `@keyframes` entrances. ScrollTrigger re-wraps panels on every refresh, which restarts them. Use `element.animate()` or a transition. ([`docs/scroll-flow.md`](docs/scroll-flow.md))
- **Anything that moves** — respect `prefers-reduced-motion`, and add it to the table in [`docs/reduced-motion.md`](docs/reduced-motion.md).
- **Any video** — never `autoplay`. Use `muted loop playsinline data-ambient` and let `BaseLayout` start it. ([`docs/reduced-motion.md`](docs/reduced-motion.md))
- **Panel height or content** — a panel taller than the viewport turns pinning off for the whole page. Check at a short laptop height. ([`docs/scroll-flow.md`](docs/scroll-flow.md))
- **Selectors for pinned panels** — no `:first-of-type` or `:nth-of-type`; each panel sits alone in its own pin-spacer. Target by content or a data attribute. ([`docs/scroll-flow.md`](docs/scroll-flow.md))
- **Homepage panel art SVGs** — run `npm run art:roughen` after adding or editing one, and commit the output. A doodle's on-screen width lives in both `panel-art.ts` and the script's `doodles` map. ([`docs/homepage-panel-art.md`](docs/homepage-panel-art.md))
- **Case study order** — each card's art set comes from its `wireframe` field in `src/data/case-studies.ts`, never its position. ([`docs/homepage-panel-art.md`](docs/homepage-panel-art.md))
- **Fonts** — Latin and Latin Extended subsets only, self-hosted. Never switch back to a `googleFontsURL`. ([`docs/fonts.md`](docs/fonts.md))
- **CSS** — use the Techo tokens and `@custom-media` breakpoints; don't reach for the legacy tokens. ([`docs/styling.md`](docs/styling.md))
- **Secrets** — the repo is public. Telegram credentials live only in Netlify's environment variables. ([`docs/deploy-notifications.md`](docs/deploy-notifications.md))
- **Contact** — the component has no `id`; the homepage wraps it in `section#contact`. Adding one back duplicates the `id`.

## About this project

This is nahi.design — Nahi Kennedy-Nuñez's UX design portfolio, built with Astro and maintained together with their spouse Christopher. Both Nahi and Christopher use they/them pronouns — keep documentation and generated text consistent with that.

## Tech stack

**TL;DR** — Astro 7, TypeScript (strict), GSAP, plain CSS. No CSS framework, no component library, no client-side framework, no icon library.

- **Astro** (v7) — pages under `src/pages/`, components under `src/components/`. It's Astro-native with no client-side framework, so don't assume a generic JS/React skill fits; check for Astro, TypeScript, CSS, or SEO skills and suggest adding one if it would help.
- **TypeScript** — `astro/tsconfigs/strict`, path aliases listed in the README.
- **GSAP + ScrollTrigger** — the pinned panels ([`docs/scroll-flow.md`](docs/scroll-flow.md)).
- **astro-font** — self-hosted fonts ([`docs/fonts.md`](docs/fonts.md)).
- **postcss-custom-media + @csstools/postcss-global-data** — breakpoint tokens ([`docs/styling.md`](docs/styling.md)).
- **astro-seo**, **astro-mail-obfuscation**, **sharp** — SEO tags, scrambled `mailto:` links, image optimization (README "Smaller pieces").
- **Prettier + prettier-plugin-astro** — `.prettierrc.json`.
- **Netlify** — hosting, plus a local build plugin for Telegram deploy notifications ([`docs/deploy-notifications.md`](docs/deploy-notifications.md)).

## Working across machines

After pulling, run `npm install` before `npm run dev` or `npm run build`. A dependency added on one machine (e.g. `gsap`) shows up in `package-lock.json` but not in the other machine's `node_modules`, and the build fails with a "failed to resolve import" error until it's installed.

## Commits

- **Conventional Commits.** Subject lines are `type: short description` (`docs:`, `fix:`, `feat:`, `chore:`, `perf:`, `refactor:`). Keep the subject terse.
- **Body only when it helps** — multiple distinct edits, or reasoning that isn't obvious from the subject. Skip it for small, self-explanatory changes.

## No hard line breaks

Don't hard-wrap prose with manual line breaks — in commit message bodies, markdown docs, or anywhere else you're writing text for this project. Write each line as one continuous flow and let it wrap naturally. We read this in tools that handle word wrapping themselves, so manual breaks just create ragged, uneven text.
