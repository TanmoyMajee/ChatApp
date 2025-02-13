

import React, { useEffect } from "react";
import SideDrawer from "../custom_components/SideDrawer";
import ChatList from "../custom_components/ChatList";
import ChatBox from "../custom_components/ChatBox";
import MobileChatBox from "../custom_components/MobileChatBox";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import { io } from "socket.io-client";

export default function HomePage() {
  const { selectedChat, fetchChats, setSelectedChat } = useChat();
  const { user, setSocketID } = useUser();

  // Fetch chats when the user is available
  useEffect(() => {
    if (user) {
      fetchChats(user.token);
    }
  }, [user, fetchChats]);

  // Initialize socket and store the instance
  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:5000");
      setSocketID(socket);
    }
  }, [user, setSocketID]);

  return (
    // The outer container is now fixed to the viewport.
    <div className="fixed inset-0 flex flex-col">
      <SideDrawer />
      {/* For medium and larger screens: show ChatList and ChatBox side by side */}
      <div className="hidden md:flex flex-1">
        <div className="w-full md:w-1/3 border-r">
          <ChatList />
        </div>
        <div className="flex-1">
          {selectedChat ? (
            <ChatBox />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start a conversation
            </div>
          )}
        </div>
      </div>
      {/* For small screens: show either ChatList or MobileChatBox */}
      <div className="block md:hidden flex-1">
        {selectedChat ? (
          <MobileChatBox onBack={() => setSelectedChat(null)} />
        ) : (
          <ChatList />
        )}
      </div>
    </div>
  );
}
