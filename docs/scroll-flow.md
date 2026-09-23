# Scroll-flow panels

**TL;DR** — Every page pins its opening panel while the next section slides up over it, and pins its closing panel the same way. The homepage pins *every* panel in sequence. It's GSAP + ScrollTrigger in `src/scripts/scroll-sections.ts`, styled by `src/styles/scroll-sections.css`. The page falls back to plain scrolling under reduced motion, without GSAP, or when any panel is taller than the viewport. The one rule to remember: **no CSS `@keyframes` entrances inside a pinned panel** — use `element.animate()` or a transition (see "Pin-spacers restart CSS animations" below).

## Two modes

**TL;DR** — `<html data-scroll="paged|flow">`, set by `BaseLayout`'s `scrollMode` prop. Only the homepage is `paged`.

| Mode | Used by | What pins |
| :-- | :-- | :-- |
| `paged` | Homepage (`index.astro` passes `scrollMode="paged"`) | Every `.panel`: `HomeHero`, one `CaseStudyCard` per case study, the `section#contact` panel |
| `flow` (default) | About, CV, every case study | Only `.page-open` and `.page-close`; the document between them scrolls normally |

- **`PageFlow.astro`** is the `flow` shell: a `hero` slot (rendered in `.page-open`), a default slot (the scrolling `.page-body`), and a `close` slot (rendered in `.page-close`). Its `closeSurface` prop (`raised` default, `soft`, `ink`) sets the closing panel's background.
- **About and CV** wrap themselves in `PageFlow` directly. **Case studies** get it through `CaseStudyLayout`, which passes its own `hero` and `close` slots through.
- **No scroll-snap.** The homepage used to snap to the nearest panel; it fought wheel and trackpad momentum and stuttered, so it was removed. Panels stop wherever the gesture ends.
- **`data-label` on each homepage panel is currently unused.** It was meant to feed a wayfinding rail from the design handoff; the rail was never built. See [`open-decisions.md`](open-decisions.md).

## How locking works

**TL;DR** — Every panel but the last pins from its top until the last panel reaches the top, with `pinSpacing: false`, so each one stays underneath as the next covers it.

- `lock()` sets `data-scroll-locked` on `<html>` and creates one ScrollTrigger per panel (except the last): `start: "top top"`, `endTrigger` the last panel, `pin: true`, `pinSpacing: false`. `pinSpacing: false` is what makes it a cover instead of a gap — the pinned panel reserves no scroll distance of its own.
- `unlock()` kills every trigger and removes `data-scroll-locked`.
- **Every pinned panel stays pinned underneath forever.** That permanent stack is what makes the cover effect work, and it's why the torn edges need three variants (below).
- **In-page anchors on the homepage** are intercepted while locked: a pinned panel is `position: fixed`, so the browser's own jump lands in the wrong place. The script scrolls to `panelIndex × viewportHeight` instead.

## When it falls back to plain scrolling

**TL;DR** — Any one of three is enough: reduced motion, GSAP missing, or a panel that doesn't fit.

1. **Reduced motion** — checked on load, and again if the visitor turns it on mid-session (the page unlocks immediately).
2. **GSAP missing** — it's a direct import, so this never actually happens; the check is cheap insurance.
3. **A panel taller than the viewport** — the important one. A pinned panel clips its overflow, so on a short laptop screen or at a large text size, locking would hide content with no way to reach it. `panelsFit()` compares each `.panel-inner`'s `scrollHeight` to the viewport height, with 12px of tolerance for sub-pixel and font-rendering differences.

The fit check re-runs on load, when fonts finish loading (fonts change every height), and on resize — but **only when the width changes**. Mobile browsers fire `resize` when the address bar shows or hides mid-scroll; re-running then would rebuild every pin and jump the page back toward the top. `ScrollTrigger.config({ ignoreMobileResize: true })` covers the same problem inside ScrollTrigger itself.

## The look: torn edges and shadows

**TL;DR** — Three torn-edge shapes (`--torn-top-a/b/c`) cycled across panels via `data-tear`, and a warm shadow tint on each pin-spacer. All only while locked.

