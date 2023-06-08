import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const ChatPage = () => {
    // passing empty array initially
    const [chats, setChats] = useState([]);
    const fetchChats = async () => {
        const { data } = await axios.get("/api/chat");
        setChats(data);
    };

    useEffect(() => {
        fetchChats();
    }, []);

  return (
    <div>{chats.map(chat => <div key={chat._id}>{chat.chatName}</div>)}</div>
  )
}

export default ChatPage