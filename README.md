# Chatroom

## 如何使用？

1. 進入專案目錄，先安裝node_module依賴

```
npm i
```

2. 本地啟動專案

```
npm run dev
```

[http://localhost:3000/main](http://localhost:3000/main)

## 上線前編譯專案

```
npm run build
```

## 上線後，在機器上執行prod.ts

```
npm run start
```

## 本地開發總流程：
1. 執行 server 端 `src/index.ts`
2. webpack 起動編譯（做出 main 跟 chatRoom 頁面）
3. 使用者在瀏覽器發起對應 `dev.ts` 裡的url請求
4. sever 回傳對應的頁面（由 webpack 編譯好的 client 頁面）


## 專案主要分成：

- （client端）HTML5頁面
1. `npm run build` -> 建立 client 資源
2. 過程：
    2-1. Webpack 編譯 TS+CSS+main.html -> Main 頁面
    2-2. Webpack 編譯 TS+CSS+chatRoom.html -> chatroom 頁面

- （Server端）Node Server
3. 啟動 express server
4. 判斷當前 process.env.NODE_ENV 環境：
    4-1 本地開發走 `dev.ts`，
    4-2 線上環境走 `prod.ts`

5. user 從瀏覽器(client端)對 Node Server 請求頁面：
```
localhost:3000/main
localhost:3000/chatroom

dev.ts -> 重定向到 main/main.html 跟 chatRoom/chatRoom.html
prod.ts -> 直接返回 main/main.html 跟 chatRoom/chatRoom.html

```