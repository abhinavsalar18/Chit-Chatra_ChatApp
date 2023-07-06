import React from "react"
import { ChatState } from "../Context/ChatProvider"
import {Box, Text} from "@chakra-ui/layout"
import { IconButton } from '@chakra-ui/react'
import {ArrowBackIcon} from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics.js";
import {ProfileModal} from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModel";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat} = ChatState();

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
                    Messages here
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