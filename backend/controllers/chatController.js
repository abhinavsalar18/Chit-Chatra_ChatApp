const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@desc accessing all chats (with all users individual chats)
//@route /api/chats
//@access      protected
const accessChats = asyncHandler (async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
  
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    console.log(isChat);
    if (isChat.length > 0) {
        console.log("Older chats", isChat);
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  });

  //@desc accessing chats with a particular user
  //@route /api/chats
  //@access      protected

  const fetchChats = asyncHandler (async (req, res) => {
         try{
             await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
                .populate("users", "-password")
                 .populate("groupAdmin", "-password")
                 .populate("latestMessage")
                 //sorted the message newest using updatedAt
                 .sort({ updatedAt: -1 })
                 .then(async (results) => {
                     results = await User.populate(results, {
                         path: "latestMessage.sender",
                         select: "name pic email",
                     });
                     res.status(200).send(results);
             });
         }
         catch(err){ 
            res.status(400);
            throw new Error(err.message);
         }
  });


  //@desc creating new group
  //@route /api/chats/group
  //@access      protected

  const createGroup = asyncHandler( async (req, res) => {
    // console.log("creating group..", req.body);
    if(!req.body.users || !req.body.name){
        // console.log("inside");
        res.status(400).send({message: "Please fill all the fields!"});
        return;
    }

    var users = JSON.parse(req.body.users);
    // console.log("after parsing...", users);
    
    if(users.length < 2){
        res.status(400).send("More than two users are required to create a group");
        return;
    }

    users.push(req.user);
    // console.log("creating");
    try{
        const groupChat = await Chat.create({
            chatName : req.body.name,
            users : users,
            isGroupChat: true,
            groupAdmin: req.user,

        });

        console.log("creating chats", groupChat);
        const fullGroupChat = await Chat.find({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

            res.status(200).json(fullGroupChat);
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
  });

  //@desc   rename the group
  //@route  /api/chats/rename
  //@access  protected
  const renameGroup = asyncHandler ( async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,
      // field that's are to be updated
      {
        chatName: chatName,
      },
      //if we do not write this then it will return the old name
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

      if(!updatedChat){
        res.status(404);
        throw new Error("Chat not found!");
      }
      else{
        res.status(200).json(updatedChat);
        console.log(updatedChat);
      }
  });

  //@desc add users to a group
  //@route /api/chats/groupadd
  //@access  protected

  const addToGroup = asyncHandler( async (req, res) => {
      const {chatId, userId} = req.body;

      const updatedGroup = await Chat.findByIdAndUpdate(chatId, 
          {
            // pushing the userId into users
            $push: {users: userId},
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        if(!updatedGroup){
          res.status(404);
          throw new Error("Chat not found!");
        }
        else{
          res.status(200).json(updatedGroup);
        }
  });


  //@desc remove user from group
  //@route  /api/chats/groupremove
  //access  protected

  const removeFromGroup = asyncHandler( async (req, res) => {
      const {chatId, userId} = req.body;

      const updatedGroup = await Chat.findByIdAndUpdate(chatId,
          {
            $pull: {users : userId},
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        if(!updatedGroup){
          res.status(404);
          throw new Error("Chat not found!");
        }
        else{
          res.status(200).json(updatedGroup);
        }
  });

module.exports = { accessChats, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup };