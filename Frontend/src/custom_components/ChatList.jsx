
import React, { useState, useEffect } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";

export default function ChatList() {
  const { chats, setSelectedChat } = useChat();
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
      {filteredChats.map((chat) => (
        <div
          key={chat._id}
          className="p-2 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => setSelectedChat(chat)}
        >
          <div className="font-semibold">{chat.chatName}</div>
          {chat.latestMessage && (
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(chat.latestMessage.createdAt), {
                addSuffix: true,
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
