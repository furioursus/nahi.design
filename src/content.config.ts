import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/case-studies/` directory.
  loader: glob({
    base: "./src/content/case-studies",
    pattern: "**/*.{md,mdx}",
  }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      titleBrow: z.array(z.string()),
      summary: z.string(),
      pubDate: z.coerce.date(),
      thumbnail: z.nonoptional(image()),
      description: z.string(),
      stats: z.object({
        shipStatus: z.string(),
        shipDate: z.string(),
        role: z.string(),
        services: z.array(z.string()),
        time: z.string(),
      }),
      askApproachOutcome: z.array(z.string()),
    }),
});

export const collections = { blog };
