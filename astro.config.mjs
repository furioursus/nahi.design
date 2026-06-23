// @ts-check
import { defineConfig } from "astro/config";
import icon from "@twodft/astro-icon";
import mdx from "@astrojs/mdx";

import mailObfuscation from "astro-mail-obfuscation";

// https://astro.build/config
export default defineConfig({
	integrations: [icon(), mailObfuscation(), mdx()],
});
