# 專案執行與審計日誌 (Project Workflow & Ingest Audit Log)

本文件依據 [AGENTS.md](../AGENTS.md) 規範建立，真實記錄資料攝取（Ingestion）、Graph 節點狀態檢驗、錯誤回溯及修訂歷程。

---

## 一、資料攝取日誌 (Ingestion Log)

| 匯入日期 | 來源編號 | 原文標題 | 來源單位 / 網址 | 可信度評估 | 匯入狀態 | 萃取重點與關聯主題 |
| :---: | :---: | :--- | :--- | :---: | :---: | :--- |
| 2026-11-16 | **SRC-01** | 主要國家(地區)對我國國際、國內駕駛執照使用情形——大韓民國（韓國） | 交通部公路局 (THB)<br>`https://www.thb.gov.tw/cp.aspx?n=302` | **官方最高權威** (Gov Official) | **已修正通過** | • 2022-02-17 台韓國際駕照相互承認生效。<br>• 備忘錄互惠車種為自用小客車 (Class B)。<br>• 機車適用性與入境一年期限無直接記載，列為待查證。<br>• 出國攜帶駕照正本、國際駕照正本與護照之法定功能區分。<br>• 國內駕照逾期建議出國前換發。<br>• 關聯：`[交通與租車](../topics/transport.md)`, `[行前準備](../topics/prep.md)` |
| 2026-11-16 | **SRC-02** | 大韓民國（Korea）簽證及入境須知 | 外交部領事事務局 (BOCA)<br>`https://www.boca.gov.tw/sp-foof-countrycp-01-2-aff61-1.html`<br>*(補充官方來源：韓國出入國政策本部、關稅廳、法務部 K-ETA、食藥處 MFDS、BOCA 管制藥品公告)* | **官方最高權威** (Gov Official) | **已修正通過** | • 國人持護照（效期6個月以上）以「觀光目的」享 90 天免簽證；非觀光目的需另向代表處申辦。<br>• 2026 年現行入境卡：紙本雙軌過渡期於 2025 年底結束，2026 年原則上應於抵達前 72 小時線上填報 e-Arrival Card。<br>• 暫免 K-ETA 措施現行截止日為 2026-12-31，2027 年適用狀態未定，行前須重新查證。<br>• 關稅廳現行酒類免稅額為總容量 2L 以下且總值 400 美元以下，已無 2 瓶限制。<br>• 嚴禁攜帶豬肉製品（非洲豬瘟初犯罰 500 萬韓元起）。<br>• 管制藥品需出發前至少 10 個工作天至 MFDS 線上取得攜入許可。<br>• 關聯：`[行前準備](../topics/prep.md)` |
| 2026-11-16 | **SRC-03** | 濟州島的公共交通 (Public Transportation in Jeju) | Visit Jeju 濟州觀光公社<br>`https://www.visitjeju.net/zh/detail/view?contentsid=CNTS_200000000012534`<br>*(補充官方來源：韓國觀光公社 VISITKOREA 市區公車指南 `https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=219&vcontsId=220897`)* | **官方觀光公社** (Official Tourism) | **已修正通過** | • 公車色彩分級：紅色急行 (1xx 主要行經機場與轉運站)、藍色幹線 (2xx/3xx/5xx)、綠色支線 (4xx/6xx/7xx)、黃色觀光循環 (810/820)。<br>• 機場 600 號豪華巴士直達中文區與西歸浦大飯店。<br>• 濟州全境公車無現金收費（由 VISITKOREA 官方資料支持），上下車皆須感應 T-money 交通卡。<br>• 下車後 40 分鐘內轉乘不同路線享優惠；全車免費 Wi-Fi；使用 Naver Map 查即時動態。<br>• 候車招手為乘車實務建議（非強制法規）；按下車鈴停妥再下車；票價、班距與飲食限制標記待查證。<br>• 關聯：`[交通與租車](../topics/transport.md)` |

---

## 二、Graph 節點檢查紀錄 (Graph Node Check)

### 節點：【來源檢查 Verification】與【Wiki 整合 Integration】（SRC-03 來源歸屬修訂）
- **執行時間**：2026-11-16
- **輸入 (Inputs)**：
  - 使用者查驗審核回饋意見
  - Visit Jeju 官方專題文章（`https://www.visitjeju.net/zh/detail/view?contentsid=CNTS_200000000012534`）
  - 韓國觀光公社 VISITKOREA 官方市區公車指南（`https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=219&vcontsId=220897`）
- **輸出 (Outputs)**：
  - `wiki/sources/SRC-03.md`（修正無現金公車來源歸屬、調整招手搭車為實務建議、嚴格審定未支持項目）
  - `wiki/sources/SRC-02.md`（依指示於補充來源增補外交部管制藥品專屬公告網址）
  - `wiki/topics/transport.md`（同步修訂大眾運輸篇章之來源標註與待查證界限）
  - `wiki/INDEX.md`（維持標準 Markdown 相對連結與已完成狀態）
