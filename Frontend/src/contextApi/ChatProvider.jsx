// ChatProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);	
  // Function to fetch chats for the user

  const fetchChats = async (userToken) => {
    try {
      setLoading(true); // Set loading to true before fetching
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
    finally {
      setLoading(false); // Set loading to false after fetching
    }
  };



  return (
    <ChatContext.Provider
      value={{ selectedChat, setSelectedChat, chats, setChats, fetchChats , loading, setLoading}}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
