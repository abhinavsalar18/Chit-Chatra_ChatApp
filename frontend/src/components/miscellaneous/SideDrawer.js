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
import { getSender } from '../../config/ChatLogics';
import { Effect } from "react-notification-badge"
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const history = useHistory();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setChats([]);
    setUser(null);
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a name or email to search!",
        status: "warning",
        duration: 5000,
        position: "top-left",
        isClosable: true
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

      const { data } = await axios.get(`http://localhost:3001/api/user?search=${search}`, config);
      // console.log("data: ", data);
      setLoading(false);
      setSearchResult(data);

    } catch (err) {
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
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("http://localhost:3001/api/chats", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
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
            <MenuButton p={1} >
              <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}

              />
              <BellIcon fontSize="2xl" margin={1} />
            </MenuButton>
            <MenuList p={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notific) => (
                <MenuItem width="auto" key={notific._id} onClick={() => {
                  setSelectedChat(notific.chat);
                  setNotification(notification.filter((n) => n !== notific));
                }} >
                  {notific.chat.isGroupChat
                    ? `New Message in ${notific.chat.chatName}`
                    : `New Message from ${getSender(user, notific.chat.users)}`
                  }
                </MenuItem>
              ))}
            </MenuList>
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

/*
=> Arrays

Minimize the maximum difference between heights
Find duplicate in an array of N + 1 integers
Find common elements in 3 sorted arrays
Count More than n/k Occurences
Buy and Sell a Share at most twice
Array Subset of another array
Smallest subarray with sum greater than x
Three way partitioning
Minimum swaps and K together
Palindromic Array

Chocolate Distrubution
=> Matrix
Common elements in all rows of a given matrix
Kth largest in matrix

=> String
Find duplicates in String
Convert a sentence into its equivalent mobile numeric keypad sequence
Count the Reversals
Count of number of given string in 2D character array
Find the string in grid
Boyer Moore Algorithm for Pattern Searching
Min Number of Flips
Second most repeated string in a sequence
Rearrange characters in a string such that no two adjecent are same
Minimum characters to be added at front to make string palindrome
Print all anagrams
String pattern mathcing wild card
Function to find Number of customers who could not get a computer
First non-repeating character in a stream




Why Strings are immutable in java
Split the binary string into substrings with equal number of 0s and 1s

@Sliding window
Longest Repeating Subsequence


=> Searching and sorting
Optimum location of point to minimize total distance
Searching in an array where adjacent differ by at most k
Maximum sum such that no two elements are adjecent(Stickler Thief)
Product array puzzle
Sort by Set Bit Count
Minimum Swaps to Sort
Maximum sum Rectangle


Bishu and Soldiers(HackerEarth)
Rasta and Kheshtak(HackerEarth)
Kth smallest number again(HackerEarth)
EKOSPOJ(Binary Search)
Smallest factorial number
Painter partition problem
Roti- paratha SPOJ
DoubleHelix (Spoj)




=> Recursion
Recursively remove all adjecent duplicates
=> Dynamic programming
Word Wrap
Count all palindromic subsequence


=> Linked List
Remove duplicate in un-sorted linked list
Quick Sort for linked lsit
Check if linkedlist is circular or not
Split a circular linked list into two halves

deletion from a circular linked list
count tripplets with given sum
sort k-sorted DLL
merge k-sorted list
reverse a DLL
rotate DLL by N nodes
rotate DLL list group size k
Multiply two LL
Delete nodes have greater value on right side

=> Binary Trees
Reverse Level order
Create a mirror tree from the given binary tree
Diagonal Traversal of binary tree
check if 2 tree are mirror of each other
Construct Binary tree from string with bracket representation
Transform to Sum Tree
Minimum swaps to concert binary tree into BST
Check if binary tree is sum tree or not
Leaf at same level
Duplicate subtree in Binary Tree or size 2 or more
Check Mirror in N-ary tree
Sum of the Longest Bloodline of a Tree (Sum of nodes on the longest path from root to leaf node)
Check if a given graph is tree or not
Largest Subtree in binary tree
Maximum sum of nodes in Binary tree such that no two are adjacent
Print all K-Sum paths
Min distance between two given nodes of a Binary Tree
Kth ancestor of a node in binary tree 
Duplicate Subtrees
Check if all levels of two trees are anagrams or not
Check if Tree is Isomorphic
Covert binary tree into BST
Convert a normal bst to balanced BST
Count pairs form 2 BST whose sum is K
Find the median of two BST O(N) time and  O(1) space
Count BST nodes that lies in a range
Replace every element with the least greater element on its right
Given n appointments, find all conflicting appointments(Interval tree soln)
Check if preorder is valid or not
check if BST contains dead end
Flatten BST into sorted list(similart to binary tree flatten)

=> Greedy
Huffman Encoding
Water Connection Problem(Water optimization -> graph)(greedy soln)
Maximum trains for which stoppage can be provided
Buy Maximum Stocks if i stocks can be bought on i-th day
Shop in Candy Store
Minimize Cash Flow among a given set of friends who have borrowed money from each other
Minimum Cost to cut a board into squares
Check if it is possible to survive on Island
Maximum product subarray
Maximize sum(arr[i]*i) of an Array
Maximum sum of absolute difference of any permutation
Minimum Sum of Absolute Differences of Pairs
Swap and Maximize
Smallest Subset with Greater Sum
Chocolate Distribution Problem
DEFKIN - Defense of a Kingdom (SPOJ)
GERGOVIA - Wine trading in Gergovia
GCJ101BB - Picking Up Chicks
CHOCOLA - Chocolate
ARRANGE - Arranging Amplifiers
Greedy Approximate Algorithm for K Centers Problem
Minimum Cost of ropes
Smallest number
Find Maximum Equal sum of Three Stacks


=> Recursion and backtracking
Find Maximum Equal sum of Three Stacks
Knight's tour
Tug of war
Find shortest safe route in a path with landmines
Maximum possible number using atmost K swaps
Find if there is a path of more than k length from source
Longest possible path in a matrix with hurdles
Partition array to K subsets with equal sum


=> Stacks & Queues
Middle element if a stack
Implement N stacks in an array
Reverse a string using stack
Arithmetic expression evaluation
Postfix evaluation
Prefix evaluation
Longest valid substring
Expression contains redundant bracket or not
Stack permutation
Implement stack using Deque
Implement N queue in array
Implement a circular queue
Reverse a queue using recursion
Reverse the first k elements of a queue
Interleave the First Half of the Queue with Second Half
Find the first circular tour that visits all petrol pumps
First negative integer in every window of k size
Sum of minimum and maximum elements of all subarrays of size k.
First non-repeating character in a stream

=> Heaps
Reorganize String
K-th Largest Sum Contiguous Subarray
Smallest range in K lists
Heap sort
Merge 2 binary heaps
check if binary tree is a heap
convert BST into min heap
Minimum sum of two numbers formed form the digits of an array

=> Maths
count balanced binary trees of height h
Disarrangement of balls


=> Graph
Steps by Knight

Making wired connection
Minimum time taken by each job to be completed given by a Directed Acyclic Graph
Total spanning tree of a graph
Travelling Salesman problem
Snakes and ladders
Graph coloring problem
Negative cycle detection
Longest path in direction Acyclic graph
Journey to moon
Oliver and the game
Water jug problem
Minimum edges to be reversed to make path from src to dest
Paths to travel each nodes using each edge (Seven Bridges of Königsberg)
Vertex cover problem
Chinese postman or route inspection
Number of triangle in a directed and undirected graph
Two Clique problem



 => DP
Binomial Coefficient Problem
Permutation Coefficient problem
Program for nth catalan number
Friends Pairing
Goldmine problem
Assenbly line scheduling
Painting the fence problem
Maximize The Cut Segments
Longest Repeating Subsequence
Longest common subsequence of three strings
Count all subsequences having product less than K
Longest subsequence sum such that difference between adjecent is one(Longest subsequence-1)
Max Sum without Adjacents 2
Ege drop
Max length chain
Largest square formed in a matrix
Pairs with certain difference
Maximum path sum in matrix
Maximum difference of zeros and ones in binary string
Minimum cost to fill given weight in a bag
Minimum removals from array to make max - min <= k(Array Removals)
Reach a given score
Smallest sum contiguous subarray
Largest Independent Set Problem

Longest palindromic subsequence
Count Palindromic Subsequences
Longest alternating subsequence
Job Sequencing Problem
Geek and its Game of Coins

>>>>>>>
Optimal Strategy For A Game
>>>>>>>

Optimal Binary Search Tree
Word Wrap
Mobile numeric keypad
Boolean Parenthesization
Largest rectangular sub-matrix whose sum is 0
Largest area rectangular sub-matrix with equal number of 1’s and 0’s
Maximum profit by buying and selling stocks at most k times(Maximum Profit)
Find whether a string is interleaved with 2 strings
Maximum Length of Pair Chain

=> Bit Manipulation
Find position of set bit
Count total set bits
Copy Set Bits in Range
Calculate square of a number without using (*, /, pow())
 
 */