- **資料來源歸屬與事實對應檢核**：
  1. *無現金收費政策歸屬問題*：原將無現金公車直接歸因於 Visit Jeju 文章，現已增列韓國觀光公社 VISITKOREA 官方公告為正式支持依據，確認濟州全境市區公車納入無現金營運。
  2. *招手搭車性質修正*：刪除「強制規定」之誤導性陳述，精確定性為站牌多線共用時之「乘車實務建議」。
  3. *未獲原始依據項目收斂*：
     - T-money 為 SRC-03 官方唯一指定基準卡種，其他多功能卡（Cashbee、WOWPASS）標記為待查證。
     - 車廂飲食罰責條文自確認事實中移出，改列為待查證／乘車禮儀建議。
     - 紅色急行公車機場停靠點精確表述為「主要路線行經機場」，特定路線以即時公車路線表為準。
- **雙向連結有效性檢查（GitHub 相對路徑驗證）**：
  - 經 PowerShell 腳本全量檢驗，59 處相對連結 100% 正確解析至真實檔案（TargetExists = True），Exit Code: 0。

---

## 三、錯誤與修正審計追蹤 (Error & Backtrack Log)

- **審計紀錄（事件追蹤）**：
  1. **事件 1（來源網址與行車方向校對）**：修正 10 篇網址及確認左駕靠右行駛。
  2. **事件 2（雙向連結改用相對路徑與證據範圍收斂）**：轉換 Obsidian 語法至 GitHub 相對 Markdown 連結，精確界定 SRC-01 證據範圍。
  3. **事件 3（SRC-02 規範校正）**：更新 2026 入境卡過渡期結束事實、刪除酒類 2 瓶限制、增列 K-ETA 2027 未定提示與純觀光免簽認定。
  4. **事件 4（SRC-03 資料來源歸屬不正確修正）**：
     - **現象**：
       1. 無現金收費政策缺乏直接官方支持來源，逕行歸因於 SRC-03。
       2. 招手搭車寫成強制規定，缺乏法規依據。
       3. 飲食罰責、非 T-money 票卡品牌、急行全數停靠機場等延伸資訊未獲 SRC-03 原始文字直接支持。
     - **修正方式**：
       1. 補充韓國觀光公社 VISITKOREA 官方市區公車指南（`vcontsId=220897`）作為無現金公車之法定依據。
       2. 將招手搭車定性為一般實務乘車建議。
       3. 未獲直接支持之票卡品牌、飲食罰則標記為「待查證」，急行路線精準修訂。
     - **返回節點**：來源檢查 (Verification) $\rightarrow$ Wiki 整合 (Integration)。

---

## 四、前任階段待辦事項（歷史紀錄；已由下方 Codex 續作更新）
- 等待使用者確認 SRC-03 修正成果與連結測試。
- 確認無誤後，進入 `SRC-04`（Visit Jeju 官方宣傳手冊與自駕指南，`https://www.visitjeju.net/u/Bp8`）之資料 Ingest。

## 2026-11-16 Codex 接手／修正前檢查
- 實際存在 SRC-01～03、prep.md、transport.md、INDEX.md 與本日誌；不存在 check_links.ps1。
- 已完整讀取既有文件；原日誌「59 處連結通過」屬前任紀錄，本次尚未重測，不視為本次測試證據。
- 待核對：SRC-02 香水 60ml、2026 電子卡全面取代紙本、K-ETA 僅列首頁；SRC-03 公車分類與無現金政策直接依據；SRC-01 將生效日當發布日期。
- 使用者本次授權連續完成 SRC-04～10、Wiki 與大綱，取代 AGENTS.md 早期僅建立規範之階段限制。HTML 仍需人工確認。


## 2026-11-16 續作與首次實際檢查
- 續作時實際確認：十篇來源、六大主題、source_audit.md 與 workflow.md 已存在；品質報告仍標待測，尚無簡報大綱與 check_links.ps1，故未重做 Ingest。
- 新增 check_links.ps1 與 scripts/check_wiki.py。首次實跑 23 個 Markdown、209 個本機連結、26 組來源／主題引用；Exit Code 1。
- 真實錯誤 E12：itinerary.md 引用 SRC-05.md，但來源無回連。已補回連及 topics metadata，修正次數1；原始失敗輸出保留於 evidence/wiki-check-before-outline.json。
- 語意複查另收斂 SRC-01 長期換照程序至官方公告支持的概述，具體文件仍待查證；修正 SRC-03 文字重複。未更改 AGENTS.md。


## 2026-11-16 SRC-04～SRC-10 批次完成紀錄
以下均於本次實際閱讀可取得內容後寫入。查閱日期2026-11-16；每筆原／替代網址、日期與限制詳來源筆記及 source_audit.md。不把部落客心得稱為主管機關規範。

