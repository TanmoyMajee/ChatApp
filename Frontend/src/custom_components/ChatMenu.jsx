import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import { useToast } from "@/hooks/use-toast";
// A simple MenuItem component for clarity and reusability.
const MenuItem = ({ children, onClick }) => (
  <div
    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
);

export default function ChatMenu({ chat, closeMenu }) {
  const { toast } = useToast();
  const { setChats, setSelectedChat } = useChat();
  const { user, socket } = useUser();
  // Common actions can be placed here.
  const handleMute = () => {
    console.log("Toggled Mute");
    console.log(chat)
    // Implement mute logic...
    closeMenu();
  };

  const handleArchive = () => {
    console.log("Archived Chat");
    // Implement archive logic...
    closeMenu();
  };

  // Group chat specific actions.
  const handleEditGroup = () => {
    console.log("Editing Group Info");
    closeMenu();
  };

  const handleManageParticipants = () => {
    console.log("Managing Participants");
    closeMenu();
  };

  const handleLeaveGroup = async () => {
    console.log("Leaving Group");
    // after remove set the selected caht id to null and updatae the chatlist also by setting the caht list with the updated one 
    // passin from the backend
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const backendURL = import.meta.env.VITE_BACKEND_URL || "";
      const UpdatedChat = await axios.put(`${backendURL}/api/chats/leaveGroup`,
        { chatId: chat._id }, config
      );
      // console.log("Now the updated caht listd  will be :  ", UpdatedChat)
      //  console.log(" remove this chat from the chat list in frontend :  ", UpdatedChat)
      setSelectedChat(null);
      // setChats(UpdatedAllChat);
      setChats(prevChats => prevChats.filter(c => c._id !== UpdatedChat._id));
      toast({
        title: "Group Leaved",
        description: `Leaved From Group ${UpdatedChat.data.chatName}`
        // variant: "destructive"5665657465
      });

    } catch (error) {
      console.error("Failed to fetch chats , Eror from backend", error);
    }
    closeMenu();
  };

  // One-on-one specific actions.
  const handleViewContact = () => {
    console.log("Viewing Contact");
    closeMenu();
  };

  const handleBlockUser = () => {
    console.log("Blocking User");
    closeMenu();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu}>
      <div className="absolute right-4 top-16 w-56 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50" onClick={(e) => e.stopPropagation()}>
        {/* Common Menu Items */}
        <MenuItem onClick={handleMute}>Mute</MenuItem>
        {/* <MenuItem onClick={handleArchive}>Archive Chat</MenuItem> */}

        {/* Conditional Rendering based on chat type */}
        {chat.groupChat ? (
          <>
            <MenuItem onClick={handleEditGroup}>Edit Group Name</MenuItem>
            <MenuItem onClick={handleManageParticipants}>Manage Participants</MenuItem>
            <MenuItem onClick={handleLeaveGroup}>Leave Group</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleBlockUser}>Block User</MenuItem>
          </>
        )}
      </div>
    </div>
  );
}
