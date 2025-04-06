#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import debug from 'debug';
import http from 'http';
import { Server, Socket } from 'socket.io';

const debugLog = debug('disco:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const httpServer = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
httpServer.on('error', onError);
httpServer.on('listening', onListening);

httpServer.listen(port);

/**
 * Create a socket server
 */

const io = new Server(httpServer, {
  cors: {
    origin: 'http://127.0.0.1:3000',
    methods: ['GET', 'POST'],
  },
});

let activeSockets: string[] = [];
const rooms: string[] = []; // or read from io.of('/').adapter.rooms

let idx = 0;
function generateRoomName() {
  const roomName = 'room-' + idx;
  idx++;
  return roomName;
}

function getRandomRoom(): string {
  return rooms[Math.floor(Math.random() * rooms.length)];
}

function joinRoom(socket: Socket, new_room: boolean = false): void {
  let room: string;
  if (rooms.length == 0 || new_room === true) {
    room = generateRoomName();
    rooms.push(room);
  } else {
    room = getRandomRoom();
  }
  socket.join(room);
  console.log('Socket: ' + socket.id + ' Joined room: ' + room);
  socket.to(room).emit('user-joined-room', socket.id);
}

io.on('connection', (socket) => {
  console.log('New User Connection: ' + socket.id);
  const existingSocket = activeSockets.find(
    (existingSocket) => existingSocket === socket.id,
  );

  if (!existingSocket) {
    activeSockets.push(socket.id);
  }

  joinRoom(socket);
  console.log(io.of('/').adapter.rooms);

  socket.on('offer', (data) => {
    console.log('Offer event signaled for: ' + socket.id);
    console.log('TO: ' + data.to + ' ' + 'OFFER: ' + data.offer);
    socket
      .to(data.to)
      .emit('call-made', { offer: data.offer, from: socket.id });
  });

  socket.on('make-answer', (data) => {
    socket
      .to(data.to)
      .emit('answer-made', { answer: data.answer, from: socket.id });
  });

  socket.on('ice-candidate', async (data) => {
    console.log('Relaying ICE candidate from ' + socket.id + ' to ' + data.to);
    socket
      .to(data.to)
      .emit('ice-candidate', { from: socket.id, candidate: data.candidate });
  });

  socket.on('disconnect', () => {
    console.log('User Disconnection');
    activeSockets = activeSockets.filter(
      (existingSocket) => existingSocket !== socket.id,
    );
    socket.broadcast.emit('remove-user', {
      socketId: socket.id,
    });
  });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = httpServer.address();
  if (addr === null) {
    console.error('Address is null');
    return;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  debugLog('Listening on ' + bind);
}
