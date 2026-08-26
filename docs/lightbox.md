# Lightbox

Click, Enter, or Space on an image or video to see it enlarged in a modal. Ported from [furioursus/furioursus.dev's lightbox](https://github.com/furioursus/furioursus.dev/tree/main/docs/lightbox.md) — this site has no markdown/blog content pipeline, so only the explicit-usage half made the trip; the reasoning behind the trickier CSS decisions is unchanged from the original, reproduced below. Video support (`LightboxVideo.astro`) doesn't exist in the source repo — it was added here for the About section's video grid.

## How it's built

Three pieces, plus two usage sites:

- **`src/components/Lightbox.astro`** — script-only, no markup of its own. Defines and registers the `<lightbox-media>` custom element. Included once, globally, in `BaseLayout.astro`, so it's live on every page.

  Behavior on `connectedCallback`: find the trigger button, dialog, and close button inside `this`; clicking the trigger **moves** (not clones) the `<img>`/`<video>` node into the `<dialog>` and calls `showModal()` — same element, same already-loaded `src`/`srcset` (and, for video, playback position/decode state), zero extra network request. Closing (Escape, the close button, or a backdrop click) all funnel through the dialog's native `close` event, which moves the media back to the trigger and restores focus.

  For a video carrying `data-ambient` (this site's marker for the `prefers-reduced-motion`-respecting videos — see the README's Reduced Motion note): opening the lightbox calls `.play()` regardless of that preference, since a deliberate click is different from the grid's forced autoplay; closing re-`.pause()`s it if the preference is still active, so the grid goes back to how the visitor left it rather than picking up motion it never asked to see there.

- **`src/components/LightboxImage.astro`** — the explicit, customizable image component: import it directly in a `.astro` file wherever an image needs a crop/size beyond the default. Renders the trigger/dialog markup `Lightbox.astro`'s custom element expects, plus its own scoped `<style>` (the thumbnail's crop/size is driven by CSS custom properties with defaults, so a bare `<LightboxImage src={x} alt="y" />` renders identically to what passing no props at all would give you).

  See the props table and JSDoc comments in the file itself for the full API (`fit`, `thumbWidth`/`thumbHeight`, `aspectRatio`, `caption`, `width`/`height` for a separate full-resolution dialog image, `priority`).

- **`src/components/LightboxVideo.astro`** — the video counterpart, for local `.mp4` sources. Deliberately smaller prop surface than `LightboxImage` (`src`, `label`, `caption`, `class`) — there's no `astro:assets`-style resizing pipeline for video on this site, so none of `LightboxImage`'s crop/dimension props have an equivalent here. Always muted/autoplay/loop/no-controls in both the thumbnail and the enlarged view, matching this site's other ambient video treatment.

- **`src/components/TextAndImageBlock.astro`** and **`src/components/AboutNahi.astro`** — the current real usage sites. Every case study screenshot/diagram passed through `TextAndImageBlock`, and every video in the About section's grid, is click-to-zoom for free.

## Three CSS rules that are load-bearing, all found the hard way

