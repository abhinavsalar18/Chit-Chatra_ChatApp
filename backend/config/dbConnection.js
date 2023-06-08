const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Database Connected: ${conn.connection.host}`.cyan.bold.underline);
    }   
    catch(err){
       console.log(`Error: ${err.message}`.red.bold);
       process.exit(1);
    }
};

module.exports = connectDB;