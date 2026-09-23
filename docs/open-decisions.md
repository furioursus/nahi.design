# Open decisions

**TL;DR** — The live to-do list for the site: things found but deliberately not changed. "Nahi's call" is content or product; "Code follow-ups" are safe to pick up without asking. Remove an item in the same commit that resolves it. Items 1–4, 6, and 7 came from the [September 2026 audit](history/codebase-audit-2026-09.md); the rest from the docs reorganization on 2026-09-23.

## Nahi's call

**TL;DR** — Content and product decisions. None of them break the site.

1. **Unreferenced images in `src/img/`.** Nothing imports these. All but two were dropped from their pages in the judgment rewrite on 2026-09-23, so they may be waiting to come back: `hivaz-11`, `hivaz-12`, `hpe-04`, `hpe-05`, `hpe-12`, `hpe-13`, `ibm-04`, `ibm-11`, `ibm-12`, `quantalyric-06`, `quantalyric-07`, `quantalyric-08`, `quantalyric-10`, `quantalyric-11`. `homepage-01.png` and `homepage-02.png` have been unused since the homepage redesign on 2026-09-16. Keep or delete — git history keeps them recoverable either way.
2. **CV and case study disagree on the QuantaLyric engagement.** The DecisionSigma entry in `src/data/cv.ts` says "a 90-hour engagement spanning five distinct product surfaces"; the QuantaLyric case study and its homepage card say forty hours and three products. The case study's screenshot alt text also calls the product "DecisionSigma" while the page calls it QuantaLyric.
3. **Phone number in plain text on `/cv`.** The email address is scrambled by `astro-mail-obfuscation`, but the `tel:` link isn't, and this repo is public. Fine if intentional.
4. **About page videos have no poster image.** A reduced-motion visitor sees a video's first frame instead of motion, but iOS Safari can show an empty box when there's no `poster`. A still exported from each hobby video fixes it. The case study `Figure` videos already have posters.
5. **Homepage wayfinding rail.** The design handoff described a rail of panel labels on the homepage, and every homepage panel carries a `data-label` for it, but the rail was never built. Build it, or drop the `data-label`s and the `.panel-rail` selector in `src/data/fonts.ts`.

## Code follow-ups

**TL;DR** — Safe to do without asking; each is its own small PR.

6. **Repo-wide Prettier pass.** Most existing files were never run through Prettier. One `npx prettier --write .` commit would stop format-on-save mixing formatting noise into real diffs.
7. **Remaining long code comments.** The 2026-09-23 reorganization moved the long comments in the scroll-flow, styling, and deploy-plugin files into the docs. `DeckLightbox.astro`, `site-kit.css`, and the component `<style>` blocks still have a few two- and three-line comments; trim them to one-line pointers as those files get touched.
8. **Smooth scrolling ignores reduced motion.** `BaseLayout` sets `scroll-behavior: smooth` after load for every visitor. It should skip that under `prefers-reduced-motion` (and update [`reduced-motion.md`](reduced-motion.md)).
9. **Legacy tokens.** 109 of the 127 custom properties in `tokens.css` are unused — the pre-Techo `--color-*`, `--space-*`, `--text-*` system and three unused Techo tokens. See [`styling.md`](styling.md), "Legacy tokens". Delete them and confirm the build output is unchanged.
