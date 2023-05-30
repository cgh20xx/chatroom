import devServer from '@/server/dev'
import prodServer from '@/server/prod'
import express from 'express'
// import socket.io 和 http
import { Server } from 'socket.io'
import http from 'http'
import UserService from '@/service/UserService'

import { name } from '@/utils'

const port = 3000;
const app = express();
// 建立 http server，傳入 express 的 app
const server = http.createServer(app)
// 建立 socket.io Server
const io = new Server(server)
// 建立 UserService 管理所有使用者資訊
const userService = new UserService()

// 偵聽 client 端的連線
io.on('connection',  (socket) => {
  console.log('socket from client:', socket.id);
  // 偵聽前端的 join 事件
  socket.on('join', ({ userName, roomName}: { userName: string, roomName: string}) => {
    const usesrData = userService.userDataInfoHandler(
      socket.id,
      userName,
      roomName
    )
    userService.addUser(usesrData)
    // 廣播 join 事件到所有前端
    io.emit('join', `${userName} 加入了  ${roomName} 聊天室`)
  })

  // 偵聽內建的 disconnect 事件
  socket.on('disconnect', (msg) => {
    const userData = userService.getUser(socket.id)
    const userName = userData?.userName
    if (userName) {
      // 廣播 leave 事件到所有前端
      io.emit('leave', `${userName} 離開聊天室`)
    }
    userService.removeUser(socket.id)
  })

  // 偵聽前端的 chat 事件
  socket.on('chat', (msg) => {
    // 廣播 chat 事件到所有前端
    io.emit('chat', msg)
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
