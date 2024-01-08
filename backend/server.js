const express = require("express");
const dotenv = require('dotenv');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const errorHandler = require('./middlewares/errorHandler');
const messageRoutes = require("./routes/messageRoutes");
const cors = require('cors');

dotenv.config();

const connectDB = require("./config/dbConnection");

connectDB();
const { chats } = require('./data/data');
const app = express();

app.use(
    cors({
        origin : "http://localhost:3001",
        origin : "http://localhost:3000",
    })
);
app.use(express.json()); // to accept the json data

app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user', userRoutes);
app.use("/api/chats", chatRoutes);
app.use('/api/message', messageRoutes);


app.use(errorHandler);
// handling cors errors when calling backend api endpoints from frontend




const PORT = process.env.PORT || 3001;
const server = app.listen(3001, console.log(`Server is running on port ${PORT}...`.green.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        // on getting CORS error try to add the origin for which error is generating
        origin: "http://localhost:3001",
        origin: "http://localhost:3000",
    },
});

// for setup
const onlineUsers = {};
io.on("connection", (socket) => {
    console.log("connected to socket.io"); 

    socket.on('setup', (userData) => {
        onlineUsers[userData._id] = socket.id; // Add user to onlineUsers
        io.emit('updateUsers', Object.keys(onlineUsers)); // Emit updated online users list
        console.log("updatedUsers: ", onlineUsers);
        socket.emit('connected');
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    });

    socket.on('disconnect', () => {
        const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
        if (userId) {
            delete onlineUsers[userId]; // Remove user from onlineUsers
            io.emit('updateUsers', Object.keys(onlineUsers)); // Emit updated online users list
        }
    });
//for sending message

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log(`${chat.users} not defined!`);

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });


    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.off("setup", () => {
        console.log("User disconnected!");
        socket.leave(userData._id);
    });
});