// Injects tokens.css breakpoints into every stylesheet, then resolves them — see docs/styling.md "Breakpoints".
module.exports = {
	plugins: [
		require("@csstools/postcss-global-data")({
			files: ["./src/styles/tokens.css"],
		}),
		require("postcss-custom-media")(),
	],
};
