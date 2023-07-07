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




const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server is running on port 5000...`.green.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

// for setup
io.on("connection", (socket) => {
    // console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log("User data:", userData._id);
        socket.emit('connected');
    });

// for joining the room
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
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

});