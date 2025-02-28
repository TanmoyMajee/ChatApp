import React from "react";
import { formatDistanceToNow } from "date-fns";

function ChatListItem({ chat, user, onlineUsers, setSelectedChat }) {
  let onlineIndicator = null;

  // For one-on-one chats, check if the other user is online.
  if (!chat.isGroupChat) {
    const otherUser = chat.users.find((u) => u._id !== user._id);
    const isOnline = onlineUsers.some(
      (onlineUser) => onlineUser._id === otherUser?._id
    );
    if (isOnline) {
      onlineIndicator = <span className="online-dot ml-2"></span>;
    }
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
}

export default ChatListItem;
