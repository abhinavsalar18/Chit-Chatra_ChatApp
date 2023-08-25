import React, { useState } from 'react';
import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, IconButton, useToast, Box, FormControl, Input, Spinner } from '@chakra-ui/react'
import {Button} from "@chakra-ui/button"
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
const { useDisclosure} = require("@chakra-ui/react");

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages} ) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName]  = useState();
    const [ search, setSearch ] = useState(""); 
    const [searchResult, setSearchResult] = useState([]);
    const {selectedChat, setSelectedChat, user} = ChatState();

    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const updatedChat = {
        ...selectedChat,
        chatName: groupChatName,
      };

    const handleRename = async () =>{
        if(!groupChatName) return;
        try{
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data}  = await axios.put('http://localhost:3001/api/chats/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            console.log("Updated Grpup name: ", data);
            setSelectedChat(updatedChat);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        }
        catch(err){
            toast({
                title: "Unable to rename the group",
                description: err.response,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-center",
              });
              console.log("error while renaming...", err);
            setRenameLoading(false);
        }

        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        console.log("Inside handle search! Query:", query);
        setSearch(query);
          if(!query){
              return;
          }
  
          try{
              setLoading(true);
  
              const config = {
                  headers : {
                      Authorization: `Bearer ${user.token}`,
                  },
              };
  
              const { data } = await axios.get(`http://localhost:3001/api/user?search=${query}`, config);
              console.log("query data GroupChatModal", data);
              setSearchResult(data);
              setLoading(false);
          } catch(err){
              toast({
                title: "Unable to fetch the users!",
                description: "Failed to load search results!",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom-center"
              });
          }
      };


const handleAddUser = async (user1) =>{
    if(!selectedChat.user.find((u) => u._id === user1._id )){
        toast({
            title: "User Already in group!",
            status: "error",
            isClosable: true,
            position: "bottom-center"
          });

          return ;
    }

    if(selectedChat.groupAdmin._id !== user._id){
        toast({
            title: "Only Admin can add new user!",
            status: "error",
            isClosable: true,
            position: "bottom-center"
          });

          return;
    }

    try {
        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        
        
        const { data } = await  axios.put('http://localhost:3001/api/chats/groupadd', {
            chatId: selectedChat._id,
            userId: user1._id,  
        }, config);
        
       
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom-center"
          });
          setLoading(false);
    }
};

const handleRemove = async (user1) =>{
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast({
            title: "Only Admin can remove user!",
            status: "error",
            isClosable: true,
            position: "bottom-center"
        });
        return ;
    } 

    try {
        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await  axios.put('http://localhost:3001/api/chats/groupremove', {
            chatId: selectedChat._id,
            userId: user1._id,  
        }, config);

        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom-center"
          });
          setLoading(false);
    }
    
};
    return( 
    <>
        <IconButton display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                flexDir="column"
                justifyContent="center"
            
            >
                {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody 
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"

            >
                    <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                         {selectedChat.users.map((u) => (
                            <UserBadgeItem 
                                key={user._id}
                                user={u}
                                handleFunction={() => handleRemove(u)} 

                            />
                         ))}
                    </Box>
                    <FormControl display="flex" >
                        <Input 
                            placeholder='Chat Name'
                            mb={3}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}

                        />
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                    <Input
                        placeholder='Add Users to group'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? ( 
                    <Spinner size="lg" />
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem 
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                )}
            </ModalBody>

            <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
                Leave Group
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
    );
}

export default UpdateGroupChatModal;