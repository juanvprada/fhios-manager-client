import io from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3000'; 

const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Conectado a Socket.IO');
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión Socket.IO:', error);
});

export default socket;