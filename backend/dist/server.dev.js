"use strict";

var express = require("express");

var dotenv = require('dotenv');

var userRoutes = require("./routes/userRoutes");

var chatRoutes = require("./routes/chatRoutes");

var errorHandler = require('./middlewares/errorHandler');

var messageRoutes = require("./routes/messageRoutes");

var cors = require('cors');

dotenv.config();

var connectDB = require("./config/dbConnection");

connectDB();

var _require = require('./data/data'),
    chats = _require.chats;

var app = express();
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json()); // to accept the json data

app.get('/', function (req, res) {
  res.send("API is running");
});
app.use('/api/user', userRoutes);
app.use("/api/chats", chatRoutes);
app.use('/api/message', messageRoutes);
app.use(errorHandler); // handling cors errors when calling backend api endpoints from frontend

var PORT = process.env.PORT || 5000;
var server = app.listen(PORT, console.log("Server is running on port 5000...".green.bold));

var io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000"
  }
}); // for setup


io.on("connection", function (socket) {
  console.log("connected to socket.io");
  socket.on('setup', function (userData) {
    socket.join(userData._id);
    console.log("User data:", userData._id);
    socket.emit('connected');
  }); // for joining the room

  socket.on("join chat", function (room) {
    socket.join(room);
    console.log("User joined room: " + room);
  }); //for sending message

  socket.on("new message", function (newMessageReceived) {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("".concat(chat.users, " not defined!"));
    chat.users.forEach(function (user) {
      if (user._id == newMessageReceived.sender._id) return;
      socket["in"](user._id).emit("message received", newMessageReceived);
    });
  });
  socket.on("typing", function (room) {
    return socket["in"](room).emit("typing");
  });
  socket.on("stop typing", function (room) {
    return socket["in"](room).emit("stop typing");
  });
  socket.off("setup", function () {
    console.log("User disconnected!");
    socket.leave(userData._id);
  });
});