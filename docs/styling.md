# Styling

**TL;DR** — Plain CSS, no framework. Design tokens live in `src/styles/tokens.css`; `global.css` pulls in every site-wide stylesheet once, so no page imports them itself. The site is forced light. Breakpoints are `@custom-media` names (`@media (--bp-md)`) resolved at build time by PostCSS. Only 18 of the 127 custom properties in `tokens.css` are actually used — see "Legacy tokens".

## Stylesheet map

**TL;DR** — `BaseLayout` imports `global.css`; everything else hangs off it, except the homepage panel art.

| File | Holds | Loaded by |
| :-- | :-- | :-- |
| `global.css` | Imports the five below, then base `body`/heading/link styles, the `:focus-visible` ring, `.sr-only`, and the site-wide reduced-motion override | `BaseLayout` (every page) |
| `reset.css` | CSS reset (strips native outlines, which `global.css` restores as the focus ring) | `global.css` |
| `tokens.css` | Breakpoints, the "Techo" palette and type tokens, the dark-mode blocks, and the legacy tokens | `global.css` |
| `site-kit.css` | The case-study kit: topbar, page wrap, section heads, frames and figures, pull quotes, process columns, pivot, metrics, next link, the deck lightbox and its slide styles. Its page-chrome basics (`.wrap`, `.hero`, `.eyebrow`, `.meta`, `h1`, `.lede`) are used by the marketing pages too | `global.css` |
| `marketing.css` | Homepage/About/CV chrome: top nav, wordmark, mobile nav, buttons, the contact slab, and a bolder mark-colored `.eyebrow` that wins over `site-kit.css`'s by cascade order | `global.css` |
| `scroll-sections.css` | The pin-and-cover panels — see [`scroll-flow.md`](scroll-flow.md) | `global.css` |
| `homepage-panels.css` | Homepage panel art — see [`homepage-panel-art.md`](homepage-panel-art.md) | `CaseStudies.astro` only |

`site-kit.css` and `marketing.css` were ported from the Claude Design handoff's `design-system.css` and `template.css`, with the tokens moved into `tokens.css`. Component-specific styles live in each `.astro` file's own `<style>` block.

## The "Techo" palette

**TL;DR** — Warm paper and ink. Use the tokens, never raw colors.

| Token | Light | Use |
| :-- | :-- | :-- |
| `--paper` | `#f7f4ec` | Page background |
| `--surface` | `#ffffff` | Raised panels and cards |
| `--rule` | `#dbd5c5` | Hairlines and borders |
| `--ink` / `--ink-mid` / `--ink-soft` | `#1e1b17` / `#4e483e` / `#8b8474` | Text, strong to quiet |
| `--accent` | `#33456c` | Links, primary buttons |
| `--mark` | `#a6392f` | The red dot and highlights |
| `--focus-ring` | `#33456c` | Keyboard focus outline |

Also: `--measure` (640px reading width), `--ease`, and `--dur-s/m/l` (150/260/420ms). `--accent-ink`, `--accent-tint`, and `--mark-tint` are defined for both themes but not currently used.

## Dark mode is built but off

**TL;DR** — `BaseLayout` sets `data-theme="light"` on every page, so the site reads light whatever the visitor's OS says. Remove that attribute to turn dark mode on.

`tokens.css` has two dark blocks with the same values: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` for automatic dark mode, and `:root[data-theme="dark"]` for an explicit override. The `:not([data-theme="light"])` condition is what lets the forced `light` win.

## Breakpoints

**TL;DR** — Write `@media (--bp-md) { … }` in any stylesheet or component `<style>` block. Nothing to import, nothing to run.

| Name | Min width |
| :-- | :-- |
| `--bp-xs` | 30rem |
| `--bp-sm` | 40rem |
| `--bp-md` | 48rem |
| `--bp-lg` | 60rem |
| `--bp-xl` | 64rem |
| `--bp-2xl` | 80rem |

- Defined once at the top of `tokens.css` as `@custom-media`. `@media screen and (--bp-md)` works too.
- Plain CSS can't use a custom property inside a media condition, so `postcss-custom-media` resolves these at build time (`postcss.config.cjs`).
- Astro/Vite processes every component `<style>` block as its own stylesheet, so `@csstools/postcss-global-data` injects the definitions from `tokens.css` into each one first.
- Add a breakpoint with one more `@custom-media --bp-name (min-width: …)` line in `tokens.css`.
- Some older rules still use raw `max-width: 600px` queries (e.g. the deck at phone width); those predate the tokens.

### Editors

The CSS language service in both VS Code and Zed doesn't know `@custom-media` and flags it as "Unknown at rule". The fix differs per editor:

- **VS Code** — `css-custom-data.json` at the repo root describes `@custom-media` (with a hover description), wired in via `.vscode/settings.json`'s `css.customData`.
- **Zed** — `css.customData` is a no-op there: its bundled CSS server only accepts custom-data paths through a notification that VS Code's client sends and Zed doesn't implement. `.zed/settings.json` sets `css.lint.unknownAtRules` to `"ignore"` instead, which silences the whole "unknown at-rule" category (Zed can't scope it narrower).

## Legacy tokens

**TL;DR** — Everything in `tokens.css`'s `:root` above the Techo block is the pre-Techo token system (`--color-*`, `--space-*`, `--text-*`, `--weight-*`, `--line-height-*`, `--letter-spacing-*`, and a few others). A `var()` search finds none of them used anywhere in `src/`.

They were kept "until every component that reads them has been migrated or retired" — which appears to have happened. Removing them is tracked in [`open-decisions.md`](open-decisions.md).
