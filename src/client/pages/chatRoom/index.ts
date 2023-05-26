import './index.css';
import { io } from 'socket.io-client'

// 1. 建立 socket 連線
const clientIo = io()

clientIo.on('join', msg => {
  console.log('msg from server:', msg);
})
