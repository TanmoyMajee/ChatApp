

// import React, { useEffect } from "react";
// import SideDrawer from "../custom_components/SideDrawer";
// import ChatList from "../custom_components/ChatList";
// import ChatBox from "../custom_components/ChatBox";
// import MobileChatBox from "../custom_components/MobileChatBox";
// import { useChat } from "../contextApi/ChatProvider";
// import { useUser } from "../contextApi/UserContext";
// import { io } from "socket.io-client";

// export default function HomePage() {
//   const { selectedChat, fetchChats, setSelectedChat } = useChat();
//   const { user, setSocketID ,socketId,setOnlineUsers,onlineUsers } = useUser();

//   // Fetch chats when the user is available
//   useEffect(() => {
//     if (user) {
//       fetchChats(user.token);
//     }
//   }, [user, fetchChats]);

//   // Initialize socket and store the instance
//   useEffect(() => {
//     if (user) {
//       const newsocket = io("http://localhost:5000" ,
//         {
//           query: {
//             userId: user._id,
//           }
//         }
//       );
//       setSocketID(newsocket);
//       // socketId.on("connect", () => {
//       //   console.log(`Connected to socket with ID: ${socket.id}`);
//       // });

//          // Use newsocket directly instead of socketId as setSocketID(newsocket) updates socketId asynchronously, meaning socketId remains null when socketId.on("connect", ...) runs.
// // React does not update the state immediately; it schedules the update, so socketId is still null at that moment.
//       newsocket.on("connect", () => {
//         console.log(`Connected to socket with ID: ${newsocket.id}`);
//       });

//       newsocket.on("getOnlineUsers", (users) => { 
//         console.log("Online Users", users);
//         setOnlineUsers(users);
//       });

//       return () => {
//         newsocket.disconnect(); // Cleanup when the component unmounts 
//         console.log("Socket disconnected");
//         console.log(onlineUsers);
//       };

//     }
//   } , [user]);

//   return (
//     // The outer container is now fixed to the viewport.
//     <div className="fixed inset-0 flex flex-col">
//       <SideDrawer />
//       {/* For medium and larger screens: show ChatList and ChatBox side by side */}
//       <div className="hidden md:flex flex-1">
//         <div className="w-full md:w-1/3 border-r">
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
//       {/* For small screens: show either ChatList or MobileChatBox */}
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
  }, [user, fetchChats]);

  // Initialize socket and store the instance (runs only when user changes)
  useEffect(() => {
    if (user) {
      const newsocket = io("http://localhost:5000", {
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
  }, [user, setSocketID, setOnlineUsers]);

  return (
    // Outer container fixed to the viewport
    <div className="fixed inset-0 flex flex-col">
      <SideDrawer />
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
