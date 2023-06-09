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
  socket.on('join', async ({ userName, roomName}: { userName: string, roomName: string}) => {
    const userData = userService.userDataInfoHandler(
      socket.id,
      userName,
      roomName
    )
    // 加入房間機制
    socket.join(userData.roomName)
    userService.addUser(userData)

    // 廣播 join 事件到該房間的前端 (broadcast 不含自己，這這邊不寫 brodcast 也沒關係，因為 socket.to 就不含自己)
    const joinMsg = `${userName} 加入了  ${roomName} 聊天室`
    socket.broadcast.to(userData.roomName).emit('join', joinMsg)

    // 取得指定聊天室人數
    const sockets = await io.in(userData.roomName).fetchSockets();
    const headCount = sockets.length
    // 廣播聊天室人數到該房間的前端
    io.to(userData.roomName).emit('headCount', headCount)
  })

  // 偵聽內建的 disconnect 事件
  socket.on('disconnect', async (msg) => {
    const userData = userService.getUser(socket.id)

    if (userData) {
      // 廣播 leave 事件到該房間的前端 (broadcast 不含自己，這這邊不寫 brodcast 也沒關係，因為 socket.to 就不含自己)
      const leaveMsg = `${userData.userName} 離開 ${userData.roomName} 聊天室`
      socket.broadcast.to(userData.roomName).emit('leave', leaveMsg)

      // 取得指定聊天室人數
      const sockets = await io.in(userData.roomName).fetchSockets();
      const headCount = sockets.length
      // 廣播聊天室人數到該房間的前端
      io.to(userData.roomName).emit('headCount', headCount)
    }
    userService.removeUser(socket.id)
  })

  // 偵聽前端的 chat 事件
  socket.on('chat', (msg) => {
    const userData = userService.getUser(socket.id)
    const roomName = userData?.roomName
    const time = Date.now()
    if (roomName) {
      // 用 io 廣播 chat 事件到所有前端 (含自己)
      io.to(roomName).emit('chat', { ...userData, msg, time })
      // 注意：不可用 socket.to 因為送出訊息不含自己
      // 注意：沒有 io.broadcast 這種寫法
    }
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
