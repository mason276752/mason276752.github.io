# mason276752.github.io

https://mason276752.github.io/ 的首頁，介紹放在這個網域底下的線上小工具：

| 工具 | 網址 | Repo |
| --- | --- | --- |
| Paste → JPG | https://mason276752.github.io/paste2jpg/ | [paste2jpg](https://github.com/mason276752/paste2jpg) |
| ZIP 編輯器 | https://mason276752.github.io/zipeditor/ | [zipeditor](https://github.com/mason276752/zipeditor) |
| 簡繁轉換 | https://mason276752.github.io/ziptotaiwanzip/ | [ziptotaiwanzip](https://github.com/mason276752/ziptotaiwanzip) |

用 [Astro](https://astro.build/) 建置成純靜態網站。

## 開發

```sh
npm install
npm run dev        # http://localhost:4321/
npm run build      # 輸出到 dist/
npm run preview    # 預覽 dist/
```

推到 `main` 後，GitHub Actions（`.github/workflows/deploy.yml`）會建置並發布到 GitHub Pages（Settings → Pages → Source：GitHub Actions）。

## 結構

```
src/
├── content.config.ts      # 內容集合的欄位定義
├── content/tools/*.md     # 每個工具一個檔案
├── components/ToolCard.astro
├── layouts/BaseLayout.astro   # <head>、頁首、頁尾
├── pages/index.astro      # 首頁
├── pages/404.astro
└── styles/global.css      # 顏色與共用樣式（和工具本身同一套配色）
public/
├── favicon.svg
└── icons/                 # 各工具的圖示
```

## 新增內容

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

**新增頁面**：在 `src/pages/` 加 `.astro` 或 `.md`，例如 `src/pages/about.astro` → `/about/`。文章之類的內容可以比照 `tools` 在 `src/content.config.ts` 再定義一個集合。

> 頁面路徑不要和 project repo 同名（例如 `/paste2jpg/`），那些路徑會由各自 repo 的 GitHub Pages 提供。
