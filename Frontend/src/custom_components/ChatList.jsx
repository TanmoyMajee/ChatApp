

import React, { useState, useEffect } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { useUser } from "../contextApi/UserContext";
import '../App.css'

export default function ChatList() {
  const { chats, setSelectedChat } = useChat();
  const { user, onlineUsers } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) =>
        chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchTerm, chats]);

  return (
    <div className="p-4">
      {/* Search Input at the Top */}
      <Input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full"
      />
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {filteredChats.map((chat) => {
        let onlineIndicator = null;

        // If this is a one-on-one chat (non-group chat), check online status.
        if (!chat.isGroupChat) {
          // Find the other participant (exclude current user).
          const otherUser = chat.users.find((u) => u._id !== user._id);
          const isOnline = onlineUsers.some(
            (onlineUser) => onlineUser._id === otherUser?._id
          );
          if (isOnline) {
            onlineIndicator = <span className="online-dot ml-2"></span>;
          }
          // console.log("Chat:", chat.chatName, "Other User:", otherUser, "isOnline:", isOnline);

        }

        return (
          <div
            key={chat._id}
            className="p-3 border-b flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-lg"
            onClick={() => setSelectedChat(chat)}
          >
            <div>
              <div className="font-semibold flex items-center">
                {chat.chatName}
                {onlineIndicator}
              </div>
              {chat.latestMessage && (
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(chat.latestMessage.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

