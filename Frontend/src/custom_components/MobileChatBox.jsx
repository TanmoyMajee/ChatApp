


import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MobileChatBox({ onBack }) {
  const { selectedChat } = useChat();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Function to auto-scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Whenever messages update, scroll to the bottom.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages whenever selectedChat or user changes.
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

      // Append the newly sent message to the messages list.
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-xl font-bold">{selectedChat.chatName}</h2>
      </div>

      {/* Scrollable Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 space-y-2">
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
              <div className="font-semibold">{message.sender.name}</div>
            )}
            <div>{message.content || message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Message Input Field */}
      <form
        className="sticky bottom-0 bg-white z-10 p-4 border-t border-gray-200 flex"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none"
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
