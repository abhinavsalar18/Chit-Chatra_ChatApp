import {useToast } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import {Box, Stack, Text} from "@chakra-ui/layout"
import {Button} from "@chakra-ui/button"
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import  {getSender, getSenderFull}  from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();
  const [loading, setLoading] = useState();
  // const [isNewChatGroupCreated, setIsNewChatGroupCreated] = useState(false);
  
  const toast = useToast();

  const fetchChats = async () => {
    try {
        setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:3001/api/chats", config);
      // console.log(data);
      setChats(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error occurred while fetching the chats",
        description: err.message,
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "bottom-left",
      });   
    }
  };

  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // console.log("userInfo", userInfo);
    setLoggedUser(userInfo);
    // console.log("logged user", loggedUser);

    fetchChats();
  }, [fetchAgain]);

  // useEffect(() => {
  //   console.log("logged user", loggedUser);
  // }, [loggedUser]);

  // useEffect(() => {
  //   console.log("chats", chats);
  // }, [chats]);

  
  const handleCreateGroup = async () => {
    await fetchChats();
  };
  return (
    <>
      <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "90%", md: "35%", lg:"30%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box 
        pb={3}
        px={3}
        // fontSize={{ base: "90%", md: "100%", lg:"90%"}}
        fontSize={{ base: "1.5rem", md: "1.3rem", lg: "1.45rem" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        MyChats
        <GroupChatModal onCreateGroup={handleCreateGroup}
        >
  
            <Button
              display="flex"
              flexDirection="row"
              padding="5px 8px 5px 8px"
              fontSize={{ base: ".85rem", md: "0.70rem", lg: ".85rem" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
        </GroupChatModal>
      </Box>
      <Box
         d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              const sender = !chat.isGroupChat ? (loggedUser && getSender(loggedUser, chat.users)) : chat.chatName;

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {sender}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}

      </Box>
    </Box>
    </> 

  )
}

export default MyChats;