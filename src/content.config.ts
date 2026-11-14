import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per tool in src/content/tools/. The file name is the id.
const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    url: z.url(),
    repo: z.url(),
    icon: z.string(),
    features: z.array(z.string()).default([]),
    // Lower comes first on the home page.
    order: z.number().default(100),
  }),
});

export const collections = { tools };
