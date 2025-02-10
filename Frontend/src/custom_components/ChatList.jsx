// // import React, { useEffect, useState, useContext } from "react";
// // import axios from "axios";
// // import UserContext from "@/contextApi/UserContext";
// // import { formatDistanceToNow } from "date-fns";

// // const ChatList = ({ setSelectedChat }) => {
// //   const { user } = useContext(UserContext);
// //   const [chats, setChats] = useState([]);

// //   useEffect(() => {
// //     const fetchChats = async () => {
// //         if (!user) {
// //         console.error("User is not authenticated");
// //         return;
// //       }
// //       try {
// //         const config = {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //           },
// //         };
// //         const { data } = await axios.get("http://localhost:5000/api/chats", config);
// //         setChats(data);
// //       } catch (error) {
// //         console.error("Failed to fetch chats", error);
// //       }
// //     };

// //     fetchChats();
// //   }, [user]);

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-xl font-bold mb-4">Chats</h2>
// //       {chats.map((chat) => (
// //         <div
// //           key={chat._id}
// //           className="p-2 border-b cursor-pointer hover:bg-gray-100"
// //           onClick={() => setSelectedChat(chat)}
// //         >
// //           <div className="font-semibold">{chat.chatName}</div>
// //           {chat.latestMessage && (
// //             <div className="text-sm text-gray-500">
// //               {formatDistanceToNow(new Date(chat.latestMessage.createdAt), { addSuffix: true })}
// //             </div>
// //           )}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default ChatList;

// // ChatList.jsx
// import React from "react";
// import { useChat } from "../contextApi/ChatProvider";
// import { formatDistanceToNow } from "date-fns";

// export default function ChatList() {
//   const { chats, setSelectedChat } = useChat();

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Chats</h2>
//       {chats.map((chat) => (
//         <div
//           key={chat._id}
//           className="p-2 border-b cursor-pointer hover:bg-gray-100"
//           onClick={() => setSelectedChat(chat)}
//         >
//           <div className="font-semibold">{chat.chatName}</div>
//           {chat.latestMessage && (
//             <div className="text-sm text-gray-500">
//               {formatDistanceToNow(new Date(chat.latestMessage.createdAt), {
//                 addSuffix: true,
//               })}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

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
