# Lightbox

Click, Enter, or Space on an image to see it enlarged in a modal. Ported from [furioursus/furioursus.dev's lightbox](https://github.com/furioursus/furioursus.dev/tree/main/docs/lightbox.md) — this site has no markdown/blog content pipeline, so only the explicit-usage half made the trip; the reasoning behind the trickier CSS decisions is unchanged from the original, reproduced below.

## How it's built

Two pieces, plus one usage site:

- **`src/components/Lightbox.astro`** — script-only, no markup of its own. Defines and registers the `<lightbox-image>` custom element. Included once, globally, in `BaseLayout.astro`, so it's live on every page.

  Behavior on `connectedCallback`: find the trigger button, dialog, and close button inside `this`; clicking the trigger **moves** (not clones) the `<img>` node into the `<dialog>` and calls `showModal()` — same element, same already-loaded `src`/`srcset`, zero extra network request. Closing (Escape, the close button, or a backdrop click) all funnel through the dialog's native `close` event, which moves the image back to the trigger and restores focus.

- **`src/components/LightboxImage.astro`** — the explicit, customizable component: import it directly in a `.astro` file wherever an image needs a crop/size beyond the default. Renders the trigger/dialog markup `Lightbox.astro`'s custom element expects, plus its own scoped `<style>` (the thumbnail's crop/size is driven by CSS custom properties with defaults, so a bare `<LightboxImage src={x} alt="y" />` renders identically to what passing no props at all would give you).

  See the props table and JSDoc comments in the file itself for the full API (`fit`, `thumbWidth`/`thumbHeight`, `aspectRatio`, `caption`, `width`/`height` for a separate full-resolution dialog image, `priority`).

- **`src/components/TextAndImageBlock.astro`** — the current real usage site. Every case study screenshot/diagram passed through this component is click-to-zoom for free.

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

## The scoping gotcha in TextAndImageBlock.astro

`TextAndImageBlock.astro` used to style the case study image directly with a plain `img` selector inside its own `<style>` block, back when it rendered a bare `astro:assets Image`. Swapping that for `<LightboxImage>` broke those rules silently — Astro's scoped CSS stamps a `data-astro-cid-*` attribute onto elements as they're rendered by whichever component's own template produced them, and `LightboxImage.astro`'s `<img>` is produced by _its_ template, not `TextAndImageBlock.astro`'s — confirmed by inspecting the built HTML directly (the trigger `<img>` carries `LightboxImage`'s cid, never `TextAndImageBlock`'s). A same-named `img` selector in `TextAndImageBlock.astro`'s own scoped styles compiles with `TextAndImageBlock`'s cid attached and just never matches that element.

The fix is `:global()`, wrapping only the part of the selector that needs to reach past the child component's scope boundary — `.image.has-ratio :global(.lightbox-trigger img) { ... }` stays scoped on `.image`/`.has-ratio` (`TextAndImageBlock`'s own wrapper divs) while matching the trigger/image regardless of which component rendered them. Verified by inspecting the compiled CSS output directly rather than assuming: the `:global()`'d selectors carry more classes than `LightboxImage`'s own rules for the same properties, so they reliably win the cascade without needing `!important`.

This is the general shape of the problem any future "style a child component's internals from the parent" situation on this site will run into — worth remembering the pattern rather than rediscovering it.
