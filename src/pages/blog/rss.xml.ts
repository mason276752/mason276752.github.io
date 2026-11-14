import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl, summary } from '../../lib/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'mason276752 的文章',
    description: '工具的開發筆記與其他想寫的東西。',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: summary(post),
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>zh-TW</language>',
  });
}
