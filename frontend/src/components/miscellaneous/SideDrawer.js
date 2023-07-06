import { 
  Box, 
  Button, 
  Drawer, 
  DrawerBody, 
  DrawerContent, 
  DrawerHeader, 
  DrawerOverlay, 
  Input, 
  Menu, 
  MenuButton, 
  MenuDivider, 
  MenuItem, 
  MenuList, 
  Text, 
  Toast, 
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from '@chakra-ui/avatar';
import React from 'react'
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from "@chakra-ui/hooks";
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { Spinner } from "@chakra-ui/spinner";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState( );

  const {isOpen, onOpen, onClose} = useDisclosure();

  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setChats([]);
    setUser(null);
    history.push("/");
};

  const handleSearch = async () => {
    if(!search){
      toast({
        title: "Please enter a name or email to search!",
        status: "warning",
        duration: 5000,
        position: "top-left",
        isClosable: true
      });

      return;
    }
    
     try{
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.get(`/api/user?search=${search}`, config);
        // console.log("data: ", data);
        setLoading(false);
        setSearchResult(data);

     } catch(err){
          toast({
            title: "Error Occured!",
            description: "Failed to load search results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
          });
     }
  };

  const accessChats = async (userId) => {
    try{
      setLoadingChat(true);

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization : `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chats", {userId}, config);
      
      if(!chats.find((c) => c._id === data._id)){
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch(err) {
      toast({
        title: "Error occured while fetching the chats",
        description: err.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "bottom-left"
      });
    }

  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placeContent="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans ">
          Chit-Chatra
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon fontSize="2xl" margin={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList pl={2}>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {/* <UserListItem key={user._id} user={user} handleFunction={() => accessChats(user._id)}></UserListItem> */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChats(user._id)}
                />
              ))
            )}
            {/* <Spinner ml="auto" display="flex" /> */}
            {/* {console.log(loadingChat)} */}
            {loadingChat && <>
              <Spinner ml="auto" display="flex" />
              {/* <div>Spinner</div> */}
            </>
             
            }
          </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default SideDrawer;

