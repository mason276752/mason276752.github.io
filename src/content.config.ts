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
    // Which section of the home page it goes in; the sections are listed in src/pages/index.astro.
    category: z.enum(['files', 'finance', 'learn', 'gallery']).default('files'),
    // Lower comes first within its section.
    order: z.number().default(100),
  }),
});

// A field left empty in the front matter (`description:`) counts as not given.
const blank = (v: unknown) => (v === null || v === '' ? undefined : v);

// `2026-11-14` in YAML is already midnight UTC; read `2026/11/14` the same way instead of as local time.
const day = (v: unknown) => {
  const m = typeof v === 'string' && v.trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : blank(v);
};

// One Markdown file per post in src/content/blog/: `hello.md` or `hello/index.md` → /blog/hello/.
// The same fields are edited online through public/admin/config.yml; keep the two in sync.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.preprocess(day, z.coerce.date()),
    updated: z.preprocess(day, z.coerce.date().optional()),
    // Shown in lists and search results. Falls back to the start of the post.
    description: z.preprocess(blank, z.string().optional()),
    // A list, or one line separated by commas: `tags: 前端, Astro`.
    tags: z.preprocess(
      (v) => (typeof v === 'string' ? v.split(/[,，、]/).map((t) => t.trim()).filter(Boolean) : blank(v)),
      z.array(z.string()).default([]),
    ),
    // Drafts show up in `npm run dev` but are left out of the built site.
    draft: z.preprocess(blank, z.boolean().default(false)),
  }),
});

export const collections = { tools, blog };
