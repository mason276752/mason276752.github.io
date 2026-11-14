// npm run new <slug> [標題]
// Creates src/content/blog/<slug>.md dated today (Taipei time).
import { existsSync, writeFileSync } from 'node:fs';

const [slug, ...words] = process.argv.slice(2);

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('用法：npm run new <slug> [標題]');
  console.error('  slug 是網址和檔名，用英文小寫、數字和 -，例如：npm run new my-first-post 我的第一篇文章');
  process.exit(1);
}

const file = `src/content/blog/${slug}.md`;
if (existsSync(file) || existsSync(`src/content/blog/${slug}/index.md`)) {
  console.error(`已經有 ${slug} 這篇了`);
  process.exit(1);
}

const title = words.join(' ') || slug;
// sv-SE formats dates as YYYY-MM-DD.
const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei' }).format(new Date());

writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
date: ${date}
description:
tags: []
draft: false
---

`,
);

console.log(`已建立 ${file}，網址會是 /blog/${slug}/`);
