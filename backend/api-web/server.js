const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.options('*', cors());
const server = http.createServer(app);

var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Manejar eventos del socket aquí
  socket.on('recibir_app', (message) => {
    console.log('Mensaje recibido:', message);

    // Emitir el mensaje a todos los clientes conectados
    io.emit('recibir_app', message);

  });

  socket.on('actualizar_app', (message) => {
    console.log('Mensaje recibido:', message);

    // Emitir el mensaje a todos los clientes conectados
    io.emit('actualizar_app', message);

  });

  // Manejar evento de desconexión del socket
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(2006, () => {
  console.log('Servidor Socket.io escuchando en el puerto 2006');
});