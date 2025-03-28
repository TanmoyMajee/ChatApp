// ChatProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  // Function to fetch chats for the user

  const fetchChats = async (userToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const backendURL = import.meta.env.VITE_BACKEND_URL || "";
      const { data } = await axios.get(`${backendURL}/api/chats`, config);
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  };



  return (
    <ChatContext.Provider
      value={{ selectedChat, setSelectedChat, chats, setChats, fetchChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
