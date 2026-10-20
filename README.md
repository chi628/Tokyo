# 黃家烤雞員工旅遊｜東京行程手冊

2026/10/23–10/27 東京家族旅行的線上手冊：航班、每日行程、迪士尼地圖、淺草美食、購物與超商清單、全家共用的行李清單。

## 部署（GitHub Pages）

1. 把 `index.html` 放在 repo 根目錄並推上 `main`。
2. 到 repo 的 **Settings → Pages**，Source 選 `Deploy from a branch`，分支選 `main`、資料夾選 `/ (root)`。
3. 約一分鐘後可在 `https://<帳號>.github.io/<repo>/` 打開。

## 多人同步（Firebase Firestore）

- Firebase 設定寫在 `index.html` 裡的 `FIREBASE_CONFIG`。
- 需在 Firebase 主控台建立 **Firestore Database**（不是 Realtime Database），並把 `firestore.rules` 的內容貼到 Rules 分頁後發布。
- 同步的資料：`picks`（迪士尼想玩的設施）、`avatars`（頭貼）、`pack`（行李清單與勾選）、`config`（設施清單）。
- 若 Firebase 無法連線，頁面會自動改成只存在各自手機（localStorage）。

注意：目前規則沒有登入機制，知道網址的人都能修改清單（不能刪除文件），網址請只在家人間分享。

## 安裝到手機主畫面（離線可用）

repo 根目錄需要這幾個檔案一起推上去：`index.html`、`manifest.webmanifest`、`sw.js`、`icon-192.png`、`icon-512.png`、`apple-touch-icon.png`。

- iPhone：用 Safari 打開網址 → 分享 → 加入主畫面
- Android：用 Chrome 打開網址 → 右上選單 → 安裝應用程式／加到主畫面

第一次要在有網路時打開一次，之後沒網路也能開。離線時的修改會先存在手機，連上網後自動同步。
更新 `index.html` 後，手機只要有網路打開就會拿到新版；只有換了圖示時，才需要把 `sw.js` 裡的 `VERSION` 改成新值。