- **Torn edge.** `[data-scroll-locked] .panel` gets `clip-path: var(--torn-top-a)`; `data-tear="b"` or `"c"` swaps the shape. Percentage X so it scales with width, fixed-pixel Y jitter so the tear reads the same at every viewport size.
- **Why three shapes.** Since every panel stays pinned underneath, a single shape would line its gaps up on every layer and the tear would become a tunnel to the bottom of the stack. Out-of-phase shapes mean a gap in one layer rarely lines up with a gap behind it. The homepage assigns them in `CaseStudies.astro` (`tears = ["b", "c", undefined, "b"]`); `undefined` falls back to `a`.
- **Assigned in markup, not with `:nth-of-type`.** GSAP wraps every pinned panel in its own `div.pin-spacer`, so every panel is the only child of its wrapper and position-based selectors (`:first-of-type`, `:nth-of-type`) can't tell them apart. Exclude or target panels by content instead, e.g. `.pin-spacer:has(#hero, .page-open)`.
- **Shadow color.** `--shadow-tint` is `--ink-paper-blend` (55% ink, 45% paper) at 32% opacity, so it stays in the warm family instead of reading as a generic UI shadow.
- **Pin-spacer backing.** Each `.pin-spacer` gets `background-color: var(--shadow-tint)`, so where gaps in the tears do line up across layers, what shows through reads as a shadowed recess rather than a clean view down the stack. On the `ink` surface that tint would come out lighter than the panel, so those spacers get a darker mix — a shadow is always darker than what it's cut into. The seam shadow is a `box-shadow`, not `drop-shadow`: `drop-shadow` reads the composited alpha of everything inside, so once the spacer has a background of its own its shadow shape would go back to a plain rectangle.
- **Shadow on the first panel** is turned off (`.pin-spacer:has(#hero, .page-open)`), since nothing is being covered there.
- **Clipping lives on `.panel-inner`, not `.panel`.** An element's own `overflow: hidden` also clips its own box-shadow and clip-path silhouette. Splitting the jobs lets `.panel` carry the torn edge and shadow while `.panel-inner` keeps content in its box. `.hero-inner` is excluded because `.hero-full` already clips its own watermark.
- **In `flow` mode**, `.page-body` gets its own opaque paper background, the torn edge, and a higher `z-index` so it covers the pinned hero instead of showing it through. Its shadow comes from `drop-shadow` on the `.page-body-shadow` wrapper.
- **Bookend sizing.** The hero and closing blocks carry padding meant for a document that continues below them. `scroll-sections.css` strips that padding inside `.page-open` and `.page-close` so each sits centered on its own screen. Case studies, About, and CV all use the same block names (`.hero`, `.meta`, `.next`, `.closing`), so one rule set covers them.
- **Centered section heads in panels.** `.panel .sec-head` stacks the heading and shortens the rule to 64px. Only `Contact` uses a `.sec-head` inside a panel; case-study and CV section heads live in the scrolling body and keep the full-width rule.
- **Contact on the dark panel.** On the homepage's `ink` panel, `.contact` drops its own dark card, since the panel is already the dark surface. About and CV close on a `raised` panel, where `Contact` keeps its card.

## Pin-spacers restart CSS animations

**TL;DR** — ScrollTrigger moves pinned panels into a `div.pin-spacer` on every refresh. Moving an element restarts its CSS animations. Use the Web Animations API for anything that animates inside a panel.

ScrollTrigger wraps a pinned panel in a `pin-spacer`, and does it again on every `ScrollTrigger.refresh()` — on load, on font-load, on resize. Taking an element out of the page and putting it back cancels and restarts its CSS `@keyframes`. The homepage hero's entrance used to be keyframes and played twice: visible at ~1.3s, blank at ~1.8–2.2s, fading back in by ~2.4–2.7s (7 of 9 measured loads). An `element.animate()` animation survives the move.

- **Hero entrance.** `.hero-anim` elements in `HomeHero` each carry a `data-enter-delay` in ms. A small inline script right after the hero markup runs an 800ms fade-and-rise on each with `element.animate()`. It skips itself under reduced motion and when `element.animate` isn't supported, so the hero simply shows; without JavaScript it shows too.
- **Panel art hover** uses `element.animate()` for the same reason — see [`homepage-panel-art.md`](homepage-panel-art.md).

## Scroll-reveal (`.rev`)

**TL;DR** — Any element with class `rev` fades in when it scrolls into view, on every page. Lives in `scroll-sections.ts`, runs in both modes, and doesn't need GSAP.

- An `IntersectionObserver` (15% threshold, bottom margin −40px) adds `.in`. Siblings stagger by 55ms each, capped at three steps.
- `js-reveal` on `<html>` is what hides not-yet-revealed items, so without JavaScript everything shows.
- Everything shows immediately under reduced motion or without `IntersectionObserver`.
- **Safety net.** 400ms after load and again at 2.5s, anything still hidden but on screen is revealed; if the observer never fired at all, everything is. Pinned panels can otherwise keep an item permanently out of the observer's view.

## Hero mark gradient

**TL;DR** — On the homepage, the woodblock portrait and the Baybayin mark each show a warm gradient clipped to their silhouette, and its position follows the mouse. Lives at the bottom of `scroll-sections.ts`.

- Both marks shift by the same amount in the same direction, so they read as one light source.
- Position is kept between 15% and 75%, so the flattest part of the gradient never pans into view.
- Under reduced motion the gradient stays at its resting position.
- On every other page the script finds no marks and does nothing.

## Smooth scrolling

**TL;DR** — `scroll-behavior` is `auto` in `global.css` and switched to `smooth` by `BaseLayout` only after the window's `load` event.

Chrome and other browsers skip the native jump to a `#hash` on load if `scroll-behavior` is already `smooth` — arriving at `/#work` from another page just wouldn't scroll there. Turning smooth on after load keeps in-page clicks animated without breaking arrival by link. (It currently turns on for reduced-motion visitors too — see [`open-decisions.md`](open-decisions.md).)
