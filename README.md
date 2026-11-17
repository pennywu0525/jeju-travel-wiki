# 第一次去濟州島自由行完整攻略

大學 AI 課程第十週作業：LLM Wiki ＋ 15 頁互動式 HTML 教學簡報。

## 電腦預覽（不需安裝）
1. 開啟本專案資料夾，在檔案總管雙擊 `index.html`。
2. 使用 Microsoft Edge 或 Chrome 開啟。簡報、插畫、互動與本機 Wiki 均可離線運作；外部原始網站需要網路。
3. 用下方上一頁／下一頁、鍵盤左右方向鍵，或頁碼旁下拉選單切換。頂端可直達六大主題。
4. 手機窄版或內容較長時，在頁面中央上下捲動；底部翻頁列固定可用。頂端主題列可左右滑動。
5. 點擊頁尾來源，會在新分頁開啟 `wiki.html` 的對應筆記。閱讀器保留原始 Markdown 檔案與來源連結。

請保留 `index.html`、`wiki.html` 與 `assets/` 的相對位置，不要只把一個 HTML 搬走。原始 `wiki/`、`docs/`、`logs/` 也應一併保留，供查證與繳交。

## 操作提示
- 第4頁切換自駕／大眾運輸；第6頁右轉情境題會顯示解釋。
- 第2頁選分區；第7～9、11、13頁可切換情境。
- 第5、6、8、10、12、15頁可展開補充內容。
- 第3與14頁可勾選自查；勾選只保留於目前頁面工作階段，重新整理後重置，不代表官方審核。
- 鍵盤 Home／End 可到第一／最後頁；操作下拉選單時方向鍵仍留給原生選單。

## 專案結構
- `index.html`：15頁互動簡報。
- `assets/style.css`、`assets/app.js`：版面與互動；自製SVG插畫亦在此。
- `wiki.html`：離線可讀的Wiki閱讀器；`wiki/`保留原始十筆來源、六大主題與總索引。
- `content/slides.json`：完整頁面文案與引用的單一編輯來源。
- [已確認大綱](docs/presentation_outline.md)、[逐頁內容](docs/presentation_content.md)、[內容查核](logs/content_check.md)。
- [Loop / Graph](docs/workflow.md)、[實際測試報告](logs/presentation_test_report.md)、[課程成果摘要](docs/course_summary.md)。

## 本機伺服器（可選）
在本資料夾開啟PowerShell執行 `python -m http.server 8765 --bind 127.0.0.1`，再於瀏覽器開啟 `http://127.0.0.1:8765/`。結束時在該PowerShell按Ctrl+C。一般預覽直接雙擊HTML即可，不必開伺服器。

## 修改與重新產生
完整文案在 `content/slides.json`；修改後以Node.js執行 `scripts/build_site.cjs`，需可解析 `marked` 套件。生成後重新跑 `check_links.ps1` 與瀏覽器檢查。觀看成品不需要Node或任何套件。

## GitHub Pages 準備
入口位於根目錄 `index.html`，資源使用相對路徑、無API Key、無後端及CDN依賴。部署時需保留assets與Wiki、文件相對位置。目前僅完成本機成品，**尚未發布**；確認成品後再決定儲存庫、分支及Pages設定。離線測試不等於GitHub Pages部署測試。
