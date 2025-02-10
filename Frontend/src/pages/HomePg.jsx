// // // // // HomePage.jsx
// // // // import React, { useState } from "react";
// // // // import SideDrawer from "../custom_components/SideDrawer"; 
// // // // // Placeholder components – replace these with your actual implementations
// // // // const ChatList = ({ setSelectedChat }) => (
// // // //   <div className="p-4">
// // // //     <h2 className="text-xl font-bold mb-4">Chats</h2>
// // // //     {/* List of chats goes here; clicking one should call setSelectedChat */}
// // // //     <div className="text-gray-500">Chat list placeholder</div>
// // // //   </div>
// // // // );
// // // // const ChatBox = ({ chat }) => (
// // // //   <div className="p-4">
// // // //     <h2 className="text-xl font-bold mb-4">Chat Conversation</h2>
// // // //     <div className="text-gray-500">Chat box placeholder for chat: {chat}</div>
// // // //   </div>
// // // // );

// // // // export default function HomePage() {
// // // //   const [selectedChat, setSelectedChat] = useState(null);

// // // //   return (
// // // //     <div className="min-h-screen flex flex-col">
// // // //       <SideDrawer />
// // // //       <div className="flex flex-1">
// // // //         {/* Left Panel: Chat List */}
// // // //         <div className="w-1/3 border-r">
// // // //           <ChatList setSelectedChat={setSelectedChat} />
// // // //         </div>
// // // //         {/* Right Panel: Chat Box */}
// // // //         <div className="flex-1">
// // // //           {selectedChat ? (
// // // //             <ChatBox chat={selectedChat} />
// // // //           ) : (
// // // //             <div className="flex items-center justify-center h-full text-gray-500">
// // // //               Select a chat to start a conversation
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // HomePage.jsx
// // // import React, { useEffect } from "react";
// // // import SideDrawer from "../custom_components/SideDrawer";
// // // import ChatList from "../custom_components/ChatList";
// // // import ChatBox from "../custom_components/ChatBox";
// // // import { useChat } from "../contextApi/ChatProvider";
// // // import { useUser } from "../contextApi/UserContext";

// // // export default function HomePage() {
// // //   const { selectedChat, fetchChats } = useChat();
// // //   const { user } = useUser();

// // //   useEffect(() => {
// // //     if (user) {
// // //       fetchChats(user.token);
// // //     }
// // //   }, [user, fetchChats]);

// // //   return (
// // //     <div className="min-h-screen flex flex-col">
// // //       <SideDrawer />
// // //       <div className="flex flex-1">
// // //         {/* Left Panel: Chat List */}
// // //         <div className="w-1/3 border-r">
// // //           <ChatList />
// // //         </div>
// // //         {/* Right Panel: Chat Box */}
// // //         <div className="flex-1">
// // //           {selectedChat ? (
// // //             <ChatBox />
// // //           ) : (
// // //             <div className="flex items-center justify-center h-full text-gray-500">
// // //               Select a chat to start a conversation
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // // HomePage.jsx
// // import React, { useEffect } from "react";
// // import SideDrawer from "../custom_components/SideDrawer";
// // import ChatList from "../custom_components/ChatList";
// // import ChatBox from "../custom_components/ChatBox";
// // import { useChat } from "../contextApi/ChatProvider";
// // import { useUser } from "../contextApi/UserContext";

// // export default function HomePage() {
// //   const { selectedChat, fetchChats } = useChat();
// //   const { user } = useUser();

// //   useEffect(() => {
// //     if (user) {
// //       fetchChats(user.token);
// //     }
// //   }, [user, fetchChats]);

// //   return (
// //     <div className="min-h-screen flex flex-col">
// //       <SideDrawer />
// //       <div className="flex flex-1">
// //         {/* Left Panel: Chat List */}
// //         <div className="w-full md:w-1/3 border-r">
// //           <ChatList />
// //         </div>
// //         {/* Right Panel: Chat Box (hidden on small screens) */}
// //         <div className="flex-1 hidden md:block">
// //           {selectedChat ? (
// //             <ChatBox />
// //           ) : (
// //             <div className="flex items-center justify-center h-full text-gray-500">
// //               Select a chat to start a conversation
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // HomePage.jsx
// import React, { useEffect, useState } from "react";
// import SideDrawer from "../custom_components/SideDrawer";
// import ChatList from "../custom_components/ChatList";
// import ChatBox from "../custom_components/ChatBox";
// import MobileChatBox from "../custom_components/MobileChatBox";
// import { useChat } from "../contextApi/ChatProvider";
// import { useUser } from "../contextApi/UserContext";

// export default function HomePage() {
//   const { selectedChat, setSelectedChat, fetchChats } = useChat();
//   const { user } = useUser();

//   useEffect(() => {
//     if (user) {
//       fetchChats(user.token);
//     }
//   }, [user, fetchChats]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <SideDrawer />
//       {/* Layout for medium and up screens */}
//       <div className="hidden md:flex flex-1">
//         <div className="w-1/3 border-r">
//           <ChatList />
//         </div>
//         <div className="flex-1">
//           {selectedChat ? (
//             <ChatBox />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               Select a chat to start a conversation
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Layout for small screens */}
//       <div className="block md:hidden flex-1">
//         {selectedChat ? (
//           <MobileChatBox onBack={() => setSelectedChat(null)} />
//         ) : (
//           <ChatList />
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect } from "react";
import SideDrawer from "../custom_components/SideDrawer";
import ChatList from "../custom_components/ChatList";
import ChatBox from "../custom_components/ChatBox";
import MobileChatBox from "../custom_components/MobileChatBox";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";

export default function HomePage() {
  const { selectedChat, fetchChats, setSelectedChat } = useChat();
  const { user } = useUser();

  // Fetch chats when the user is available
  useEffect(() => {
    if (user) {
      fetchChats(user.token);
    }
  }, [user, fetchChats]);

  return (
    <div className="min-h-screen flex flex-col">
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
