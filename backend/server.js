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
app.listen(PORT, console.log(`Server is running on port 5000...`.green.bold));