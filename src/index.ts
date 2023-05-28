import devServer from './server/dev';
import prodServer from './server/prod';
import express from 'express';
// import socket.io 和 http
import { Server } from 'socket.io'
import http from 'http'

import { name } from '@/utils';

const port = 3000;
const app = express();
// 建立 http server，傳入 express 的 app
const server = http.createServer(app)
// 建立 socket.io Server
const io = new Server(server)

// 偵聽 client 端的連線
io.on('connection',  (socket) => {
  console.log('socket from client:', socket.id);
  socket.emit('join', 'welcome')

  // 偵聽前端的 chat 事件
  socket.on('chat', (msg) => {
    console.log('server 接收:', msg);
  })
})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === 'development') {
  devServer(app);
} else {
  prodServer(app);
}

console.log('server side', name);

// 將 app.listen 改為 server.listen
server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
