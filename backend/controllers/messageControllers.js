const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

//@desc sending new message one-on-one and group
//@route POST /api/message/
//@access protected

const sendMessage = asyncHandler( async (req, res) => {
        const { content, chatId } = req.body;
        console.log(req.body);
        if(!content || !chatId){
            console.log("Invalid data!");
            return res.status(400).json({messgae: "Unbale to send message"});
        }

        var newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };


        try {
            var message = await Message.create(newMessage);
            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path: "chat.users",
                select: "name pic email",
            });
            
            await Chat.findByIdAndUpdate(req.body.chatId, {
                latestMessage: message,
            });

            res.json(message);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
);

//@desc get all messages
//@route GET /api/message/:chatId
//@access protected

const allMessages = asyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");

        // console.log("message", messages);
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

module.exports = {sendMessage, allMessages}; 