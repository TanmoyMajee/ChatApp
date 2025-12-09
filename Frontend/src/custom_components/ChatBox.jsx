


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
  const { theme } = useTheme() // Get the current theme from the context
  const { selectedChat } = useChat();
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
      } finally {
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

    <div className="chat-container flex flex-col h-full bg-[#e5ddd5] dark:bg-[#0b141a] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />

      {/* Fixed Header */}
      <div className="sticky top-0 bg-[#f0f2f5] dark:bg-[#202c33] z-20 px-4 py-3 border-b border-gray-300 dark:border-gray-700 flex items-center shadow-sm">
        {isMobile && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-2 p-1 h-auto text-[#54656f] dark:text-[#aebac1]">
            <ArrowLeft size={24} />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg overflow-hidden">
            {/* Fallback avatar if no image */}
            {ChatName ? ChatName.charAt(0).toUpperCase() : "?"}
          </div>
          <h2 className="text-lg font-medium text-[#111b21] dark:text-[#e9edef] truncate">
            {ChatName}
          </h2>
        </div>
        <Button variant="ghost" className="ml-auto text-[#54656f] dark:text-[#aebac1]" onClick={toggleMenu}>
          <Menu size={24} />
        </Button>
      </div>

      {showMenu && <ChatMenu chat={selectedChat} closeMenu={() => setShowMenu(false)} />}

      {/* Loading Indicator */}
      {msgLoading ? (
        <div className="flex-1 p-4 bg-transparent z-10">
          <Skeleton
            baseColor={theme === "dark" ? "#202c33" : "#f0f2f5"}
            highlightColor={theme === "dark" ? "#2a3942" : "#ffffff"}
            height={60}
            borderRadius={8}
            count={8}
            className="mb-2"
          />
        </div>
      ) : (
        <div className="messages-container flex-1 overflow-y-auto p-4 space-y-2 z-10 custom-scrollbar">
          {messages.map((message, indx) => {
            const isSender = message.sender && message.sender._id === user._id;
            return (
              <div
                key={message._id || indx}
                className={`flex ${isSender ? "justify-end" : "justify-start"} mb-1`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm relative text-sm md:text-base break-words ${isSender
                      ? "bg-[#005c4b] text-white rounded-tr-none"
                      : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none"
                    }`}
                >
                  {/* Sender Name in Group Chats (Receiver Side Only) */}
                  {!isSender && selectedChat.groupChat && message.sender && (
                    <div className="text-xs font-bold text-orange-500 mb-1">
                      {message.sender.name}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={`${isSender ? 'text-white' : 'text-[#111b21] dark:text-[#e9edef]'}  leading-relaxed`}>
                    {message.content || message.text}
                  </div>

                  {/* Timestamp */}
                  <div className={`text-[10px] md:text-[11px] mt-1 text-right  ${isSender ? "text-blue-100/70" : "text-gray-500 dark:text-gray-400"} `}>
                    {new Date(message.updatedAt).toLocaleString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // AM/PM mostly preferred in chat apps
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className={`${isMobile ? "pb-2" : "pb-0"}`} />
        </div>
      )}

      {/* Message Input Field */}
      <form
        className="message-input sticky bottom-0 bg-[#f0f2f5] dark:bg-[#202c33] z-20 px-4 py-3 flex items-center gap-2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 py-2 px-4 rounded-lg bg-white dark:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none border-none shadow-sm"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-2 rounded-full transition-colors flex items-center justify-center ${newMessage.trim()
              ? "bg-[#00a884] hover:bg-[#008f6f] text-white shadow-md transform active:scale-95"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
            }`}
        >
          {/* Send Icon SVG */}
          <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24">
            <path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}


