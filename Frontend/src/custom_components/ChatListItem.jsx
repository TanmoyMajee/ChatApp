
import React from "react";
import { formatDistanceToNow } from "date-fns";

function ChatListItem({ chat, user, onlineUsers, setSelectedChat }) {
  let onlineIndicator = null;
  let chatTitle = chat.chatName;
  let chatImage = null;

  // For one-on-one chats, determine the other user and use their image.
  if (!chat.groupChat && user && chat.users) {
    const otherUser = chat.users.find((u) => u._id !== user._id);
    if (otherUser) {
      chatTitle = otherUser.name;
      chatImage = otherUser.image; // use other user's image
    }
    const isOnline = onlineUsers.includes(otherUser?._id);
    if (isOnline) {
      onlineIndicator = <span className="online-dot ml-2"></span>;
    }
  } else {
    // For group chats, use the group image if available
    chatImage = chat.GroupImage;
  }

  return (
    <div
      key={chat._id}
      className="p-3 border-b flex items-center justify-between cursor-pointer 
                 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      onClick={() => setSelectedChat(chat)}
    >
      <div className="flex items-center">
        {/* Render the image if available */}
        {chatImage && (
          <img
            src={chatImage}
            alt={chatTitle}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        )}
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
    </div>
  );
}

export default ChatListItem;
