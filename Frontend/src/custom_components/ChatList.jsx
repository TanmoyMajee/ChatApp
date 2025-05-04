
import React, { useState, useEffect } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { Input } from "@/components/ui/input";
import { useUser } from "../contextApi/UserContext";
import { useTheme } from "next-themes";
import ChatListItem from "./ChatListItem";
import CreateChat from "./CreateChat";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import "../App.css";

export default function ChatList() {
  const { chats, setSelectedChat ,selectedChat , loading } = useChat();
  const { user, onlineUsers } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(chats);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
     const { theme } = useTheme(); 
// const [selectedChatToggler,setselectedChatToggler] = useState(false);

// useEffect(()=>{
//   if(!selectedChat)setselectedChatToggler(true)
//     else setselectedChatToggler(false)
// },[setSelectedChat])
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) => {
        // Check if the chat's name includes the search term
        const chatNameMatch = chat.chatName.toLowerCase().includes(searchTerm.toLowerCase());
        if (chatNameMatch) return true;

        // For one-on-one chats, also check the other user's name
        if (!chat.groupChat && chat.users) {
          // Find the other user (not the current user)
          const otherUsers = chat.users.filter(u => u._id !== user._id);
          return otherUsers.some(otherUser =>
            otherUser.name && otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        return false;
      });
      setFilteredChats(filtered);
    }
  }, [searchTerm, chats, user]);
  // Improve search filter for one-on-one chats by checking other user's name.
  //  we pass the dependency user  to the useEffect hook to ensure that the search filter is updated when the user changes.
  // ans we also pass the dependency chats to the useEffect hook to ensure that the search filter is updated when the chats change.

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
  {loading ? (
   
        <Skeleton
        baseColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
        highlightColor={theme === "dark" ? "#4a5568" : "#f7fafc"} // Dark mode highlight color
        height={60} borderRadius={4} count={7}/>
  ) : (
    filteredChats.map((chat) => (
      <ChatListItem
        key={chat._id}
        chat={chat}
        user={user}
        onlineUsers={onlineUsers}
        setSelectedChat={setSelectedChat}
      />
    ))
  )}
</div>



      {/* New Chat Modal Placeholder */}
     {showNewChatModal && (
        <CreateChat onClose={() => setShowNewChatModal(false)} />
      )}


    </div>
  );
}