If the enlarged image is ever visibly distorted, or the close button drifts away from a corner it should be sitting on, this is the first place to check (`LightboxImage.astro`'s `<style>` block):

- **`object-fit: contain`** — without it, `max-width`+`max-height` clamp width and height independently and the image visibly stretches.
- **`width: auto; height: auto`** on the dialog's `img`— without an _explicit_ value here, the browser falls back to the image's own `width`/`height` HTML attributes (real declared values, from Astro's asset optimization) instead of computing a ratio-preserving box from the `max-width`/`max-height` caps. The visible pixels still render undistorted (that's what `object-fit: contain` buys you), but the `<img>` element's own _layout box_ ends up sized to the `max-width`×`max-height` rectangle rather than the photo's real aspect ratio — invisible on its own, but cascades into two symptoms once other things anchor to that box: the `<dialog>` (which shrink-wraps to it) ends up oversized too, stranding the close button (anchored to the dialog's corner) far from the visible photo, and clicks in the resulting gap between the visible photo and the oversized box land on the `<img>` itself rather than the backdrop, so click-outside-to-close silently fails for clicks in that gap.
- **`.lightbox-caption { width: 0; min-width: 100% }`** — the same "box drifts wider than the photo" symptom recurs with a long caption if this isn't here: a caption `<p>`'s own preferred (unwrapped) text width would otherwise count toward `.lightbox-dialog`'s `fit-content` sizing (or the trigger's `inline-block` sizing, on the thumbnail side) and can drag the whole box wider than the image once the caption text is long enough. `width: 0` removes the caption from that shrink-to-fit calculation entirely, so only the image determines the box's width; `min-width: 100%` then snaps the caption back to fill (and wrap within) that width once it's settled.

## Open/close animation

`.lightbox-dialog` bounces open and fades closed via native `<dialog>` + `@starting-style` — no JS, `Lightbox.astro`'s script is unchanged. `showModal()`/`close()` toggle the `open` attribute; the CSS transitions off that. Open uses an overshoot `cubic-bezier(0.34, 1.56, 0.64, 1)` for the bounce; close stays a plain quick ease so it doesn't wobble on the way out. `prefers-reduced-motion: reduce` disables both, consistent with the `data-ambient` video handling elsewhere on this site.

- **`transition-behavior: allow-discrete` on `overlay`/`display`** is load-bearing for the close half specifically. Both properties are normally discrete — they can't animate, they just snap. Without `allow-discrete`, the browser's `display: none` (applied the instant `.close()` runs) removes the dialog before the opacity/transform transition gets a chance to play at all, so closing looks instant no matter what the `transition` line says.
- **`@starting-style { &[open] { ... } }`** supplies the "from" state for the _opening_ animation. Without it there's no starting point to transition from, so the dialog would just appear at its final opacity/scale — same instant-snap symptom, but on open instead of close.
- Unsupported browsers (`@starting-style`/`allow-discrete` need a roughly 2024-or-later engine) fall back to the old instant show/hide — this is pure progressive enhancement, nothing to guard in JS.

## The scoping gotcha in TextAndImageBlock.astro and AboutNahi.astro

Both components used to style their media directly with a plain `img`/`video` selector inside their own `<style>` block, back when they rendered a bare `astro:assets Image` / `<video>`. Swapping those for `<LightboxImage>`/`<LightboxVideo>` broke those rules silently — Astro's scoped CSS stamps a `data-astro-cid-*` attribute onto elements as they're rendered by whichever component's own template produced them, and the `<img>`/`<video>` is produced by the Lightbox component's own template, not the parent's — confirmed by inspecting the built HTML directly (the trigger's media carries the Lightbox component's cid, never the parent's). A same-named `img`/`video` selector in the parent's own scoped styles compiles with the parent's cid attached and just never matches that element.

The fix is `:global()`, wrapping only the part of the selector that needs to reach past the child component's scope boundary — e.g. `.image.has-ratio :global(.lightbox-trigger img) { ... }` stays scoped on `.image`/`.has-ratio` (the parent's own wrapper divs) while matching the trigger/media regardless of which component rendered them. Verified by inspecting the compiled CSS output directly rather than assuming: the `:global()`'d selectors carry more classes than the Lightbox component's own rules for the same properties, so they reliably win the cascade without needing `!important`.

This is the general shape of the problem any future "style a child component's internals from the parent" situation on this site will run into — worth remembering the pattern rather than rediscovering it.

## The pointer-events gotcha in AboutNahi's video grid

`.video-pixel`'s decorative pixel-pattern texture (`global.css`, an unscoped `::after` overlay, `position: absolute; z-index: 2`, covering the full tile) predates the lightbox and never needed `pointer-events: none` — nothing beneath it was ever clickable. Wrapping the grid's videos in a `<LightboxVideo>` trigger button introduced something worth clicking underneath that overlay for the first time, and the overlay's higher z-index means it paints (and hit-tests) above the button regardless of the button itself being non-positioned. Added `pointer-events: none` to the overlay rule pre-emptively and verified the click actually reaches the trigger afterward with `document.elementFromPoint()` on the tile's center (returns the `<video>` element, confirming it's not intercepted). Worth checking for the same issue on any future decorative overlay that ends up sitting above new interactive content.
