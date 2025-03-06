


import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft , Menu } from "lucide-react";
import ChatMenu from "./ChatMenu";

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
  const { selectedChat } = useChat();
  const { user, socket } = useUser(); // Ensure that your context stores the full socket instance in "socket"
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showMenu,setShowMenu] = useState(false)
  // console.log(messages.map(m => m._id));

  // Join the room when a chat is selected and socket is available.
  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit("join_room", selectedChat._id);
    }
  }, [selectedChat, socket]);

  // Listen for incoming messages.
  useEffect(() => {
    if (socket) {
      socket.on("message_received", (data) => {
        setMessages((prev) => [...prev, data]);
      });
      return () => {
        socket.off("message_received");
      };
    }
  }, [socket]);

  // Auto-scroll to bottom whenever messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages from the backend when the selected chat changes.
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:5000/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
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

      const { data } = await axios.post(
        "http://localhost:5000/api/message",
        { chatId: selectedChat._id, content: newMessage },
        config
      );
      // Emit the message to the room via socket.
      socket.emit("new_message", {
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

  const toggleMenu = ()=>{
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
        showMenu && <ChatMenu chat={selectedChat} closeMenu={()=> setShowMenu(false)} />
      }

      {/* Scrollable Messages Container */}
      <div className="messages-container flex-1 overflow-y-auto p-4 min-h-0 space-y-2">
        {messages.map ((message,indx) => (
          <div
            key={message._id || indx}
            className={`p-2 border-b ${
              message.sender && message.sender._id === user._id
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
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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


