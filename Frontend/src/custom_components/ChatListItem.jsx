

import React from "react";
import { formatDistanceToNow } from "date-fns";

function ChatListItem({ chat, user, onlineUsers, setSelectedChat }) {
  let onlineIndicator = null;
  
  let chatTitle = chat.chatName;

  // For one-on-one chats, check if the other user is online.
  if (!chat.groupChat && user && chat.users) {
    const otherUser = chat.users.find((u) => u._id !== user._id);
    if (otherUser) {
      chatTitle = otherUser.name;
    }
    const isOnline = onlineUsers.includes(otherUser?._id);
    if (isOnline) {
      onlineIndicator = <span className="online-dot ml-2"></span>;
    }
  }



  return (
    <div
      key={chat._id}
      className="p-3 border-b flex items-center justify-between cursor-pointer 
                 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      onClick={() => setSelectedChat(chat)}
    >
      <div>
        <div className="font-semibold flex items-center text-gray-900 dark:text-gray-100">
          {chatTitle}
          {onlineIndicator}
        </div>
        {chat.latestMessage && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(chat.latestMessage.createdAt), {
              addSuffix: true,
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatListItem;
