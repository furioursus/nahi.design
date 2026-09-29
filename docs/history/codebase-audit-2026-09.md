# Codebase audit — September 2026

**TL;DR** — A pass over the whole repo on 2026-09-23 looking for code that didn't match its docs, or didn't make sense. Five real bugs fixed (reduced-motion autoplay, a duplicate `id`, a hero mask using two different files, the hero fading in twice, panel logos on the wrong case studies), docs brought back in line with the code, and dead config removed. Six items were left open because they're Nahi's call or need their own PR; they now live in [`open-decisions.md`](../open-decisions.md). A seventh, page weight, has since been fixed. The biggest process takeaway became a rule in `CLAUDE.md`: explanations live in markdown, not in code comments.

## Fixed

**TL;DR** — Everything here landed on the `fix/codebase-audit` branch (PR #16), one commit per row group, except the panel-logo row, which came after the merge. Each row names the commit subject so it survives a squash or rebase.

| What was wrong | Where | Commit |
| :-- | :-- | :-- |
| Ambient videos carried an `autoplay` attribute, so they played even for visitors with `prefers-reduced-motion` set. `BaseLayout`'s inline comment claimed the opposite. | `Figure.astro`, `about.astro`, `DeckLightbox.astro`, `BaseLayout.astro` | `fix: stop ambient videos autoplaying under reduced motion` |
| The homepage rendered `id="contact"` twice — once on its own panel, once inside the `Contact` component. | `index.astro`, `Contact.astro` | `fix: duplicate #contact id on the homepage` |
| The hero portrait's `-webkit-mask-image` used `homepage-03.png` while `mask-image` used `homepage-04.png`, a near-identical copy. | `HomeHero.astro` | `fix: hero portrait mask pointed at two different image files` |
| Case study pages ran the `.rev` scroll-reveal twice: once from `CaseStudyLayout`'s own copy, once from `scroll-sections.ts`, which already covers every page. | `CaseStudyLayout.astro` | `refactor: drop duplicate scroll-reveal from CaseStudyLayout` |
| `@twodft/astro-icon` was installed, registered, and documented, but never used — every icon is an inline SVG. `.prettierrc.json` loaded `prettier-plugin-astro`, which wasn't a dependency, so format-on-save broke on a fresh clone. | `package.json`, `astro.config.mjs` | `chore: remove unused astro-icon, add Prettier as a dev dependency` |
| A `@video` alias pointing at a `src/video/` that doesn't exist, an unused `*.mp4` module declaration, and a committed Netlify CLI `deno.lock` with no edge functions behind it. | `tsconfig.json`, `src/env.d.ts`, `.gitignore` | `chore: remove dead @video alias, mp4 typing, and tracked deno.lock` |
| The homepage hero faded in twice on load (7 of 9 measured loads): visible at ~1.3s, blank at ~1.8–2.2s, fading back in by ~2.4–2.7s. ScrollTrigger re-wraps pinned panels in a `pin-spacer` on refresh, which restarts CSS keyframe animations. The entrance now runs on the Web Animations API, which survives the move (0 of 9 loads doubled after the fix). | `HomeHero.astro` | `fix: homepage hero fading in twice on load` |
| Homepage panel logos sat on the wrong case studies after HIVAZ moved to the end of the lineup: IBM showed APIAHF's logo, HPE showed IBM's, QuantaLyric showed HPE's. `CaseStudies.astro` assigned art sets by position; each case study now names its own via a `wireframe` field. Found after `fix/codebase-audit` merged, so it ships on the next branch. | `case-studies.ts`, `CaseStudies.astro` | `fix: homepage panel logos shifted onto the wrong case studies` |
| `CLAUDE.md` listed the old fonts (Source Sans 3), left out GSAP and the PostCSS plugins, and listed the `@video` alias. README's project tree was missing `docs/`, `plugins/`, and the root config files. | `CLAUDE.md`, `README.md` | `docs: codebase audit record and agent documentation rules` |

## Cross-machine gotcha

**TL;DR** — Run `npm install` after every pull.

The audit started with `npm run build` failing on one machine: `gsap` was in `package-lock.json` but not in that machine's `node_modules`, because it was added on the other machine. Nothing was wrong with the code. This is now written into `CLAUDE.md` under "Working across machines."

## Open decisions for Nahi

**TL;DR** — Seven things the audit found but didn't change at the time. None of them break the site. Six are still open and now live in [`open-decisions.md`](../open-decisions.md) (unreferenced images, the QuantaLyric mismatch, the plain-text phone number, missing video posters, a repo-wide Prettier pass, legacy code comments). The seventh, page weight, is fixed.

### Page weight — fixed

Every page was downloading about 30MB across roughly 900 requests. `perf/page-weight` (PR #18) turned off astro-font's preloading of 1,345 Japanese-font subset files and moved 880KB of inlined homepage SVG art out of the site-wide stylesheet: the homepage went from 31MB / 900 requests to 2.7MB / 49, first paint from 864ms to 132ms, main-thread blocking from 662ms to 2ms. `perf/latin-fonts` then self-hosted only the Latin and Latin Extended subsets of the four fonts, removing the 1,345 inlined `@font-face` rules: homepage HTML went from 1.2MB to 19KB and total homepage download from 2.7MB to 1.3MB, with text rendering identical (text-only pixel diff across all seven pages: 182–1,135 differing pixels per 5–14 million, all sub-pixel anti-aliasing).
