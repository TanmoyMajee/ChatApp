

import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";
// import "./ChatBox.css"; // Optional: if you prefer external CSS

export default function ChatBox() {
  const { selectedChat } = useChat();
  const { user, socket } = useUser(); // Ensure you're using the full socket instance if available.
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Join the room when a chat is selected
  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit("join_room", selectedChat._id);
    }
  }, [selectedChat, socket]);

  // Auto-scroll to bottom whenever messages change.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when selectedChat or user changes.
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Ensure your backend URL is correct.
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
    if (!newMessage.trim()) return; // Do nothing if message is empty
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Post the new message to the backend.
      const { data } = await axios.post(
        "http://localhost:5000/api/message",
        { chatId: selectedChat._id, content: newMessage },
        config
      );

      // Append the newly sent message to the messages list.
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="chat-container bg-gray-50 dark:bg-gray-800">
      {/* Fixed Chat Name Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 border-b border-gray-200 dark:border-gray-700 text-xl font-bold text-gray-800 dark:text-gray-100">
        Chat Name: {selectedChat.chatName}
      </div>
      
      {/* Scrollable Messages Container */}
      <div className="messages-container flex-1 overflow-y-auto p-4 min-h-0 space-y-2">
        {messages.map((message) => (
          <div
            key={message._id}
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
          className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded-l focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100  "
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
