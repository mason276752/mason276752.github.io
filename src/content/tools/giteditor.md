---
name: Git 編輯器
tagline: 改 commit 內容、時間與簽名
url: https://mason276752.github.io/giteditor/
repo: https://github.com/mason276752/giteditor
icon: /icons/giteditor.svg
category: files
order: 9
features:
  - 拖入 repo 或 .git 資料夾，所有分支畫成樹狀的 commit 圖
  - 修改訊息、作者、提交者，以及作者時間和提交者時間（含時區）
  - 可用 SSH（ed25519、RSA、ECDSA）或 GPG 私鑰簽名
  - Chrome、Edge 直接寫回 .git 並留下 reflog；其他瀏覽器下載 bundle 套用
---

在瀏覽器裡讀取 .git，看每個 commit 的檔案與原始物件，也能直接瀏覽 .git 資料夾。改一個 commit，後面的 commit 會跟著改寫，分支一起移過去；寫入前每一步都能復原。
