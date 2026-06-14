// @ts-check
import { defineConfig } from "astro/config";
import icon from "@twodft/astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
});
