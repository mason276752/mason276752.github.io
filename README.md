# mason276752.github.io

https://mason276752.github.io/ 的首頁，介紹放在這個網域底下的線上小工具，另外有[文章](https://mason276752.github.io/blog/)區。

工具：

| 工具 | 網址 | Repo |
| --- | --- | --- |
| Paste → JPG | https://mason276752.github.io/paste2jpg/ | [paste2jpg](https://github.com/mason276752/paste2jpg) |
| ZIP 編輯器 | https://mason276752.github.io/zipeditor/ | [zipeditor](https://github.com/mason276752/zipeditor) |
| 簡繁轉換 | https://mason276752.github.io/ziptotaiwanzip/ | [ziptotaiwanzip](https://github.com/mason276752/ziptotaiwanzip) |
| 圖片放大 | https://mason276752.github.io/upscale/ | [upscale](https://github.com/mason276752/upscale) |
| 去背 | https://mason276752.github.io/removebg/ | [removebg](https://github.com/mason276752/removebg) |
| 音檔變速 | https://mason276752.github.io/audiospeed/ | [audiospeed](https://github.com/mason276752/audiospeed) |

用 [Astro](https://astro.build/) 建置成純靜態網站。

## 開發

```sh
npm install
npm run dev        # http://localhost:4321/
npm run build      # 輸出到 dist/
npm run preview    # 預覽 dist/
npm run new <slug> [標題]   # 新增一篇文章
```

推到 `main` 後，GitHub Actions（`.github/workflows/deploy.yml`）會建置並發布到 GitHub Pages（Settings → Pages → Source：GitHub Actions）。

## 結構

```
src/
├── content.config.ts      # 內容集合的欄位定義
├── content/tools/*.md     # 每個工具一個檔案
├── content/blog/*.md      # 每篇文章一個檔案
├── components/            # ToolCard、PostList
├── lib/blog.ts            # 文章排序、草稿、日期、摘要
├── layouts/BaseLayout.astro   # <head>、頁首、頁尾
├── pages/index.astro      # 首頁
├── pages/blog/            # /blog/、/blog/<slug>/、/blog/tags/<tag>/、/blog/rss.xml
├── pages/404.astro
└── styles/global.css      # 顏色與共用樣式（和工具本身同一套配色）
public/
├── admin/                 # 線上編輯後台（/admin/）
├── images/blog/           # 文章圖片
├── favicon.svg
└── icons/                 # 各工具的圖示
scripts/new-post.mjs       # npm run new
```

## 寫文章

每篇文章是 `src/content/blog/` 底下的一個 `.md`，檔名就是網址：`hello.md` → `/blog/hello/`。推到 `main` 約一分鐘後上線，首頁和 `/blog/` 會自動列出來。

```md
---
title: 文章標題
date: 2026-11-14
description: 一句話摘要（可省略，省略就取內文開頭）
tags: [前端, Astro]      # 可省略；也可以寫成 tags: 前端, Astro
draft: false            # true 的話只在 npm run dev 看得到，不會上線
updated: 2026-11-20     # 可省略
---

內文用 Markdown 寫。
```

只有 `title` 和 `date` 是必填，其他欄位留空或整行刪掉都可以。

### 方法一：手打 .md

```sh
npm run new my-first-post 我的第一篇文章   # 建立 src/content/blog/my-first-post.md，日期是今天
npm run dev                                # 邊寫邊看 http://localhost:4321/blog/
```

也可以直接複製一篇舊的改。檔名用英文小寫、數字和 `-`。

**圖片**：放到 `public/images/blog/`，內文寫 `![說明](/images/blog/photo.jpg)`。
想讓 Astro 自動壓縮的話，可以改用資料夾：`src/content/blog/my-post/index.md` 和 `photo.jpg` 放一起，內文寫 `![說明](./photo.jpg)`，網址一樣是 `/blog/my-post/`。

### 方法二：線上編輯（/admin/）

https://mason276752.github.io/admin/ 是 [Sveltia CMS](https://sveltiacms.app/) 後台：有表單、所見即所得編輯器、可以直接上傳圖片，手機也能用。按儲存會直接 commit 到 `main`，自動部署。

第一次使用要建一個 GitHub token：

1. 到 GitHub → Settings → Developer settings → [Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)
2. Repository access 選 **Only select repositories** → `mason276752.github.io`
3. Permissions → Repository permissions → **Contents: Read and write**
4. 產生後打開 `/admin/`，按「使用存取權杖登入」，貼上

token 只存在那個瀏覽器裡。登出或換電腦要重新貼；過期了就再產生一個。

後台的欄位定義在 `public/admin/config.yml`，改了 `src/content.config.ts` 的文章欄位記得一起改。

在本機跑 `npm run dev` 時，用 Chrome／Edge 開 http://localhost:4321/admin/index.html（本機要寫完整檔名），按「使用本機倉庫」選這個資料夾，就能用同一個後台直接改本機檔案，不需要 token。

### 方法三：在 GitHub 網頁上改

每篇文章底下有「在 GitHub 上編輯」連結。要新增的話，在 GitHub 上打開 `src/content/blog/` → Add file → Create new file。

## 新增其他內容

**新增一個工具**：在 `src/content/tools/` 加一個 `.md`，檔名就是 id，首頁會自動列出來。

```md
---
name: 工具名稱
tagline: 一句話說明
url: https://mason276752.github.io/<repo>/
repo: https://github.com/mason276752/<repo>
icon: /icons/<repo>.svg
order: 4
features:
  - 特色一
  - 特色二
---

一段介紹。
```

工具之間的串接說明在 `src/pages/index.astro` 的 `links`。

**新增頁面**：在 `src/pages/` 加 `.astro` 或 `.md`，例如 `src/pages/about.astro` → `/about/`。

> 頁面路徑不要和 project repo 同名（例如 `/paste2jpg/`），那些路徑會由各自 repo 的 GitHub Pages 提供。反過來也一樣：不要開名叫 `blog`、`admin`、`images` 的 repo 來放 GitHub Pages。
