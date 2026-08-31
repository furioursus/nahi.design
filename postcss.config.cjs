// Astro/Vite runs every stylesheet — global.css AND each .astro component's own
// <style> block — through this pipeline as a separate file. postcss-global-data
// injects the @custom-media definitions from tokens.css into all of them before
// postcss-custom-media resolves `@media (--bp-md)` etc., so every component can
// use the breakpoint names without importing tokens.css itself.
module.exports = {
	plugins: [
		require("@csstools/postcss-global-data")({
			files: ["./src/styles/tokens.css"],
		}),
		require("postcss-custom-media")(),
	],
};
