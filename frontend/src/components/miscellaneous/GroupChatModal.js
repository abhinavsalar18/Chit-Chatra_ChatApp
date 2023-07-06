import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import  UserListItem  from "../UserAvatar/UserListItem"
import {Box} from "@chakra-ui/layout"

 const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading ] = useState(false);

    const toast = useToast();
    const {user, chats, setChats} = ChatState();

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

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            console.log("query data GroupChatModal", data);
            setLoading(false);
            setSearchResult(data);
        } catch(err){
            toast({
              title: "Error Occurred!",
              description: "Failed to load search results!",
              status: "error",
              duration: 4000,
              isClosable: true,
              position: "bottom-center"
            });
        }
    };

    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/chats/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };


    const handleGroup = (userToAdd) => {
      if(selectedUsers.includes(userToAdd)){
        toast({
          title: "User Already Added!",
          status: "warning",
          isClosable: true,
          position: "bottom-center"
        });
        return;
      }
      
      setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = (userToDelete) => {
      setSelectedUsers(
        selectedUsers.filter((sel) => sel._id !== userToDelete._id)
      );
    }
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader
                fontSize="35px"
                fontFamiily="Work sans"
                display="flex"
                justifyContent="center"
            >
                Create Group Chat
            </ModalHeader>
              <ModalCloseButton />
              <ModalBody 
                display="flex"
                flexDirection="column"
                alignItems="center" 
              >
                <FormControl>
                    <Input
                        placeholder='Chat Name'
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />   
                </FormControl>
                <FormControl>
                    <Input
                        placeholder='Add Users eg. Nick John'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />   
                </FormControl>
                  <Box 
                    display="flex"
                    flexDirection="row"
                    width="100%"
                    flexWrap="wrap"

                  >
                    {selectedUsers.map((u) => (
                      <UserBadgeItem 
                        key={user._id}
                        user={u}
                        handleFunction={() => handleDelete(u)} 

                      />

                    ))}
                  </Box>


                  {loading ? <div>loading...</div> : (
                      searchResult?.slice(0, 4).map((user) => <UserListItem 
                          key={user._id}
                          user={user}
                          handleFunction={() => handleGroup(user)}


                      />)
                  )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal;