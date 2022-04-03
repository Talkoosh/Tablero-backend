const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null;

function connectSockets(http, session) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  });
  gIo.on('connection', (socket) => {
    socket.on('disconnect', (socket) => {
      console.log('Someone disconnected');
    });
    socket.on('board-entered', (boardId) => {
      if (socket.currBoardId === boardId) return;
      if (socket.currBoardId) {
        socket.leave(socket.currBoardId);
      }
      socket.join(boardId);
      socket.currBoardId = boardId;
    });
    socket.on('board-updated', () => {
      // emits to all sockets:
      // gIo.emit('chat addMsg', msg)
      // emits only to sockets in the same room
      // gIo.to(socket.currBoardId).emit('chat addMsg', msg);
      socket.broadcast.to(socket.currBoardId).emit('update-board');

    });
    socket.on('task-entered', taskId => {
      if (socket.currTaskId === taskId) return;
      if (socket.currTaskId) {
        socket.leave(socket.currTaskId);
      }
      socket.join(taskId);
      socket.currTaskId = taskId;
    });
    socket.on('task-updated', (task) => {
      socket.broadcast.to(socket.currTaskId).emit('update-task');
    });
  });

}

module.exports = {
  connectSockets,
};
