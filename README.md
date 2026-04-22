# 猜質數 (guessPrime)

這是一個簡單且具高度互動性的 HTML 遊戲，玩家需要判斷畫面上顯示的數字是質數還是非質數（半質數）。

## 遊戲玩法

1.  畫面會顯示一個數字及其位元數 (Bits)。
2.  玩家需要點擊「是質數」或「not 質數」按鈕進行猜測。
3.  **正確**：位元數會增加 1 (最高 64 bits)，表示難度提升。
4.  **錯誤**：位數會減少 1 (最低 8 bits)，表示難度降低。
5.  如果數字是**半質數** (p × q)，遊戲會顯示其因數分解結果。

## 技術特點

- **無障礙設計 (Accessibility)**:
  - 使用 `aria-live="polite"` 與 `aria-atomic="true"` 屬性，確保螢幕閱讀器能即時且完整地向視覺障礙使用者宣告遊戲結果（正確/錯誤及因數分解）。
- **感官回饋 (Sensory Feedback)**:
  - **音訊回饋**: 利用 `Web Audio API` 實作不同頻率與音色的音訊提示（正確時使用高頻 Sine 波，錯誤時使用低頻 Sawtooth 波）。
  - **觸覺回饋**: 支援 `Vibration API`，在手機裝置上提供震動提示。
  - **視覺動畫**: 整合 `CSS Transitions` 與 `Key  Animations` (如 `pop` 與 `shake` 效果)，以及數字更新時的 `reflow` 觸發。
- **核心演算法 (Core Algorithm)**:
  - 使用 **BigInt** 處理高位元（高達 64-bit）的大整數運算。
  - 採用 **Miller-Rabin 素性測試** 演算法，確保在大數字下的判斷效率與準確性。
- **數字生成策略**:
  - 50% 機率生成質數。
  - 50% 機率生成半質數 (p × q)，並自動計算因數分解。

## 技術棧 (Tech Stack)

- **前端框架**: 原生 HTML5, JavaScript (ES6+), CSS3
- **佈局框架**: UIKit CSS framework
- **API 使用**: Web Audio API, Vibration API, Web Crypto API (用於隨機數生成)

## 如何執行

只需使用任何現代瀏覽器直接打開 `index.html` 即可開始遊戲，無需任何建置步驟。

## 專案結構

- `index.html`: 遊戲的主介面與 Accessibility 結構。
- `js/game.js`: 遊戲核心邏輯、事件監聽與難度控制。
- `js/math-utils.js`: 數學工具函式庫（包含 Miller-Rabin 演算法與數字生成）。
- `css/`: 包含樣式表與 UIKit CSS 框架。
