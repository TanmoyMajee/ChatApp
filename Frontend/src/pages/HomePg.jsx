
import React, { useEffect } from "react";
import Header from "../custom_components/Header";
import ChatList from "../custom_components/ChatList";
import ChatBox from "../custom_components/ChatBox"; // Unified ChatBox component
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import { io } from "socket.io-client";

export default function HomePage() {
  const { selectedChat, fetchChats, setSelectedChat } = useChat();
  const { user, setSocketID, socketId, setOnlineUsers } = useUser();

  // Fetch chats when the user is available
  useEffect(() => {
    if (user) {
      fetchChats(user.token);
    }
  }, [user]);

  // Initialize socket and store the instance (runs only when user changes)
  useEffect(() => {
    if (user) {
      const newsocket = io("https://chatapp-backend-2qvt.onrender.com", {
        query: { userId: user._id },
      });
      setSocketID(newsocket);

      newsocket.on("connect", () => {
        console.log(`Connected to socket with ID: ${newsocket.id}`);
      });

      newsocket.on("getOnlineUsers", (users) => {
        console.log("Online Users", users);
        setOnlineUsers(users);
      });

      return () => {
        newsocket.disconnect();
      };
    }
  }, [user, setSocketID]);

  return (
    // Outer container fixed to the viewport
    <div className="fixed inset-0 flex flex-col">
      <Header/>
      {/* Desktop layout: show ChatList and ChatBox side by side */}
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
      {/* Mobile layout: show either ChatList or ChatBox with a back button */}
      <div className="block md:hidden flex-1">
        {selectedChat ? (
          <ChatBox onBack={() => setSelectedChat(null)} />
        ) : (
          <ChatList />
        )}
      </div>
    </div>
  );
}
