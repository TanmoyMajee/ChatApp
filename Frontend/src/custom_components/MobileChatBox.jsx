// MobileChatBox.jsx
import React, { useEffect, useState } from "react";
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

  // Fetch messages when the selected chat or user changes
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

  // Function to send a message
  const sendMessage = async () => {
    if (!newMessage) return;
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
    <div className="p-4 flex flex-col h-full">
      {/* Mobile header with back button */}
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-xl font-bold">{selectedChat.chatName}</h2>
      </div>
      {/* Message list */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((message) => (
          <div key={message._id} className="p-2 border-b">
            <div className="font-semibold">{message.sender.name}</div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      {/* Message input and send button */}
      <div className="flex items-center mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}
//  i thik we shoul build a seperate msg component whichcontain the msg , and the msg input field should be fixed