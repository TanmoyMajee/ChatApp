
import React, { useState, useEffect } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { Input } from "@/components/ui/input";
import { useUser } from "../contextApi/UserContext";
import ChatListItem from "./ChatListItem";
import CreateChat from "./CreateChat";
import "../App.css";

export default function ChatList() {
  const { chats, setSelectedChat ,selectedChat } = useChat();
  const { user, onlineUsers } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(chats);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
// const [selectedChatToggler,setselectedChatToggler] = useState(false);

// useEffect(()=>{
//   if(!selectedChat)setselectedChatToggler(true)
//     else setselectedChatToggler(false)
// },[setSelectedChat])
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
    <div className="p-4 h-[calc(100vh-100px)] flex flex-col">
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full"
      />

       {/* Header with Chats Title and Add Chat Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <button
          className="bg-blue-500 text-white rounded-full p-2 shadow-lg text-2xl"
          onClick={() => setShowNewChatModal(true)}
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
      {filteredChats.map((chat) => (

              <ChatListItem
          key={chat._id}
          chat={chat}
          user={user}
          onlineUsers={onlineUsers}
          setSelectedChat={setSelectedChat}
        />
      ))}
      </div>



      {/* New Chat Modal Placeholder */}
     {showNewChatModal && (
        <CreateChat onClose={() => setShowNewChatModal(false)} />
      )}


    </div>
  );
}