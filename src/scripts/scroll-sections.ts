// Pin-and-cover panels, .rev scroll-reveal, and the hero mark gradient — see docs/scroll-flow.md.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const html = document.documentElement;
const mode = html.getAttribute("data-scroll");

if (mode) {
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

	/* ---------- reveal (both modes, no GSAP) ----------------- */
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

		// Safety net for items the observer never reports.
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
			// 12px tolerance for sub-pixel and font-rendering differences.
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

		// Address-bar show/hide on mobile isn't a real resize — see docs/scroll-flow.md.
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

			// pinSpacing:false makes it a cover, not a gap — see docs/scroll-flow.md "How locking works".
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
		// A pinned panel is position:fixed, so native anchor jumps land in the wrong place.
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

		// Fonts change every height, so measure again once they land.
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(evaluate);
		window.addEventListener("load", evaluate);

		// Width-only: height-only resizes are the mobile address bar — see docs/scroll-flow.md.
		let lastWidth = window.innerWidth;
		let t: ReturnType<typeof setTimeout>;
		window.addEventListener("resize", () => {
			if (window.innerWidth === lastWidth) return;
			lastWidth = window.innerWidth;
			clearTimeout(t);
			t = setTimeout(evaluate, 180);
		});

		// Turning reduced motion on mid-visit unlocks immediately.
		const onPref = () => {
			if (reduced.matches && locked) unlock();
		};
		reduced.addEventListener("change", onPref);
	});
}

// Hero mark gradient follows the mouse (homepage only) — see docs/scroll-flow.md.
(function heroMarkParallax() {
	const marks = document.querySelectorAll<HTMLElement>(".hero-mark-photo, .hero-mark-baybayin");
	const hero = document.getElementById("hero");
	if (!marks.length || !hero) return;

	// Reduced motion keeps the gradient at its resting position.
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
	if (reduced.matches) return;

	// Keeps the gradient's flattest part out of view.
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
