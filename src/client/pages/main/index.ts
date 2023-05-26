import './index.css';

// document.getElementById() 回傳預設型別會是 HTMLElement | null
const inputName = document.getElementById('inputName') as HTMLInputElement
const selectRoom = document.getElementById('selectRoom') as HTMLSelectElement
const btnStart = document.getElementById('btnStart') as HTMLButtonElement

btnStart.addEventListener('click', () => {
  const userName = inputName.value
  const roomName = selectRoom.value

  // 點擊加入按鈕跳轉到房間頁：http://localhost:3000/chatRoom/chatRoom.html?user_name=hank&room_name=ROOM3
  const url = new URL(location.href);
  url.pathname = '/chatRoom/chatRoom.html'
  url.searchParams.append('user_name', userName)
  url.searchParams.append('room_name', roomName)
  console.log(url)
  location.href = url.toString()
})