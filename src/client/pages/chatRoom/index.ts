import './index.css';
import { name } from '@/utils';

import { io } from 'socket.io-client'

console.log('client side chatroom page', name);

const clientIo = io()

clientIo.on('join', msg => {
  console.log('msg from server:', msg);
})