| 編號 | 實際採用標題 | 作者／機構 | 主網址 | 完成範圍 |
| --- | --- | --- | --- | --- |
| [SRC-04](../wiki/sources/SRC-04.md) | Guide & Maps 入口查核；以警察廳右轉規範替代未取得之自駕手冊 | Visit Jeju；韓國警察廳（政策簡報平台） | [原文](https://www.korea.kr/news/policyNewsView.do?newsId=148914126) | 原手冊無法取得；已讀警察廳替代規範 |
| [SRC-05](../wiki/sources/SRC-05.md) | Rental information | LOTTE rent-a-car | [原文](https://www.lotterentacar.net/hp/eng/reservation/shortInfo/pay.do) | 業者資格、付款、取還車與CDW |
| [SRC-06](../wiki/sources/SRC-06.md) | 濟州島自駕遊攻略》濟州島自駕租車/駕照/導航/停車/加油方式一次看 | KKday 編輯部（未辨識個別署名） | [原文](https://www.kkday.com/zh-tw/blog/207768/asia-korea-jeju-island-road-trip) | 實務建議與分區；不充分安全主張排除 |
| [SRC-07](../wiki/sources/SRC-07.md) | 【濟州島交通】公車巴士多少錢/搭乘方式/好用APP，不開車必看！ | 嗯嗯。莉莉嗯 | [原文](https://lillian.tw/jeju_traffic/) | 2024交通經驗；現金舊說法不沿用 |
| [SRC-08](../wiki/sources/SRC-08.md) | 【2026濟州島住宿】10家韓國濟州飯店推薦：新舊城區＆西歸浦住宿實住攻略 | Mimi韓 | [原文](https://mimigo.tw/jeju-hotel/) | 同站轉址後區域介紹；房價不採 |
| [SRC-09](../wiki/sources/SRC-09.md) | 【濟州島景點】20個韓國濟州島自由行好玩景點推薦、旅遊行程＆優惠票券攻略 | Mimi韓 | [原文](https://mimigo.tw/jeju-travel/) | 同站轉址後景點；過時駕照段排除 |
| [SRC-10](../wiki/sources/SRC-10.md) | 【濟州島自由行2026】TOP10濟州島必去景點推薦！行程規劃、美食、交通全收錄 | BringYou／飄兒 | [原文](https://www.bring-you.info/zh-tw/jeju-island-travel-guide) | 可讀正文與同網址索引段；後續直連403 |


### 品質檢查與大綱節點
- E12補回連後實跑：23個Markdown、210個相對連結、26組來源／主題雙向引用，Exit Code 0；見 [修正後原始輸出](evidence/wiki-check-corrected.json)。此時尚無大綱，先通過Wiki檢查。
- 接著依六主題執行Wiki查詢，產生 [15頁大綱](../docs/presentation_outline.md)；每頁均有主要內容、呈現／互動提案、Wiki主題與來源編號。沒有先產HTML。
- 加入大綱後實跑：24個Markdown、288個相對連結、26組雙向引用、15頁大綱，Exit Code 0；見 [大綱後輸出](evidence/wiki-check-with-outline.json)。
- 最終文件補齊後再跑一次，完整結果保存在 `evidence/wiki-check-final.json`，數值以該檔及品質報告為準。
- 直接比對封存原檔確認AGENTS.md未變動；SRC-01～03與prep/transport路徑保留，備份存在；檔案搜尋未發現HTML。見 [保存檢查](evidence/preservation-check.json)。
- Graph已記真實來源回溯與E12連結修正，沒有新增虛構HTML測試案例。Mermaid僅人工檢查語法結構，GitHub實際渲染尚未測試。
- **目前停在人工確認閘門**：等待使用者確認大綱。逐頁完整內容、HTML、RWD、翻頁、圖片、實地交通與GitHub部署均尚未執行／尚未測試。

最終執行實值：24個Markdown、305個相對連結、26組雙向引用，0錯誤，Exit Code 0；十筆來源、六主題、15頁大綱結構通過。只補寫數值，未再修改任何連結。

## HTML製作階段｜2026-11-16

使用者已明確確認15頁大綱與Graph，授權製作並測試HTML，要求先不發布。前文等待確認及尚無HTML是上一階段歷史狀態。

依Wiki完成15頁內容與來源映射，生成index.html、wiki.html、CSS、原生JavaScript與自製SVG。未增加未入庫的旅遊事實。製作離線閱讀器讓每頁引用可直接閱讀。

實跑node語法檢查及Playwright Edge：313項首次312通過、1項測試判準失敗；T03修正一次後單獨重測通過，最終彙整313通過。60個頁面尺寸組合無水平溢出，30張截圖、0 JavaScript錯誤、0本機請求失敗。已檢視桌機／手機總覽與代表頁面。詳見[測試報告](presentation_test_report.md)。

更新Graph、核准狀態、README與[課程摘要](../docs/course_summary.md)。原Wiki來源限制持續保留；未發布GitHub Pages。

T04：HTML後首次連結檢查遇到結果JSON尚未產生的自我引用，Exit Code 1；[首次輸出](evidence/wiki-check-after-html-first.json)保留。檔案產生後重測，不虛報第一次即通過。此為驗證產出順序問題，修正1次。

最終重測實值：29個Markdown、427個相對連結、26組雙向引用，10筆來源、6主題、15頁大綱，錯誤0，Exit Code 0。本機暫時HTTP伺服器已停止，交付以雙擊index.html離線預覽。
