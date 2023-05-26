import './index.css';
import { io } from 'socket.io-client'

// 取得網址  queryString 的使用者名稱及房間名稱
const url = new URL(location.href);
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')
console.log(userName, roomName);

if (!userName || !roomName) {
  location.href = '/main/main.html'
}

// 1. 建立 socket 連線
const clientIo = io()

clientIo.on('join', msg => {
  console.log('msg from server:', msg);
})
