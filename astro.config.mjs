// @ts-check
import { defineConfig } from "astro/config";

import mailObfuscation from "astro-mail-obfuscation";

// https://astro.build/config
export default defineConfig({
	site: "https://www.nahi.design",
	integrations: [mailObfuscation()],
});
