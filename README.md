# mason276752.github.io

https://mason276752.github.io/ 的原始碼：

| 頁面 | 網址 | 內容 |
| --- | --- | --- |
| 關於我 | https://mason276752.github.io/ | 自我介紹（日本打工度假中）、最新作品、工具和文章 |
| 作品集 | https://mason276752.github.io/photos/ | 攝影作品：一個個相簿，相簿和每張照片都可以寫文章 |
| 工具 | https://mason276752.github.io/tools/ | 放在這個網域底下的線上小工具 |
| 文章 | https://mason276752.github.io/blog/ | 文章 |

工具：

| 分類 | 工具 | 網址 | Repo |
| --- | --- | --- | --- |
| 檔案處理 | Paste → JPG | https://mason276752.github.io/paste2jpg/ | [paste2jpg](https://github.com/mason276752/paste2jpg) |
| 檔案處理 | ZIP 編輯器 | https://mason276752.github.io/zipeditor/ | [zipeditor](https://github.com/mason276752/zipeditor) |
| 檔案處理 | 簡繁轉換 | https://mason276752.github.io/ziptotaiwanzip/ | [ziptotaiwanzip](https://github.com/mason276752/ziptotaiwanzip) |
| 檔案處理 | 圖片放大 | https://mason276752.github.io/upscale/ | [upscale](https://github.com/mason276752/upscale) |
| 檔案處理 | 去背 | https://mason276752.github.io/removebg/ | [removebg](https://github.com/mason276752/removebg) |
| 檔案處理 | 音檔變速 | https://mason276752.github.io/audiospeed/ | [audiospeed](https://github.com/mason276752/audiospeed) |
| 檔案處理 | 文件掃描 | https://mason276752.github.io/document-jpg/ | [document-jpg](https://github.com/mason276752/document-jpg) |
| 檔案處理 | PDF 壓縮 | https://mason276752.github.io/pdfcompress/ | [pdfcompress](https://github.com/mason276752/pdfcompress) |
| 檔案處理 | Git 編輯器 | https://mason276752.github.io/giteditor/ | [giteditor](https://github.com/mason276752/giteditor) |
| 美股與選擇權 | 美股財報 | https://mason276752.github.io/stockscan/ | [stockscan](https://github.com/mason276752/stockscan) |
| 美股與選擇權 | 選擇權計算機 | https://mason276752.github.io/OptionCalculator/ | [OptionCalculator](https://github.com/mason276752/OptionCalculator) |
| 學習與遊戲 | 五十音測驗 | https://mason276752.github.io/50in/ | [50in](https://github.com/mason276752/50in) |
| 學習與遊戲 | 21 點 | https://mason276752.github.io/blackjack/ | [blackjack](https://github.com/mason276752/blackjack) |
| 學習與遊戲 | 深刻地認識一個人 | https://mason276752.github.io/you-know-me/ | [you-know-me](https://github.com/mason276752/you-know-me) |
| 插圖搜尋 | いらすとや圖庫 | https://mason276752.github.io/irasutoya_scan/ | [irasutoya_scan](https://github.com/mason276752/irasutoya_scan) |
| 插圖搜尋 | Storyset 圖庫 | https://mason276752.github.io/storyset_scan/ | [storyset_scan](https://github.com/mason276752/storyset_scan) |

