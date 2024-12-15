import io from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3000'; 

const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ['websocket']
});

socket.on('connect', () => {
  
});

socket.on('connect_error', (error) => {
  
});

export default socket;