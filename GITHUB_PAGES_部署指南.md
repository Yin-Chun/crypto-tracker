# GitHub Pages 部署指南

## 📱 讓您的加密貨幣交易記錄系統在手機和電腦上都能使用！

---

## 🎯 完成後您將獲得：

- 一個專屬網址（例如：`https://你的帳號.github.io/crypto-tracker`）
- 手機和電腦都能開啟使用
- 完全免費
- 資料安全儲存在各自裝置的瀏覽器中

---

## 📋 準備步驟（只需要做一次）

### 步驟 1：註冊 GitHub 帳號

1. 前往 https://github.com
2. 點擊右上角「Sign up」註冊
3. 填寫 Email、密碼、用戶名
4. 完成 Email 驗證

> 💡 用戶名建議：簡短易記，例如 `crypto-trader-2025`

---

### 步驟 2：建立新的儲存庫（Repository）

1. 登入 GitHub 後，點擊右上角「+」→「New repository」
2. 填寫以下資訊：
   - **Repository name**：`crypto-tracker`（或您喜歡的名稱）
   - **Description**：`加密貨幣交易記錄系統`
   - **Public**：選擇 Public（公開）
   - ✅ 勾選「Add a README file」
3. 點擊「Create repository」

> ⚠️ 注意：Repository name 會成為網址的一部分

---

### 步驟 3：上傳檔案

#### 方法 A：網頁上傳（最簡單）

1. 在您的儲存庫頁面，點擊「Add file」→「Upload files」
2. 將以下兩個檔案拖曳到網頁上：
   - `crypto_trading_tracker.html`
   - `crypto_tracker.js`
3. 將 `crypto_trading_tracker.html` **重新命名為** `index.html`
   - 點擊檔案名稱可以編輯
   - 或上傳前先在電腦上改名
4. 在下方輸入 Commit message：`初始版本 - 交易記錄系統`
5. 點擊「Commit changes」

> 💡 為什麼要改名為 index.html？
> 這樣網址才能直接開啟，不需要輸入檔案名稱

#### 方法 B：使用 GitHub Desktop（進階）

如果您熟悉 Git，也可以使用 GitHub Desktop 或指令上傳。

---

### 步驟 4：啟用 GitHub Pages

1. 在儲存庫頁面，點擊「Settings」（設定）
2. 左側選單點擊「Pages」
3. 在「Branch」區域：
   - Source：選擇「Deploy from a branch」
   - Branch：選擇「main」，資料夾選擇「/ (root)」
   - 點擊「Save」
4. 等待 1-2 分鐘，頁面會顯示您的網址

---

### 步驟 5：檢查檔案結構

確認您的儲存庫有這些檔案：
```
crypto-tracker/
├── index.html          （主要 HTML 檔案）
├── crypto_tracker.js   （JavaScript 功能檔案）
└── README.md          （說明文件）
```

---

## ✅ 完成！開始使用

### 您的網址格式：
```
https://您的GitHub用戶名.github.io/crypto-tracker
```

例如：
- 用戶名是 `john123`
- Repository 名稱是 `crypto-tracker`
- 網址就是：`https://john123.github.io/crypto-tracker`

### 如何使用：

#### 在電腦上：
1. 開啟瀏覽器
2. 輸入您的網址
3. 加入書籤方便下次使用

#### 在手機上：
1. 開啟 Safari / Chrome
2. 輸入您的網址
3. **iOS**：點擊「分享」→「加入主畫面」（像 App 一樣）
4. **Android**：點擊「選單」→「加到主畫面」

---

## 🔄 資料同步方式

### 重要概念：
- 手機和電腦的資料是**各自獨立**的
- 透過「💾 備份資料 (JSON)」和「📥 匯入資料 (JSON)」功能同步

### 同步流程：

#### 手機記錄 → 同步到電腦
```
1. 手機上點擊「💾 備份資料 (JSON)」
2. 下載 JSON 檔案
3. 透過 Line / AirDrop / Email 傳到電腦
4. 電腦上點擊「📥 匯入資料 (JSON)」
5. 選擇「合併模式」保留兩邊資料
```

#### 電腦分析 → 同步到手機
```
1. 電腦上點擊「💾 備份資料 (JSON)」
2. 將 JSON 檔案傳到手機
3. 手機上點擊「📥 匯入資料 (JSON)」
4. 選擇「合併模式」
```

---

## 📝 更新系統（當有新功能時）

如果我幫您更新了功能，您只需要：

1. 在 GitHub 儲存庫點擊要更新的檔案
2. 點擊右上角「鉛筆」圖示（Edit）
3. 刪除舊內容，貼上新內容
4. 點擊「Commit changes」
5. 等待 1-2 分鐘，重新整理網頁即可

---

## ❓ 常見問題

### Q1: 網址打開是 404 Not Found？
**A**: 等待 3-5 分鐘讓 GitHub Pages 部署完成，然後重新整理

### Q2: 檔案名稱一定要是 index.html 嗎？
**A**: 是的，這樣網址才能直接開啟

### Q3: 我的交易資料會被別人看到嗎？
**A**: 不會！資料儲存在您裝置的瀏覽器中，不會上傳到 GitHub

### Q4: 可以改成私人儲存庫嗎？
**A**: GitHub Pages 免費版必須是公開儲存庫，但您的資料不在儲存庫裡，所以很安全

### Q5: 如何刪除所有資料？
**A**: 在網頁上點擊「🗑️ 清空所有記錄」按鈕

### Q6: 換手機或換電腦後資料會遺失嗎？
**A**: 會的，因為資料存在瀏覽器中。建議定期匯出 JSON 備份

---

## 🎉 下一步

1. 先完成上述步驟，部署到 GitHub Pages
2. 在手機和電腦上測試開啟網址
3. 記錄幾筆交易測試功能
4. 測試 JSON 匯出/匯入功能

---

## 💡 進階技巧

### 自訂網域（可選）
如果您有自己的網域名稱，可以設定自訂網址：
- 例如：`crypto.yourdomain.com`
- 在 GitHub Pages 設定中的「Custom domain」設定

### PWA 功能（未來可加入）
可以將系統改造成 PWA，就能：
- 離線使用
- 更像原生 App
- 接收通知提醒

---

## 📞 需要協助？

如果遇到任何問題，請告訴我：
1. 卡在哪個步驟
2. 看到什麼錯誤訊息
3. 您的 GitHub 用戶名和儲存庫名稱

我會立即協助您解決！

---

**祝您使用順利！開始記錄您的加密貨幣交易吧！** 🚀
