import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const caseStudies = defineCollection({
	loader: glob({
		base: "./src/content/case-studies",
		pattern: "**/*.{md,mdx}",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			heroImage: image(),
			heroImageAlt: z.string(),
			status: z.string(),
			statusLastUpdated: z.coerce.date(),
			services: z.array(z.string()),
			tags: z.array(z.string()),
			thumbSummary: z.string(),
			summary: z.string(),
			gridThumbImage: image(),
		}),
});

export const collections = { "case-studies": caseStudies };
