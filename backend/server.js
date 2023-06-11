const express = require("express");
const dotenv = require('dotenv');
const userRoutes = require("./routes/userRoutes");
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
dotenv.config();

const connectDB = require("./config/dbConnection");

connectDB();
const { chats } = require('./data/data');
const app = express();
app.use(express.json()); // to accept the json data

app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user', userRoutes);
app.use(errorHandler);
app.use(
    cors({
        origin : "http://localhost:3000",
    })
)



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port 5000...`.green.bold));