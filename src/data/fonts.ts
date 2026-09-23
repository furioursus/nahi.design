import type { Props } from "astro-font/utils";

// Self-hosted Latin + Latin Extended subsets only — see docs/fonts.md.
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

const face = (file: string, weight: string, range: string, preload = false) => ({
	path: `./public/fonts/${file}`,
	weight,
	style: "normal",
	preload,
	css: { "unicode-range": range },
});

export const fonts: Props["config"] = [
	{
		name: "Shippori Mincho",
		src: [
			face("shippori-mincho-latin-ext-400.woff2", "400", LATIN_EXT),
			face("shippori-mincho-latin-400.woff2", "400", LATIN),
			face("shippori-mincho-latin-ext-500.woff2", "500", LATIN_EXT),
			face("shippori-mincho-latin-500.woff2", "500", LATIN),
			face("shippori-mincho-latin-ext-600.woff2", "600", LATIN_EXT),
			face("shippori-mincho-latin-600.woff2", "600", LATIN, true),
			face("shippori-mincho-latin-ext-700.woff2", "700", LATIN_EXT),
			face("shippori-mincho-latin-700.woff2", "700", LATIN),
		],
		preload: false,
		display: "swap",
		selector: ".font-display, h1, .pivot-h, .metric-n, .next-link, .card-title, .ds-h, .ds-cn",
		fallback: "serif",
	},
	{
		name: "Noto Serif JP",
		src: [
			face("noto-serif-jp-latin-ext.woff2", "400 600", LATIN_EXT),
			face("noto-serif-jp-latin.woff2", "400 600", LATIN, true),
		],
		preload: false,
		display: "swap",
		selector: "body",
		fallback: "serif",
	},
	{
		name: "M PLUS 1",
		src: [
			face("m-plus-1-latin-ext.woff2", "400", LATIN_EXT),
			face("m-plus-1-latin.woff2", "400", LATIN, true),
		],
		preload: false,
		display: "swap",
		selector:
			".font-ui, .btn, .back, .topbar-sec, .nav-toggle, .deck-trigger, .deck-cta-btn, .panel-rail, .wordmark, .topbar-nav a, .mobile-nav a, .cs-content .card-cta, .contact-link",
		fallback: "sans-serif",
	},
	{
		name: "Space Mono",
		src: [
			face("space-mono-latin-ext-400.woff2", "400", LATIN_EXT),
			face("space-mono-latin-400.woff2", "400", LATIN, true),
			face("space-mono-latin-ext-700.woff2", "700", LATIN_EXT),
			face("space-mono-latin-700.woff2", "700", LATIN),
		],
		preload: false,
		display: "swap",
		selector: ".font-mono, .eyebrow, .browline, .code",
		fallback: "monospace",
	},
];
