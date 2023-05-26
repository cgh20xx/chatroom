import './index.css';

// document.getElementById() 回傳預設型別會是 HTMLElement | null
const inputName = document.getElementById('inputName') as HTMLInputElement
const selectRoom = document.getElementById('selectRoom') as HTMLSelectElement
const btnStart = document.getElementById('btnStart') as HTMLButtonElement

btnStart.addEventListener('click', () => {
  const userName = inputName.value
  const roomName = selectRoom.value

  console.log(userName, roomName);
})