import './index.css';
import { io } from 'socket.io-client'

// 1. 建立 socket 連線
const clientIo = io()

// 取得網址  queryString 的使用者名稱及房間名稱
const url = new URL(location.href);
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')
console.log(userName, roomName);

if (!userName || !roomName) {
  location.href = '/main/main.html'
}

const inputText = document.getElementById('inputText') as HTMLInputElement
const btnSubmit = document.getElementById('btnSubmit') as HTMLInputElement
// 用 as 斷言成指定型別，否則 getElementById 預設為 HTMLElement | null 的聯合型別，之後也無法正確提示屬性。

btnSubmit.addEventListener('click', (e) => {
  const text = inputText.value
  // 將訊息發送到後端
  clientIo.emit('chat', text)
});




clientIo.on('join', msg => {
  console.log('msg from server:', msg);
})
