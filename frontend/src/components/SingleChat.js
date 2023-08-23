import React, { useState } from "react"
import { ChatState } from "../Context/ChatProvider"
import {Box, Text} from "@chakra-ui/layout"
import { FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react'
import {ArrowBackIcon} from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics.js";
import {ProfileModal} from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import { useEffect } from "react";
import './style.css';
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/12966-typing-indicator.json"
//socket.io functionality

const ENDPOINT = "http://localhost:3001";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const toast = useToast();
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    
    const [loading, setLoading] = useState(false);
    const [messages, setMessages]  = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false); 
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop : true,
        autoplay: true,
        animationData: animationData,
        renderSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = async () =>{
        if(!selectedChat) return;

        try {
            
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`,
                },
            };

            setLoading(true);
            const { data } = await axios.get(`http://localhost:3001/api/message/${selectedChat._id}`, config);

            //not working
            // console.log("data from fetch message(Single chat)", data);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error occured!",
                description: "Failed to fetch messages!",
                status: "error",
                duration: 2000,
                position: "top-center",
                isClosable: true,
            });
        }
    };
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));

        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
          
    }, []);

    useEffect(() => {
        fetchMessages();
        

        selectedChatCompare = selectedChat;
    }, [selectedChat]);
    // console.log(notification, "----"); 

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                // display notification
                console.log(notification);
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }

            } else{
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const sendMessage = async (event) => {
        if(event.key === "Enter" && newMessage){
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers : {
                        // due to this line it says bad request 400
                        // and at backend the req.body was empty
                        // after removing this its working fine
                        // "Content-Type": "aaplication/json",
                        Authorization : `Bearer ${user.token}`,
                    },
                };
                
                setNewMessage("");
                const { data } = await axios.post(`http://localhost:3001/api/message`, {
                    content: newMessage,
                    chatId : selectedChat._id,
                }, config);
                
                //not working
                // console.log("data from send message(Single chat)", data);
                socket.emit("new message", data);
                // console.log("below socket.emit", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error occured!",
                    description: "Failed to send message!",
                    status: "error",
                    duration: 2000,
                    position: "top-center",
                    isClosable: true,
                });
            }
        }

    };

  

    const typingHandler = (event) => {
        setNewMessage(event.target.value);

        // Typing Indicator Logic
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var crntTime = new Date().getTime();
            var timeDiff = crntTime - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };



    return (<>
        {selectedChat ? (
            <>
                <Text
                    fontSize={{base: "28px", md: "30px"}}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{base: "space-between"}}
                    alignItems="center"
                >
                    <IconButton 
                        display={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {
                        !selectedChat.isGroupChat ? (
                            <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal
                                user={getSenderFull(user, selectedChat.users)}
                            />
                            </>
                        ) : (
                            <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                            </>
                        )
                    }
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    padding={3}
                    backgroundColor="#E8E8E8"
                    width="100%"
                    height="100%"
                    borderRadius="1g"
                    overflowY="hidden"
                >
                { loading ? (
                    <Spinner 
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        margin="auto"
                    />
                ) 
                
                : (
                    <div className="messages">
                        {/* Messages here */}
                        <ScrollableChat messages={messages}/>
                    </div>
                )}
                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    { isTyping ? 
                        <div>
                            <Lottie
                                options={defaultOptions}
                                width={90}
                                height={25}
                                style={{ margingBottom: "50px", marginLeft: "5px"}}
                            
                            />
                        </div> 
                        : 
                        <></>}
                    
                    <Input
                        variant="filled"
                        bg="#E0E0E0"
                        placeholder="Enter a message...."
                        onChange={typingHandler}
                        value={newMessage}
                     />
                </FormControl>
                </Box>
            </>
        ) : (
            <Box  
                display="flex" 
                alignItems="center"
                justifyContent="center"
                height="100%"
            >
                <Text 
                        fontSize="3xl" 
                        paddingBottom={3}
                        fontFamily="Work sans"
                >
                    Click on a user to start chatting
                </Text>
            </Box>
        )
        }
    </>
    )
}

export default SingleChat;