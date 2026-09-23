# Reduced motion

**TL;DR** — Everything that moves on the site checks `prefers-reduced-motion` and either stops or shows its end state. The rules for new work: **never put `autoplay` on a video** (mark it `data-ambient` and let the script start it), and **check the preference in any script that animates**. The table below is the full list — update it when you add or change anything that moves.

## What happens under reduced motion

| Feature | Where | Under reduced motion |
| :-- | :-- | :-- |
| All CSS transitions and animations | `global.css` | Durations forced to 0.01ms site-wide |
| Scroll-flow pinning | `scroll-sections.ts` / `.css` | Nothing pins; the page scrolls normally. Turning the setting on mid-visit unlocks immediately |
| `.rev` scroll-reveal | `scroll-sections.ts` | Everything shows at once |
| Homepage hero entrance | `HomeHero.astro` inline script | Skipped; the hero just shows |
| Hero mark gradient | `scroll-sections.ts`, `HomeHero.astro` styles | Stays at its resting position; no transition |
| Homepage panel art and its hover animation | `homepage-panels.css`, `CaseStudies.astro` | The whole art layer is hidden (only the dot grid stays); the hover script does nothing |
| Ambient videos (About hobby videos, `Figure` with `video`) | `BaseLayout.astro` | Never started; the visitor sees the poster or first frame |
| Videos on deck slides | `DeckLightbox.astro` (`playAmbient`) | Never started |
| Case-study topbar section label | `CaseStudyLayout.astro` | Swaps instantly instead of fading |
| Smooth scrolling for in-page links | `BaseLayout.astro` | **Not handled yet** — see [`open-decisions.md`](open-decisions.md) |

## Why videos have no `autoplay`

**TL;DR** — `autoplay` starts a video regardless of the visitor's preference, and a static site can't know the preference before the page loads.

Looping videos are marked `data-ambient` and carry `muted loop playsinline` but no `autoplay`. `BaseLayout` calls `play()` on every `video[data-ambient]` once, client-side, only when reduced motion isn't set.

The deck builds its slides after that one pass has run, so it calls its own `playAmbient` check on each slide it renders — see [`deck-lightbox.md`](deck-lightbox.md).

This is the bug the [September 2026 audit](history/codebase-audit-2026-09.md) found: three components carried `autoplay` while `BaseLayout`'s comment promised they didn't.
