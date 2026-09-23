# Codebase audit — September 2026

**TL;DR** — A pass over the whole repo on 2026-09-23 looking for code that didn't match its docs, or didn't make sense. Five real bugs fixed (reduced-motion autoplay, a duplicate `id`, a hero mask using two different files, the hero fading in twice, panel logos on the wrong case studies), docs brought back in line with the code, and dead config removed. Six items are left open below because they're Nahi's call, not a code question; a seventh, page weight, has since been fixed. The biggest process takeaway became a rule in `CLAUDE.md`: explanations live in markdown, not in code comments.

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

**TL;DR** — Seven things the audit found but didn't change at the time. None of them break the site; item 7 has since been fixed.

1. **Unreferenced images in `src/img/`.** Nothing in the site imports these. All but two were dropped from their pages in the judgment rewrite on 2026-09-23, so they may be waiting to come back: `hivaz-11`, `hivaz-12`, `hpe-04`, `hpe-05`, `hpe-12`, `hpe-13`, `ibm-04`, `ibm-11`, `ibm-12`, `quantalyric-06`, `quantalyric-07`, `quantalyric-08`, `quantalyric-10`, `quantalyric-11`. `homepage-01.png` and `homepage-02.png` have been unused since the homepage redesign on 2026-09-16. Keep or delete — git history keeps them recoverable either way.
2. **CV and case study disagree on the QuantaLyric engagement.** The DecisionSigma entry in `src/data/cv.ts` says "a 90-hour engagement spanning five distinct product surfaces"; the QuantaLyric case study and its homepage card say forty hours and three products. The case study's screenshot alt text also calls the product "DecisionSigma" while the page calls it QuantaLyric. One of them needs updating.
3. **Phone number in plain text on `/cv`.** The email address is scrambled against scrapers by `astro-mail-obfuscation`, but the `tel:` link isn't, and this repo is public. Fine if intentional.
4. **About page videos have no poster image.** With `autoplay` gone, a reduced-motion visitor sees a video's first frame instead of motion — but iOS Safari can show an empty box instead when there's no `poster` to fall back on. A still exported from each hobby video, passed as `poster`, fixes it. The case study `Figure` videos already have posters.
5. **Repo-wide Prettier pass.** Prettier now installs with the project, but most existing files were never run through it. One `npx prettier --write .` commit would stop format-on-save from mixing formatting noise into real diffs.
6. **Legacy long-form code comments.** Much of the codebase (`scroll-sections.ts`, `DeckLightbox.astro`, `global.css`, the component `<style>` blocks) still explains itself in paragraph-long comments. Under the new `CLAUDE.md` rule these move into the docs as files get touched. A single dedicated sweep is an option if that's preferred to moving them gradually.
7. **Page weight — fixed.** Every page was downloading about 30MB across roughly 900 requests. `perf/page-weight` (PR #18) turned off astro-font's preloading of 1,345 Japanese-font subset files and moved 880KB of inlined homepage SVG art out of the site-wide stylesheet: the homepage went from 31MB / 900 requests to 2.7MB / 49, first paint from 864ms to 132ms, main-thread blocking from 662ms to 2ms. `perf/latin-fonts` then self-hosted only the Latin and Latin Extended subsets of the four fonts, removing the 1,345 inlined `@font-face` rules: homepage HTML went from 1.2MB to 19KB and total homepage download from 2.7MB to 1.3MB, with text rendering identical (text-only pixel diff across all seven pages: 182–1,135 differing pixels per 5–14 million, all sub-pixel anti-aliasing).
