/* ============================================================
   scroll-sections.ts
   Shared motion layer for nahi.design. Pairs with scroll-sections.css.

   Modes are read from <html data-scroll="paged|flow">.

     paged   Every .panel pins as you scroll past it and the next
             one covers it. A wayfinding rail is built from the
             panels' own data-label values. (No scroll-snap — it
             fought wheel/trackpad momentum and made the transition
             between panels stutter.)

     flow    Only .page-open and .page-close pin. The document
             between them scrolls normally.

   Three things switch the whole page back to plain scrolling, and
   any one of them is enough: reduced motion, GSAP failing to load
   (it never does here — it's a direct import — but the check stays
   cheap insurance), or a panel whose content is taller than the
   viewport. That last check is the important one. A pinned panel
   clips its overflow, so on a short laptop screen or at a large
   text size, silently locking the page would hide content with no
   way to reach it.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const html = document.documentElement;
const mode = html.getAttribute("data-scroll");

if (mode) {
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

	/* ---------- reveal ----------------------------------------
	   Runs in both modes and never depends on GSAP. */
	(function reveal() {
		html.classList.add("js-reveal");
		const items = Array.from(document.querySelectorAll(".rev"));
		function showAll() {
			html.classList.remove("js-reveal");
		}
		if (!items.length) {
			showAll();
			return;
		}
		if (reduced.matches || !("IntersectionObserver" in window)) {
			showAll();
			return;
		}

		let fired = false;
		const io = new IntersectionObserver(
			(entries) => {
				fired = true;
				entries.forEach((e) => {
					if (!e.isIntersecting) return;
					const sibs = Array.from(e.target.parentNode!.children).filter((n) => n.classList.contains("rev"));
					const k = sibs.indexOf(e.target);
					(e.target as HTMLElement).style.transitionDelay = (k > 0 ? Math.min(k, 3) * 55 : 0) + "ms";
					e.target.classList.add("in");
					io.unobserve(e.target);
				});
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);

		items.forEach((n) => io.observe(n));

		// Safety net: if the observer never fires, or a panel keeps an
		// item permanently out of view, show everything anyway.
		function net() {
			if (!fired) {
				showAll();
				return;
			}
			items.forEach((n) => {
				if (n.classList.contains("in")) return;
				const r = n.getBoundingClientRect();
				if (r.top < window.innerHeight && r.bottom > 0) n.classList.add("in");
			});
		}
		window.addEventListener("load", () => setTimeout(net, 400));
		setTimeout(net, 2500);
	})();

	/* ---------- can this page lock? --------------------------- */
	function panelsFit(panels: Element[]) {
		const vh = window.innerHeight;
		return panels.every((p) => {
			const inner = p.querySelector(".panel-inner") || p.firstElementChild;
			if (!inner) return true;
			// 12px of tolerance: sub-pixel layout rarely lands on an exact
			// match, and different browsers/zoom levels/font rendering can
			// shift a panel's measured height by a few pixels either way.
			return inner.scrollHeight <= vh + 12;
		});
	}

	function ready(fn: () => void) {
		if (document.readyState !== "loading") fn();
		else document.addEventListener("DOMContentLoaded", fn);
	}

	ready(() => {
		const hasGsap = !!gsap && !!ScrollTrigger;
		if (!hasGsap || reduced.matches) return;

		gsap.registerPlugin(ScrollTrigger);

		// Mobile browsers resize the viewport (and fire a `resize` event)
		// just from the address bar/toolbar showing or hiding as you
		// scroll — not an actual layout change. Without this, ScrollTrigger
		// treats every one of those as cause to recalculate, which on a
		// pinned page shows up as the scroll position jumping back toward
		// the top mid-scroll.
		ScrollTrigger.config({ ignoreMobileResize: true });

		const panels: Element[] = mode === "paged" ? gsap.utils.toArray(".panel") : gsap.utils.toArray(".page-open, .page-close");

		if (panels.length < 2) return;

		let triggers: ScrollTrigger[] = [];
		let locked = false;

		/* ---------- lock / unlock ------------------------------- */
		function unlock() {
			triggers.forEach((t) => t.kill());
			triggers = [];
			html.removeAttribute("data-scroll-locked");
			locked = false;
			ScrollTrigger.refresh();
		}

		function lock() {
			html.setAttribute("data-scroll-locked", "");

			// Every panel but the last pins in place while the next one
			// slides up over it. pinSpacing:false is what makes it a cover
			// rather than a gap: the pinned panel reserves no extra scroll
			// distance of its own.
			panels.forEach((panel, i) => {
				if (i === panels.length - 1) return;
				triggers.push(
					ScrollTrigger.create({
						trigger: panel,
						start: "top top",
						endTrigger: panels[panels.length - 1],
						end: "top top",
						pin: true,
						pinSpacing: false,
					}),
				);
			});

			locked = true;
			ScrollTrigger.refresh();
		}

		/* ---------- scrolling to a panel by index --------------- */
		// Used by the in-page anchor handling below. A pinned panel is
		// position:fixed, so the browser's own anchor jump lands in the
		// wrong place — work out the scroll position from the panel's
		// index instead.
		function scrollToPanel(i: number) {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			const y = Math.min(max, i * window.innerHeight);
			window.scrollTo({ top: y, behavior: "smooth" });
		}

		/* ---------- in-page anchors ----------------------------- */
		document.addEventListener("click", (e) => {
			if (!locked || mode !== "paged") return;
			const target = e.target as HTMLElement;
			const a = target.closest ? (target.closest('a[href^="#"]') as HTMLAnchorElement | null) : null;
			if (!a) return;
			const id = a.getAttribute("href")!.slice(1);
			if (!id) return;
			const anchorTarget = document.getElementById(id);
			if (!anchorTarget) return;
			const i = panels.indexOf(anchorTarget.closest(".panel") || anchorTarget);
			if (i < 0) return;
			e.preventDefault();
			scrollToPanel(i);
		});

		/* ---------- evaluate, and re-evaluate ------------------- */
		function evaluate() {
			const fits = panelsFit(panels);
			if (fits && !locked) lock();
			else if (!fits && locked) unlock();
			else if (locked) ScrollTrigger.refresh();
		}

		evaluate();

		// Fonts change the height of everything, so measure again once
		// they've landed rather than trusting the first pass.
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(evaluate);
		window.addEventListener("load", evaluate);

		// Same mobile-address-bar problem as ScrollTrigger's own config
		// above, one level up: a resize event here re-runs evaluate(),
		// which can lock()/unlock() and rebuild every pin trigger from
		// scratch — on a page that's mid-scroll, that reset the scroll
		// position back toward the top. Width is what an actual layout
		// change (rotation, resizing a real window) always changes;
		// address bar show/hide on scroll only ever changes height.
		let lastWidth = window.innerWidth;
		let t: ReturnType<typeof setTimeout>;
		window.addEventListener("resize", () => {
			if (window.innerWidth === lastWidth) return;
			lastWidth = window.innerWidth;
			clearTimeout(t);
			t = setTimeout(evaluate, 180);
		});

		// Someone turning reduced motion on mid-session should get the
		// plain page immediately, not on next reload.
		const onPref = () => {
			if (reduced.matches && locked) unlock();
		};
		reduced.addEventListener("change", onPref);
	});
}

