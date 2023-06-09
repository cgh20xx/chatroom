import './index.css';
import { io } from 'socket.io-client'
import { UserData, default as UserService } from '@/service/UserService'

type UserMsgData = UserData & { 
  msg: string,
  time: number
} // 擴充 type UserData, 新增 msg

// 1. 建立 socket 連線
const socket = io()

// 取得網址  queryString 的使用者名稱及房間名稱
const url = new URL(location.href);
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')
console.log(userName, roomName);

if (!userName || !roomName) {
  location.href = '/main/main.html'
}

socket.emit('join', { userName, roomName })

const inputText = document.getElementById('inputText') as HTMLInputElement
const btnSubmit = document.getElementById('btnSubmit') as HTMLInputElement
const chatBoard = document.getElementById('chatBoard') as HTMLDivElement
const headerRoomName = document.getElementById('headerRoomName') as HTMLParagraphElement
const headerHeadCount = document.getElementById('headerHeadCount') as HTMLDivElement
const btnBack = document.getElementById('btnBack') as HTMLButtonElement
// 用 as 斷言成指定型別，否則 getElementById 預設為 HTMLElement | null 的聯合型別，之後也無法正確提示屬性。

headerRoomName.textContent = roomName

function msgHandler(data: UserMsgData) {
  const date = new Date(data.time)
  const time = `${date.getHours()}:${date.getMinutes()}`
  
  const msgBox = document.createElement('div')
  msgBox.classList.add('flex', 'mb-4', 'items-end')
  // 如果收到訊息的 socket id 和自己的 socket id 一樣的話，訊息顯示在右側
  if (data.id === socket.id) {
    msgBox.classList.add('justify-end')
    msgBox.innerHTML = 
    `<div class="flex justify-end mb-4 items-end">
      <p class="text-xs text-gray-700 mr-4">${time}</p>
      <div>
        <p class="text-xs text-white mb-1 text-right">${data.userName}</p>
        <p
          class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-2xl rounded-br-2xl rounded-tl-2xl"
        >
          ${data.msg}
        </p>
      </div>
    </div>`
  } else {
    // 否則訊息顯示在左側
    msgBox.classList.add('justify-start')
    msgBox.innerHTML = 
    `<div>
      <p class="text-xs text-gray-700 mb-1">${data.userName}</p>
      <p
        class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-white"
      >
        ${data.msg}
      </p>
    </div>
    <p class="text-xs text-gray-700 ml-4">${time}</p>`
  }
  
  chatBoard.appendChild(msgBox)
  // 將聊天室的捲軸下拉到最後一筆訊息 (當很多訊息時會有捲軸)
  chatBoard.scrollTop = chatBoard.scrollHeight
}

function roomMsgHandler(msg: string) {
  const div = document.createElement('div')
  div.classList.add('flex', 'justify-center', 'mb-4', 'items-center')
  div.innerHTML = `<p class="text-gray-700 text-sm">${msg}</p>`
  chatBoard.appendChild(div)
  chatBoard.scrollTop = chatBoard.scrollHeight
}

function headCountHandler(headCount: number) {
  headerHeadCount.textContent = `(${headCount})` 
}

btnSubmit.addEventListener('click', (e) => {
  const text = inputText.value
  // 如果輸入框沒有內容則跳出
  if (text === '') return;
  // 將訊息發送到後端
  socket.emit('chat', text)
  // 清空輪入框
  inputText.value = ''
});

btnBack.addEventListener('click', (e) => {
  location.href = '/main/main.html'
});


socket.on('connect', () => {
  // 在連接之後才可以拿到後端傳來的 socket id
  console.log('connected socket.id = ', socket.id);
  // 注意1：不該在此偵聽其它事件，因為每次 Socket 重新連接時都會重新註冊一個新的 handler
  // 注意2：這裡拿到的 socket.id 是暫時的，會因每次連線都不同，不能做為使用者的永久 id。
})

// 偵聽後端來的 join 事件
socket.on('join', (msg: string) => {
  console.log('join from server:', msg);
 roomMsgHandler(msg)
})

// 偵聽後端來的 leave 事件
socket.on('leave', (msg: string) => {
  console.log('leave from server:', msg);
 roomMsgHandler(msg)
})

// 偵聽後端來的 chat 事件
socket.on('chat', (data: UserMsgData) => {
  console.log('UserMsg from server:', data);
  msgHandler(data);
})

// 偵聽後端來的 headCount 事件(聊天室人數)
socket.on('headCount', (headCount: number) => {
  console.log('headCount from server:', headCount);
  headCountHandler(headCount);
})