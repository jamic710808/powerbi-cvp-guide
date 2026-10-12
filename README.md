# Power BI 量本利分析 · 圖解導覽

給「完全不懂 Power BI、也不熟成本會計」的人看的導覽：一支 **5 分 20 秒旁白影片** ＋ 一個 **零基礎互動圖解頁**，把一份「量本利分析」Power BI 報告（6 頁）拆開來講——**賣多少，才不虧？**

> 資料為**示範（模擬）資料**，不代表任何真實公司。畫面擷取自線上公開發佈的 Power BI 報告（Publish to web，2026-10-11；封面署名 @Ken.Liu）。本專案為學習／導覽用整理，非原作者製作。

## 看成品

| 版本 | 網址 | 備註 |
|---|---|---|
| Vercel | https://powerbi-cvp-explainer.vercel.app | 影片載入最快，建議對外分享用這個 |
| GitHub Pages | https://jamic710808.github.io/powerbi-cvp-guide/ | 來源是 `gh-pages` 分支 |

互動頁含：影片章節跳轉、量・價・本・利四張卡、**可拖動的保本模擬器**、公司層／單品層、6 頁熱點說明、原生 vs HTML 對照、一筆數字的資料旅程、星狀模型（點節點亮起關聯）、口徑翻卡（真實 DAX）、68 個度量值分佈、小字典，以及「已確認事實」與「觀察／待確認」兩欄。

## 報告在回答什麼

| 頁 | 問題 |
|---|---|
| 報告首頁 | 從哪裡進去？ |
| 經營概覽 | 整體經營現在怎樣？（營收、邊際貢獻、利潤、安全邊際） |
| 公司量本利分析（Power BI 原生） | 營收、貢獻率、固定費用變了，利潤和保本點怎麼動？ |
| 公司保本與利潤模擬（HTML） | 同樣的分析，能不能更直覺地玩？ |
| 單品貢獻與保本模擬 | 這個產品該怎麼定價？還值不值得投入？ |
| 口徑說明 | 這些數字到底怎麼算？ |

核心公式（取自報告「口徑說明」頁）：**保本營收 ＝ 全部固定費用 ÷ 綜合邊際貢獻率**；以 2026 年 8 月為例，374 ÷ 30.7% ≈ 1,217 萬（報表顯示 1,217，貢獻率為四捨五入顯示值）。

模型規模（對本機 pbip 做 DAX 查詢取得）：3 張事實表（銷售與變動成本 6,912 列、固定費用 128 列、產品專屬固定費用 768 列）、4 張維度表、7 條關聯、68 個度量值。

## 事實與驗證

- 營收 44,502 萬與 CSV 加總 44,501.6 一致；固定費用 11,497 萬＝共同 9,731.2＋專屬 1,765.8（CSV 加總）。
- 影片響度 −16.6 LUFS（整合）、True Peak −3.6 dBFS。
- 獨立評審 1 輪（7.0/10，REVISE），修正紀錄見 [`film/GAUNTLET.md`](film/GAUNTLET.md)；簡報與不可宣稱事項見 [`film/BRIEF.md`](film/BRIEF.md)。

## 已知不一致（頁面與影片都有揭露）

- 「經營概覽」固定費用構成圖四塊標示加總 16,795，與中心數 11,497 不一致；原因未查，影片以遮罩處理、不引用各塊金額。
- 原生頁與 HTML 頁的小數不同：1% 利潤影響 4.4 對 4；經營槓桿 7.0 對 7.05（取整方式不同）。
- 經營利潤每年 2 月都低於 0；報表未說明原因，本專案不下結論。

## 目錄

```
capture.js               線上報告 → 逐頁 2.5× 擷取（online/）
src/explainer.template.html   互動頁範本
build_site.py            範本 + 圖片 + 時間軸 → site/index.html（章節秒數取自 film/timeline.json）
assets/                  p{i}.jpg／_s／_hi（網頁用）、_film（影片用 3000 px）
film/
  BRIEF.md  GAUNTLET.md  簡報（事實、不可宣稱）與製作／評審紀錄
  narration.json         旁白稿（一句＝一個畫面任務）
  gen_tts.py             Gemini TTS（Kore）→ audio/（24 kHz）
  build_timeline.py      依旁白實際長度排時間軸 → timeline.json
  stage.html             影片舞台：render(t) 是時間的純函式
  render.js              逐格截圖＋ffmpeg 合成
  mkaudio.py             程式合成配樂與轉場音效、混音
site/                    部署用：index.html、poster.jpg、assets/（film.mp4 見下）
qa_site.js               互動頁的互動與錯誤檢查
```

## 分支說明

- `main`：研究與製作紀錄（本分支）。**不含 `film.mp4`**（約 35 MB），避免影片進歷史。
- `gh-pages`：網站檔案（`index.html`、`film.mp4`、`poster.jpg`、`assets/`）＋ `.nojekyll`，GitHub Pages 由此發佈。
- 也沒有提交：母檔 `out_v*.mp4`（約 80 MB）、`mix*.wav`、`vo44/`、線上擷圖 `online/`——都可由腳本重現。

## 重新製作

需要 Node 22、Python（numpy、Pillow）、ffmpeg、系統 Chrome，以及 Gemini TTS 腳本。

> ⚠️ 腳本裡有**寫死的本機路徑**（puppeteer-core 位置、Chrome 路徑、`K:/antigravity/scripts/gemini_tts.py`），換電腦要先改。

```bash
node capture.js "<publish-to-web URL>" online     # 1. 擷取 6 頁
# 2. 由 online/o{i}.png 產生 assets/（3000／2400／1200／600 px 四種尺寸，見 GAUNTLET）
cd film
python gen_tts.py                                 # 3. 旁白（只重做缺檔場景；加場景代號可強制重做）
# 4. 去頭尾靜音並重取樣 44.1 kHz → vo/、vo44/（ffmpeg silenceremove + -ar 44100）
python build_timeline.py                          # 5. 排時間軸 → timeline.json
python mkaudio.py                                 # 6. 配樂與混音 → mix_raw.wav
ffmpeg -i mix_raw.wav -af loudnorm=I=-16:TP=-2:LRA=11 -ar 44100 mix.wav
node render.js . 0 319.762 out_v2.mp4             # 7. 渲染（約 16 分鐘）
cd .. && python build_site.py                     # 8. 建頁 → site/index.html
```

## 已知限制

- 獨立評審只看了 44 個抽樣畫格，兩格之間的瞬間與音訊質感未評；**旁白沒有經過人工聆聽**，數字讀法請自行確認。
- 影片結尾字卡仍有「（簡體轉繁體）」字樣（互動頁已刪除）。
- 配樂為程式合成，未另外找現成曲目。
- 畫面取自線上公開發佈版；本機 .pbip 在 Desktop 中有未儲存變更，原生圖表頁在 Desktop 截圖時未渲染，故不用 Desktop 截圖。

## 來源

介紹文章：〈賣多少才不虧？這個 Power BI 量本利分析把保本點算清楚了〉（原文為簡體）。文章配圖未引用，畫面全部重新自線上報告擷取。
