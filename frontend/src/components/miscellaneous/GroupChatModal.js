import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';

 const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading ] = useState();

    const toast = useToast();
    const {user, chats, setChatState} = ChatState();

    const handleSearch = async (query) => {
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
        } catch(err){

        }
    }

    const handleSubmit = () => {

    }
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
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
                        placeholder='Chat Name'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />   
                </FormControl>
                {/* render search results */}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal;