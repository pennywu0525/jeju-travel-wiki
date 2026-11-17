# Wiki 與大綱品質檢查報告

日期：2026-11-16（Asia/Taipei）。檢查命令：`./check_links.ps1 -Report logs/evidence/wiki-check-final.json`。

## 已完成與實際通過
- **來源：10／10個編號**。必備metadata、來源連結與對應主題存在；SRC-04採替代官方來源，SRC-10採可讀段落，不能解讀為十篇原定文章全文均取得。
- **主題：6／6篇**。各篇具有實質內容及至少兩篇來源引用，交通篇最詳細；保留prep.md、transport.md。
- **雙向引用：26組**。主題到來源、來源回主題均檢查；每篇主題與來源均列入索引。
- **大綱：15／15頁**。頁碼連續，每頁具主要內容、呈現與互動、Wiki與來源欄位；末頁為參考資料。
- 原檔已備份，AGENTS.md與封存內容完全相同；原有來源及主題路徑均保留。[保存檢查輸出](evidence/preservation-check.json)

## 真實檢查歷程
| 次序 | 結果 | 證據 |
| --- | --- | --- |
| 首次Wiki檢查 | 失敗，1處：itinerary→SRC-05缺反向連結；Exit Code 1 | [原始失敗輸出](evidence/wiki-check-before-outline.json) |
| 補回連與metadata後 | 210個相對連結、26組雙向引用通過；Exit Code 0 | [修正後輸出](evidence/wiki-check-corrected.json) |
| Wiki通過後新增大綱 | 288個相對連結、15頁欄位通過；Exit Code 0 | [大綱後輸出](evidence/wiki-check-with-outline.json) |
| 補齊日誌後最終檢查 | 見本報告下方最終數值 | `evidence/wiki-check-final.json` |

檢查器掃描全部專案Markdown，排除程式碼區塊及行內範例；檢查本機檔案存在、檔名大小寫、來源／主題回連、索引、metadata欄位與大綱結構。專案目前使用行內Markdown連結；若日後加入參照式連結或錨點，工具會要求擴充檢查，而非默默忽略。

## 人工語意檢核
依 [來源查核紀錄](source_audit.md)，已核對來源種類、日期與重要衝突，並將未支持內容隔離：香水免稅量修正、電子卡紙本取消論撤回、無現金公車標題與適用範圍修正、紅燈右轉改用警察廳規範、LOTTE付款與駕齡不泛化、部落格過時駕照資訊不採。

[大綱](../docs/presentation_outline.md)每頁的知識範圍均對照Wiki。行程是依來源材料重組的編輯示範；主觀住宿、餐飲偏好明確標示。自動結構通過不能證明每個旅遊事實永遠有效。

## 未解決與尚未測試
- **無法取得原件**：SRC-04原自駕手冊正文；已換官方替代。SRC-10後續直連403，僅採已讀正文／索引段。
- **待查證**：動態票價、營業、船班、房價、特定卡片與App操作、Q-CODE／攜藥個案、2027政策等；不進簡報確定事實。
- **尚未測試**：GitHub實際Markdown／Mermaid渲染、外站所有連結可用性、實地乘車／駕車／付款、HTML／CSS／JS、桌機／手機版、圖片與部署。
- Mermaid流程圖已完成且人工檢視節點／回溯連線；沒有宣稱瀏覽器渲染測試通過。

目前狀態：Wiki與15頁大綱完成，等待人工確認。後續仍依 [Graph流程](../docs/workflow.md) 執行，部署另需使用者確認。

## 最終執行結果

執行時間：2026-11-16T22:02:49.392936+08:00。共 24 個 Markdown、305 個相對連結、26 組來源／主題雙向引用；錯誤 0，Exit Code 0。十筆來源、六主題及15頁大綱結構通過。

## HTML階段追加狀態｜2026-11-16

以上「尚未生成／測試」及「等待人工確認」是大綱交付時的歷史狀態。使用者現已確認並授權HTML。15頁成品、逐頁來源核對及本機桌機／手機模擬測試已完成，見[測試報告](presentation_test_report.md)與[內容核對](content_check.md)。GitHub發布、實體手機、外部來源全面重新連線仍未測試。

更新文件後的最終Markdown與雙向引用結果另存[HTML後檢查](evidence/wiki-check-after-html.json)，不覆寫前階段證據。

T04：HTML後首次連結檢查遇到結果JSON尚未產生的自我引用，Exit Code 1；[首次輸出](evidence/wiki-check-after-html-first.json)保留。檔案產生後重測，不虛報第一次即通過。此為驗證產出順序問題，修正1次。

最終重測實值：29個Markdown、427個相對連結、26組雙向引用，10筆來源、6主題、15頁大綱，錯誤0，Exit Code 0。本機暫時HTTP伺服器已停止，交付以雙擊index.html離線預覽。
