# 15頁 HTML 簡報實際測試報告

測試日期：2026-11-16（Asia/Taipei）。環境：Windows、Playwright、Microsoft Edge 157.0.4341.60（Chromium headless）。未部署 GitHub Pages。

## 結果與證據

首次完整測試執行313項檢查，312項通過、1項測試預期錯誤；修正該斷言後單獨重測通過。最終彙整313項均通過，並非宣稱整套重跑。原始失敗及重測各自保留。

- [首次完整輸出](evidence/browser/results-first-run.json)
- [單獨重測輸出](evidence/browser/keyboard-corrected.json)
- [最終彙整輸出](evidence/browser/results.json)
- [完整測試程式](../scripts/test_presentation.cjs)、[針對性重測程式](../scripts/test_select_focus.cjs)

| 尺寸 | 頁面數 | 實際結果 |
| --- | --- | --- |
| 桌機1440×960 | 15 | 無水平溢出，來源可捲動到達 |
| 筆電1366×768 | 15 | 無水平溢出，來源可捲動到達 |
| 手機390×844 | 15 | 單欄，無水平溢出，來源可捲動到達 |
| 小手機320×740 | 15 | 無水平溢出，來源可捲動到達 |

共60個頁面尺寸組合；保存桌機15張、手機15張畫面。檢視兩份全頁縮圖總覽，另檢視桌機1、6、15頁及手機1、4頁原尺寸畫面，未見重疊或破版。長內容需要中央捲動，這是版面設計，不是所有內容都塞在一個螢幕。

[桌機總覽](evidence/browser/desktop-overview.png) · [手機總覽](evidence/browser/mobile-overview.png)

## 實際通過項目

- 15頁結構、單頁顯示、前後翻頁及首尾邊界、方向鍵、Home／End、頁碼選單、六章跳轉、深連結及越界頁碼處理。
- 自駕／大眾運輸、區域地圖、公車、住宿、東部、美食與五日行程切換；右轉題正誤回饋、四日展開內容、清單勾選及重置。
- 鍵盤Enter、原生下拉選單方向鍵及手機觸控模擬。
- 100次本機連結／資源目標檢查（含重複目標），來源彈出閱讀器、Wiki內部導航、SVG載入。
- HTTP本機預覽及直接file://開啟簡報、互動和Wiki閱讀器。
- 瀏覽器JavaScript錯誤0、本機請求失敗0。
- app.js與wiki.js通過node --check。

## 真實修正 T03

原測試假定下拉選單按ArrowLeft後仍停第4頁；實際原生選單會選到第3頁，簡報正確跟隨選擇。修正測試以選單值和可見頁一致、焦點保留、最多移動一項為判準。重測實際selected=3、visible=slide-3、focus=page-select，通過。回溯節點：功能測試→修正測試判準→重測；修正1次，沒有為通過測試改壞產品鍵盤行為。

## 測試界線

手機是瀏覽器尺寸／觸控模擬，未使用實體手機或Safari／Firefox。未執行無障礙完整稽核、GitHub Pages部署、GitHub Mermaid渲染、所有外部網址重新連線或實地旅遊操作。旅遊來源沿用當日Wiki已核對範圍；待查證項目不宣稱已解決。逐頁語意檢核見[內容查核](content_check.md)，結構映射見[來源映射](evidence/slide-grounding.json)。

補充：上述本機請求失敗0限於Playwright測試頁面監聽結果；暫時HTTP伺服器另有預覽請求404紀錄，不宣稱整個預覽期間所有HTTP請求皆成功。簡報所用SVG／CSS／JS與來源目標已另行檢查通過。
