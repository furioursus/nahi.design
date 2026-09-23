// Bakes the seeded pencil texture and tilt into the homepage panel art SVGs. See docs/homepage-panel-art.md.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../src/img/panels/", import.meta.url));

// mulberry32: deterministic, so re-running gives the same "random" texture per file.
function rng(seed) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
const hash = (s) =>
	[...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
const between = (r, lo, hi, dp = 3) => +(lo + r() * (hi - lo)).toFixed(dp);

// Tilt without clipping; assumes absolute M/L/Z paths — see docs "Tilt without clipping".
function tiltTransform(svg, deg, margin = 4) {
	const [, , W, H] = svg
		.match(/viewBox="([^"]+)"/)[1]
		.split(" ")
		.map(Number);
	const nums = [...svg.matchAll(/ d="([^"]+)"/g)].flatMap((m) =>
		m[1].match(/-?\d+(\.\d+)?/g).map(Number),
	);
	const xs = nums.filter((_, i) => i % 2 === 0),
		ys = nums.filter((_, i) => i % 2 === 1);
	const [x0, y0, x1, y1] = [
		Math.min(...xs),
		Math.min(...ys),
		Math.max(...xs),
		Math.max(...ys),
	];
	const cx = (x0 + x1) / 2,
		cy = (y0 + y1) / 2,
		a = (deg * Math.PI) / 180;
	const corners = [
		[x0, y0],
		[x1, y0],
		[x0, y1],
		[x1, y1],
	].map(([x, y]) => [
		(x - cx) * Math.cos(a) - (y - cy) * Math.sin(a),
		(x - cx) * Math.sin(a) + (y - cy) * Math.cos(a),
	]);
	const [rx0, rx1] = [
		Math.min(...corners.map((c) => c[0])),
		Math.max(...corners.map((c) => c[0])),
	];
	const [ry0, ry1] = [
		Math.min(...corners.map((c) => c[1])),
		Math.max(...corners.map((c) => c[1])),
	];
	const scale = Math.min(
		1,
		(W - 2 * margin) / (rx1 - rx0),
		(H - 2 * margin) / (ry1 - ry0),
	);
	const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
	const nx = clamp(cx, margin - rx0 * scale, W - margin - rx1 * scale);
	const ny = clamp(cy, margin - ry0 * scale, H - margin - ry1 * scale);
	const r = (n) => +n.toFixed(2);
	return `translate(${r(nx)} ${r(ny)}) rotate(${deg}) scale(${+scale.toFixed(4)}) translate(${r(-cx)} ${r(-cy)})`;
}

// On-screen widths — keep in sync with src/data/panel-art.ts (see docs "Doodles are rescaled first").
const doodles = {
	"wf-new-ate.svg": 70,
	"wf-new-zine.svg": 70,
	"wf-new-cooking.svg": 70,
	"wf-new-doodle.svg": 212,
};

// k: viewBox units per on-screen px. amount: 1 = full effect, 0.5 = half the wobble and half the opacity variation.
function roughen(f, { k = 1, amount = 1, tilt = true } = {}) {
	const r = rng(hash(f));
	const p = {
		wobbleFreq: between(r, 0.018, 0.04),
		wobbleOct: Math.round(between(r, 2, 3, 0)),
		wobbleSeed: Math.floor(r() * 1000),
		wobble: between(r, 1.8, 3.0, 2),
		inkFreq: between(r, 0.05, 0.11),
		inkSeed: Math.floor(r() * 1000),
		inkGain: between(r, 2.0, 2.9, 2),
		grainFreq: between(r, 0.75, 1.05),
		grainSeed: Math.floor(r() * 1000),
		grainGain: between(r, 3.2, 4.2, 2),
		tilt: between(r, -3, 3, 2),
	};
	const freq = (v) => +(v / k).toFixed(4);
	// alpha = gain*R + bias; scaling by `amount` pulls it toward fully opaque
	const alpha = (gain, bias) =>
		`${+(gain * amount).toFixed(3)} 0 0 0 ${+(amount * bias + (1 - amount)).toFixed(3)}`;
	const filter =
		`<defs><filter id="rough" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">` +
		// wobble: low-frequency displacement so lines drift off the ruler
		`<feTurbulence type="fractalNoise" baseFrequency="${freq(p.wobbleFreq)}" numOctaves="${p.wobbleOct}" seed="${p.wobbleSeed}" result="n"/>` +
		`<feDisplacementMap in="SourceGraphic" in2="n" scale="${+(p.wobble * k * amount).toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="d"/>` +
		// ink pressure: slow opacity drift along each stroke, averaging ~0.9
		`<feTurbulence type="fractalNoise" baseFrequency="${freq(p.inkFreq)}" numOctaves="2" seed="${p.inkSeed}" result="i"/>` +
		`<feColorMatrix in="i" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${alpha(p.inkGain, 0.9 - p.inkGain * 0.5)}" result="ia"/>` +
		`<feComposite in="d" in2="ia" operator="in" result="inked"/>` +
		// graphite tooth: high-frequency noise, steep alpha curve, so strokes break up like pencil on paper
		`<feTurbulence type="fractalNoise" baseFrequency="${freq(p.grainFreq)}" numOctaves="2" seed="${p.grainSeed}" result="g"/>` +
		`<feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${alpha(p.grainGain, 1.12 - p.grainGain * 0.5)}" result="ga"/>` +
		`<feComposite in="inked" in2="ga" operator="in"/>` +
		`</filter></defs>`;

	let svg = readFileSync(join(dir, f), "utf8")
		.replace(/<defs><filter id="rough"[\s\S]*?<\/filter><\/defs>/, "")
		.replace(/ filter="url\(#rough\)"/, "")
		.replace(/ transform="[^"]*"( opacity=)/, "$1");
	const transform = tilt ? ` transform="${tiltTransform(svg, p.tilt)}"` : "";
	svg = svg
		.replace(/(<svg[^>]*>)/, `$1${filter}`)
		.replace(/<g opacity=/, `<g filter="url(#rough)"${transform} opacity=`);
	writeFileSync(join(dir, f), svg);
	console.log(f, JSON.stringify({ ...p, k, amount }));
}

for (const f of readdirSync(dir).filter((f) => /^wf-[abcd]\d\.svg$/.test(f)))
	roughen(f);
for (const [f, shownWidth] of Object.entries(doodles)) {
	const viewBoxWidth = Number(
		readFileSync(join(dir, f), "utf8").match(
			/viewBox="[\d.]+ [\d.]+ ([\d.]+)/,
		)[1],
	);
	roughen(f, { k: viewBoxWidth / shownWidth, amount: 0.5, tilt: false });
}
