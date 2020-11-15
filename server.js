const path = require('path');
const http = require('http');
const express = require('express');
//var engine = require('ejs-mate');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

/* app.engine('ejs',engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set static folder */
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';
const userData = [];
// Run when client connects
io.on('connection', socket => {
  socket.emit('connectUser',{userData});

  socket.on('joinRoom', ({ username, room, status }) => {
    const user = userJoin(socket.id, username, room, status);
      console.log(user.id)
    socket.join(user.room);
    userData.push(user);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg, ImgData ) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg), ImgData);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    const index = userData.findIndex(user => user.id === socket.id);

  if (index !== -1) {
     userData.splice(index, 1)[0];
  }

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

/* app.get('/home',(req,res,next)=>{
res.send("hello");
}); */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
