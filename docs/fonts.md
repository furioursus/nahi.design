# Fonts

**TL;DR** — Four self-hosted fonts, Latin and Latin Extended subsets only: 16 `woff2` files, 268KB total, in `public/fonts/`, loaded through `astro-font` and configured in `src/data/fonts.ts`. **Don't switch back to a Google Fonts URL** — it put 1.2MB of `@font-face` rules into every page's HTML.

## Roles

| Font | Role | Token | Weights shipped |
| :-- | :-- | :-- | :-- |
| Shippori Mincho | Display headings | `--font-display` | 400, 500, 600, 700 |
| Noto Serif JP | Body prose | `--font-body` | 400–600 (variable, one file per subset) |
| M PLUS 1 | Interactive chrome — buttons, nav, the topbar's back link and section label, the deck's controls | `--font-ui` | 400 (variable, one file per subset) |
| Space Mono | Metadata only — eyebrows, dates, figure/frame numbers, the deck's slide counter | `--font-mono` | 400, 700 |

- Three are Japanese typefaces, but the site uses them only for their Latin letterforms — there's no Japanese text anywhere.
- Each file is declared with Google's own `unicode-range`, so a page downloads only the subsets its characters need.
- **Four files are preloaded:** the Latin files for Noto Serif JP, Shippori Mincho 600, M PLUS 1, and Space Mono 400.
- A weight that isn't shipped falls back to the nearest one that is. A character outside both subsets falls back to a system font — including the three arrows the site uses (→ ← ↗), which was already true when the fonts came from Google.
- All four are SIL Open Font License, which permits self-hosting.

## Why self-hosted

**TL;DR** — Homepage HTML went from 1.2MB to 19KB.

Loading these from Google Fonts meant astro-font inlined every `@font-face` rule Google serves for the Japanese typefaces — about 1,345 of them, 1.2MB of HTML (~330KB gzipped) on every page. With `preload: true` it also emitted a preload link for each, so browsers downloaded ~30MB of font files per page. The full before-and-after numbers are in the [September 2026 audit](history/codebase-audit-2026-09.md), "Page weight — fixed".

## Adding a weight or a character range

1. Request the family from `https://fonts.googleapis.com/css2?family=...&display=swap` with a modern browser user agent.
2. Copy the `woff2` URL from the `/* latin */` or `/* latin-ext */` block and save the file into `public/fonts/`.
3. Add a `face(...)` line for it in `src/data/fonts.ts`. Pass `true` as the fourth argument only if it should be preloaded.

## Where a font gets applied

Two places set which font an element uses: stylesheets through the `--font-*` tokens, and each family's `selector` list in `src/data/fonts.ts`, which astro-font applies that family (with a metric-matched fallback) to. A new element that should use a role needs one or the other. `.panel-rail` in the M PLUS 1 list is left over from a homepage rail that was never built — see [`open-decisions.md`](open-decisions.md).
