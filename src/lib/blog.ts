import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

const REPO = 'https://github.com/mason276752/mason276752.github.io';

/** Published posts, newest first. Drafts are included only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;

export const tagUrl = (tag: string) => `/blog/tags/${encodeURIComponent(tag)}/`;

/** Edit the entry's file on GitHub. Works for any content entry: posts, albums. */
export const editUrl = (entry: { filePath?: string }) => `${REPO}/edit/main/${entry.filePath}`;

// Dates without a time are midnight UTC, which is the same day in Taipei.
const dateFormat = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const formatDate = (date: Date) => dateFormat.format(date);

/** `description`, or the first ~120 characters of the post as plain text. */
export function summary(post: Post, length = 120): string {
  return post.data.description ?? excerpt(post.body, length);
}

/** Markdown as plain text, cut to about `length` characters. */
export function excerpt(markdown = '', length = 120): string {
  const text = markdown
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1/gm, '') // fenced code
    .replace(/^[\s|:-]+$/gm, '') // table delimiter rows, horizontal rules
    .replace(/<[^>]+>/g, '') // HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // heading, quote, list markers
    .replace(/[*_`~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
