const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");


const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the fields!");
    }

    const user = await User.findOne({email});

    if(user){
        res.status(400);
        throw new Error("User already registered with this email!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        pic
    });

    if(newUser){
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id)
        });
    }
    else{
        res.status(400);
    throw new Error("Unable to create user!");
    }
});


const authUser = asyncHandler( async (req, res) => {
   
    const {email, password} = req.body;
    console.log("inside login: ", req.body);
    if(!email || !password){
        res.status(400);
        throw new Error("All fields the required!");
    }

    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
          });
    }
    else{
        res.status(401).json({message : "Invalid Email or Password"});
        return;
    }
});

//@desc getting all users from db
//@route /api/user?search=search_value
//@access  protected

const allUsers = asyncHandler (async (req, res) => {
    // just like req.params
    // console.log("all users");
    const keyword = req.query.search
    ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"} },
            {email: {$regex: req.query.search, $options: "i"} },
        ],
        }
    : {}; // ternary operator
    
    // find all the users exxcept logged in user
    // console.log("getting all users");
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id} });
    res.send(users);
    // console.log(keyword);
})
module.exports = {registerUser, authUser, allUsers};