用 [Astro](https://astro.build/) 建置成純靜態網站。

## 開發

```sh
npm install
npm run dev        # http://localhost:4321/
npm run build      # 輸出到 dist/
npm run preview    # 預覽 dist/
npm run new <slug> [標題]   # 新增一篇文章
npm run photo <相簿> <圖片...>   # 把照片加到相簿
```

推到 `main` 後，GitHub Actions（`.github/workflows/deploy.yml`）會建置並發布到 GitHub Pages（Settings → Pages → Source：GitHub Actions）。

## 結構

```
src/
├── content.config.ts      # 內容集合的欄位定義
├── content/about.md       # 首頁的自我介紹
├── content/albums/*/      # 每個相簿一個資料夾：index.md + 照片
├── content/tools/*.md     # 每個工具一個檔案
├── content/blog/*.md      # 每篇文章一個檔案
├── components/            # ToolCard、PostList、AlbumCard、PhotoGrid（照片牆和看大圖）
├── lib/blog.ts            # 文章排序、草稿、日期、摘要
├── lib/photos.ts          # 相簿和照片的排序、草稿、網址
├── lib/album-photos.ts    # 把每個相簿的 photos: 拆成一張張照片（photos 集合）
├── layouts/BaseLayout.astro   # <head>、頁首、頁尾
├── pages/index.astro      # 首頁（關於我）
├── pages/photos/          # /photos/、/photos/<相簿>/、/photos/<相簿>/<照片>/
├── pages/tools/           # /tools/
├── pages/blog/            # /blog/、/blog/<slug>/、/blog/tags/<tag>/、/blog/rss.xml
├── pages/404.astro
└── styles/global.css      # 顏色與共用樣式（和工具本身同一套配色）
public/
├── admin/                 # 線上編輯後台（/admin/）
├── images/blog/           # 文章圖片
├── favicon.svg
└── icons/                 # 各工具的圖示
scripts/new-post.mjs       # npm run new
scripts/new-photo.mjs      # npm run photo
```

## 改自我介紹

首頁的文字在 `src/content/about.md`：

```md
---
name: Mason                  # 標題「嗨，我是 Mason」
status: 日本打工度假中         # 標題上面的小標籤
description: 一句話介紹       # 搜尋結果和分享連結顯示的摘要
---

自我介紹，用 Markdown 寫。
```

也可以在 [/admin/](https://mason276752.github.io/admin/) 的「頁面 → 關於我」線上改。

## 放攝影作品

作品集由相簿組成。每個相簿是 `src/content/albums/` 底下的一個資料夾，`index.md` 和照片放在一起；資料夾名稱就是網址：

```
src/content/albums/2026-kyoto/          → /photos/2026-kyoto/
├── index.md
├── dsc01234.jpg                        → /photos/2026-kyoto/dsc01234/
└── dsc01235.jpg                        → /photos/2026-kyoto/dsc01235/
```

```md
---
title: 京都的秋天          # 必填，相簿名稱
date: 2026-11-15          # 必填，作品集照這個排序，新的在前
place: 京都               # 可省略
description: 一句話摘要    # 可省略，相簿列表顯示的；省略就取文章開頭
draft: false              # true 的話只在 npm run dev 看得到
photos:                   # 照片，照這個順序排，第一張是封面
  - image: ./dsc01234.jpg       # 必填，其他都可以省略
    title: 伏見稻荷的清晨
    date: 2026-11-14            # 拍攝日期
    place: 伏見稻荷
    gear: Sony α7C II · FE 40mm F2.5
    text: 這張照片的說明，一句話也可以。
  - image: ./dsc01235.jpg
    text: |
      長一點的說明也可以，用 Markdown 寫。
      內容每行要比 text 多縮排兩格。

      可以分段、加連結和清單。
  - ./dsc01236.jpg              # 只有圖片的話可以簡寫成一行
---

這裡是關於這個相簿的文章（可省略），用 Markdown 寫，顯示在照片上方。
```

- **相簿頁** `/photos/<相簿>/`：標題、文章，下面是照片牆。點照片看大圖，可以用左右鍵或滑動切換；照片的說明顯示在大圖下方，長的只顯示開頭和「閱讀全文」。
- **單張照片頁** `/photos/<相簿>/<檔名>/`：大圖、標題、完整的說明，以及上一張、下一張。看大圖時網址就是這一頁，可以直接分享。

推到 `main` 後，作品集和首頁的「最新相簿」會自動列出來。建置時 Astro 會把每張照片轉成幾種尺寸的 WebP，原始檔不會放到網站上。

### 方法一：npm run photo

```sh
npm run photo 2026-kyoto ~/Pictures/DSC01234.JPG ~/Pictures/DSC01235.HEIF   # 一次可以給好幾張
```

相簿還沒有的話會新建（名稱先用資料夾名稱，日期用最早的拍攝日期），有的話就加在 `photos:` 最後面。每張會：

- 縮到長邊 2560px 存成 JPG：相機原檔動輒 10 MB 以上，這個 repo 是公開的，也不需要那麼大
- 移除 EXIF 等中繼資料（包括 GPS 位置）
- 從 EXIF 讀拍攝日期，寫進 `date`

接著打開 `index.md` 改相簿名稱、寫文章、幫照片加標題和說明，用 `npm run dev` 看 http://localhost:4321/photos/。

HEIC／HEIF（iPhone、Sony 相機）在 macOS 上會自動轉檔；其他系統請先用 [Paste → JPG](https://mason276752.github.io/paste2jpg/) 轉成 JPG，或改用 /admin/ 上傳。

### 方法二：線上上傳（/admin/）

在 [/admin/](https://mason276752.github.io/admin/) 的「作品集」新增相簿，填名稱、日期、文章，在「照片」裡一張一張加：選照片、填標題和說明，可以拖曳排序。手機相簿裡的照片可以直接傳，HEIC 也可以：會先在瀏覽器裡縮到長邊 2560px、轉成 WebP 並移除 EXIF（包括 GPS），再 commit 到 `main`。

### 直接放檔案

也可以自己把照片放進相簿資料夾、加到 `photos:`。這樣原始檔會原封不動進到公開的 repo，記得先縮小，並注意 EXIF 裡的 GPS 位置。只放進資料夾、沒列在 `photos:` 的照片不會出現在網站上。

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

https://mason276752.github.io/admin/ 是 [Sveltia CMS](https://sveltiacms.app/) 後台：有表單、所見即所得編輯器、可以直接上傳圖片，手機也能用。按儲存會直接 commit 到 `main`，自動部署。作品集和首頁的自我介紹也在這裡改。

第一次使用要建一個 GitHub token：

1. 到 GitHub → Settings → Developer settings → [Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)
2. Repository access 選 **Only select repositories** → `mason276752.github.io`
3. Permissions → Repository permissions → **Contents: Read and write**
4. 產生後打開 `/admin/`，按「使用存取權杖登入」，貼上

token 只存在那個瀏覽器裡。登出或換電腦要重新貼；過期了就再產生一個。

後台的欄位定義在 `public/admin/config.yml`，改了 `src/content.config.ts` 的文章、相簿或照片欄位記得一起改。

在本機跑 `npm run dev` 時，用 Chrome／Edge 開 http://localhost:4321/admin/index.html（本機要寫完整檔名），按「使用本機倉庫」選這個資料夾，就能用同一個後台直接改本機檔案，不需要 token。

### 方法三：在 GitHub 網頁上改

每篇文章底下有「在 GitHub 上編輯」連結。要新增的話，在 GitHub 上打開 `src/content/blog/` → Add file → Create new file。

## 新增其他內容

**新增一個工具**：在 `src/content/tools/` 加一個 `.md`，檔名就是 id，/tools/ 和首頁會自動列出來。

```md
---
name: 工具名稱
tagline: 一句話說明
url: https://mason276752.github.io/<repo>/
repo: https://github.com/mason276752/<repo>
icon: /icons/<repo>.svg
category: files      # 放在哪一區：files 檔案處理、finance 美股與選擇權、learn 學習與遊戲、gallery 插圖搜尋
order: 4             # 同一區裡越小越前面
features:
  - 特色一
  - 特色二
---

一段介紹。
```

/tools/ 各區的標題、說明和按鈕文字在 `src/pages/tools/index.astro` 的 `sections`，工具之間的串接說明在同一個檔案的 `links`。首頁「我做的小工具」會自動列出所有工具。

**新增頁面**：在 `src/pages/` 加 `.astro` 或 `.md`，例如 `src/pages/uses.astro` → `/uses/`。

> 頁面路徑不要和 project repo 同名（例如 `/paste2jpg/`），那些路徑會由各自 repo 的 GitHub Pages 提供。反過來也一樣：不要開名叫 `blog`、`photos`、`tools`、`admin`、`images` 的 repo 來放 GitHub Pages。
