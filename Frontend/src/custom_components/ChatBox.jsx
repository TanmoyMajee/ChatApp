


import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import ChatMenu from "./ChatMenu";
import Skeleton from 'react-loading-skeleton'
import { useTheme } from "next-themes";
import 'react-loading-skeleton/dist/skeleton.css'

// Custom hook to detect mobile screens (width < 768px)
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function ChatBox({ onBack }) {
  const isMobile = useIsMobile();
  const {theme } = useTheme() // Get the current theme from the context
  const { selectedChat  } = useChat();
  const { user, socket } = useUser(); // Ensure that your context stores the full socket instance in "socket"
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false)
  const [msgLoading, setMsgLoading] = useState(false)
  // console.log(messages.map(m => m._id));

  // Join the room when a chat is selected and socket is available.
  // useEffect(() => {
  //   if (selectedChat && socket) {
  //     socket.emit("join_room", selectedChat._id);
  //   }
  // }, [selectedChat, socket]);

  // // Listen for incoming messages.
  // useEffect(() => {
  //   if (socket) {
  //     socket.on("message_received", (data) => {
  //       setMessages((prev) => [...prev, data]);
  //     });
  //     return () => {
  //       socket.off("message_received");
  //     };
  //   }
  // }, [socket]);
  // Problem: This listener is only added / removed when the socket changes, not when the selected chat changes.This means you might be listening to events from previous chats.

  useEffect(() => {
    if (socket && selectedChat) {
      // Clean join/leave room logic
      socket.emit("join_room", selectedChat._id);

      // Message handler specific to this chat
      const handleMessage = (data) => {
        // Only add messages for the current chat
        if (data.room === selectedChat._id) {
          // Use a function to check if message already exists to avoid duplicates
          setMessages((prev) => {
            // Check if message with this ID already exists
            const exists = prev.some(msg => msg._id === data._id);
            if (exists) return prev;
            return [...prev, data];
          });
        }
      };

      socket.on("message_received", handleMessage);

      return () => {
        // Leave the room when component unmounts or chat changes
        socket.emit("leave_room", selectedChat._id);
        socket.off("message_received", handleMessage);
      };
    }
  }, [socket, selectedChat]);

  // Auto-scroll to bottom whenever messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages from the backend when the selected chat changes.
  useEffect(() => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "";
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        setMsgLoading(true); // Set loading state to true before fetching
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `${backendURL}/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }finally {
        setMsgLoading(false); // Set loading state to false after fetching
      }
    };
    fetchMessages();
  }, [selectedChat, user]);

  // Handle sending a new message.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const backendURL = import.meta.env.VITE_BACKEND_URL || "";
      const { data } = await axios.post(
        `${backendURL}/api/message`,
        { chatId: selectedChat._id, content: newMessage },
        config
      );
      // Emit the message to the room via socket.
      socket.emit("new_message", {
        _id: data._id, // Include the database ID
        room: selectedChat._id,
        content: newMessage,
        sender: user,
      });
      // setMessages([...messages, data]);
      // no need to update messages here, as the message will be received via socket.
      // update the input field to empty after sending the msg
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    console.log("Toggle")
  }

  // Derive ChatName: if it's a one-to-one chat, use the other user's name; otherwise, use chatName.
  let ChatName = selectedChat.chatName;
  if (!selectedChat.groupChat && user && selectedChat.users) {
    const otherUser = selectedChat.users.find((u) => u._id !== user._id);
    if (otherUser) {
      ChatName = otherUser.name;
    }
  }

  return (

    <div className="chat-container bg-gray-50 dark:bg-gray-800">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        {isMobile && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft size={24} />
          </Button>
        )}
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {ChatName}
        </h2>
        <Button variant="ghost" className="ml-auto" onClick={toggleMenu}>
          <Menu size={24} className="text-gray-800 dark:text-gray-100" />
        </Button>
      </div>

      {
        showMenu && <ChatMenu chat={selectedChat} closeMenu={() => setShowMenu(false)} />
      }


      {/* Loading Indicator */}
      {msgLoading ?  (
        // <div className="flex items-center justify-center p-4">
          <Skeleton
                  baseColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                  highlightColor={theme === "dark" ? "#4a5568" : "#f7fafc"} // Dark mode highlight color
                  height={60} borderRadius={4} count={8}/>
        // </div>
      ) : (
  
      <div className="messages-container flex-1 overflow-y-auto p-4 min-h-0   space-y-2">
         {/* Scrollable Messages Container */}
        {messages.map((message, indx) => (
          <div
            key={message._id || indx}
            className={`p-2 border-b ${message.sender && message.sender._id === user._id
                ? "text-right"
                : "text-left"
              }`}
          >
            {message.sender && message.sender.name && (
              <div className="font-semibold text-gray-800 dark:text-gray-100">
                {message.sender.name}
              </div>
            )}
            <div className="text-gray-700 dark:text-gray-200">
              {message.content || message.text}
            </div>
            <div>
                {new Date(message.updatedAt).toLocaleString('en-IN', {
                   day: '2-digit',
                   month: 'short',
                  //  year: 'numeric',
                   hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                     timeZone: 'Asia/Kolkata',
               })}
</div>
          </div>
        ))}
        <div ref={messagesEndRef} 
        className={`${isMobile ? 'pb-6 mb-4' : 'pb-2'}`} />
      </div>

      )}


      {/* Fixed Message Input Field */}
      <form
        className="message-input sticky bottom-0 bg-white dark:bg-gray-900 z-10 p-4 border-t border-gray-200 dark:border-gray-700 flex"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded-l focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
}


