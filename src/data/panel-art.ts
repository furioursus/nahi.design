// Homepage case-study panel art: which sketch sits where, per art set. See docs/homepage-panel-art.md.

export interface PanelArtPiece {
	/** CSS custom property (defined in homepage-panels.css) holding the SVG's URL. */
	art: string;
	w: number;
	h: number;
	/** Inline positioning against the panel's box. */
	pos: string;
	/** Opts out of the hover animation (the employer logos). */
	still?: boolean;
}

const slot = {
	topLeft: "left:36px;top:90px",
	topRight: "right:40px;top:90px",
	bottomLeft: "left:60px;bottom:70px",
	bottomRight: "right:70px;bottom:60px",
	upperLeft: "left:420px;top:20px",
	topCenter: "left:calc(50% - 50px);top:14px",
	upperRight: "right:420px;top:24px",
	lowerRight: "right:340px;bottom:12px",
};

const sketches = (set: "a" | "b" | "c" | "d"): PanelArtPiece[] => [
	{ art: `--wf-${set}0`, w: 288, h: 206, pos: slot.topLeft },
	{ art: `--wf-${set}1`, w: 312, h: 225, pos: slot.topRight },
	{ art: `--wf-${set}2`, w: 238, h: 175, pos: slot.bottomLeft },
	{ art: `--wf-${set}5`, w: 100, h: 82, pos: slot.topCenter },
	{ art: `--wf-${set}6`, w: 62, h: 58, pos: slot.upperRight },
	{ art: `--wf-${set}7`, w: 112, h: 70, pos: slot.lowerRight },
];

const doodle = {
	ate: { art: "--wf-new-ate", w: 70, h: 69 },
	zine: { art: "--wf-new-zine", w: 70, h: 72 },
	cooking: { art: "--wf-new-cooking", w: 70, h: 108 },
	doodle: { art: "--wf-new-doodle", w: 212, h: 99 },
};

export const panelArt: Record<"a" | "b" | "c" | "d", PanelArtPiece[]> = {
	a: [
		...sketches("a"),
		{ ...doodle.ate, pos: slot.bottomRight },
		{ ...doodle.zine, pos: slot.upperLeft },
		{
			art: "--logo-apiahf",
			w: 188,
			h: 185,
			pos: "left:32px;top:330px",
			still: true,
		},
	],
	b: [
		...sketches("b"),
		{ ...doodle.cooking, pos: slot.bottomRight },
		{ ...doodle.doodle, pos: slot.upperLeft },
		{
			art: "--logo-ibm",
			w: 188,
			h: 185,
			pos: "right:36px;top:300px",
			still: true,
		},
	],
	c: [
		...sketches("c"),
		{ ...doodle.zine, pos: slot.bottomRight },
		{ ...doodle.cooking, pos: slot.upperLeft },
		{
			art: "--logo-hpe",
			w: 150,
			h: 234,
			pos: "left:32px;top:310px",
			still: true,
		},
	],
	d: [
		...sketches("d"),
		{ ...doodle.ate, pos: slot.bottomRight },
		{ ...doodle.doodle, pos: slot.upperLeft },
	],
};
