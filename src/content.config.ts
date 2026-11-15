import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { albumPhotos } from './lib/album-photos';

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

// `./photo.jpg`, relative to the .md file. The online editor writes a bare `photo.jpg`, which means the same.
const relative = (v: unknown) => (typeof v === 'string' && !/^\.{0,2}\//.test(v) ? `./${v}` : v);

// One folder per album in src/content/albums/: index.md with the photos beside it. The body is the album's
// article; the `photos:` list is read by the `photos` collection below.
// `npm run photo` and the online editor (public/admin/config.yml) both write this layout; keep the fields in sync.
const albums = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/albums' }),
  schema: z.object({
    title: z.string(),
    // Albums are listed newest first by this.
    date: z.preprocess(day, z.coerce.date()),
    place: z.preprocess(blank, z.string().optional()),
    // Shown on the album's card. Falls back to the start of the article.
    description: z.preprocess(blank, z.string().optional()),
    draft: z.preprocess(blank, z.boolean().default(false)),
  }),
});

// Every photo of every album, in list order (`index`). `text` is the photo's own write-up, in Markdown.
const photos = defineCollection({
  loader: albumPhotos('./src/content/albums'),
  schema: ({ image }) =>
    z.object({
      album: z.string(),
      index: z.number(),
      image: z.preprocess(relative, image()),
      title: z.preprocess(blank, z.string().optional()),
      date: z.preprocess(day, z.coerce.date().optional()),
      place: z.preprocess(blank, z.string().optional()),
      // Camera and lens, e.g. `Sony α7C II · FE 40mm F2.5`.
      gear: z.preprocess(blank, z.string().optional()),
      text: z.preprocess(blank, z.string().optional()),
    }),
});

export const collections = { tools, blog, albums, photos };