/* ============================================================
   Hero mark gradient parallax
   The woodblock portrait and the Baybayin mark each show a warm
   radial gradient clipped to their own silhouette (see
   .hero-mark-photo / .hero-mark-baybayin in HomeHero's styles).
   Rather than auto-panning on a timer, the gradient's position
   tracks the mouse: moving toward a corner of the hero shifts both
   marks' gradients the same amount, in the same direction, so they
   read as one light source reacting to the visitor rather than two
   independent effects. Only present on the homepage — everywhere
   else this simply finds nothing and does nothing. */
(function heroMarkParallax() {
	const marks = document.querySelectorAll<HTMLElement>(".hero-mark-photo, .hero-mark-baybayin");
	const hero = document.getElementById("hero");
	if (!marks.length || !hero) return;

	// A visitor who's asked for less motion still gets the gradient,
	// just fixed at its resting position instead of following the
	// mouse — matching how the rest of the site treats this setting.
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
	if (reduced.matches) return;

	// Keeps the gradient inside a comfortable range rather than
	// panning all the way to the background-size's own edges, which
	// would push the flattest, least interesting part of the gradient
	// into view.
	const MIN = 15;
	const MAX = 75;

	hero.addEventListener("mousemove", (e) => {
		const rect = hero.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		const posX = (MIN + x * (MAX - MIN)).toFixed(1) + "%";
		const posY = (MIN + y * (MAX - MIN)).toFixed(1) + "%";
		marks.forEach((mark) => {
			mark.style.backgroundPosition = posX + " " + posY;
		});
	});
})();
