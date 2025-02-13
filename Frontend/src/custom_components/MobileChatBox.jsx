
import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MobileChatBox({ onBack }) {
  const { selectedChat } = useChat();
  const { user, socket } = useUser(); // Ensure you store the full socket instance in your context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Join room when selectedChat and socket are available
  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit("join_room", selectedChat._id);
    }
  }, [selectedChat, socket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages whenever selectedChat or user changes.
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
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

      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    // Ensure the container takes full viewport height
    <div className="chat-container">
      {/* Fixed Header */}
      <div className="chat-header">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="chat-title">{selectedChat.chatName}</h2>
      </div>

      {/* Scrollable Messages Container */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${
              message.sender && message.sender._id === user._id
                ? "sent"
                : "received"
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
      <form className="message-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
