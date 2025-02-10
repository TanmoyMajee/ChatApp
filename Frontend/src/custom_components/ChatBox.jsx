// // // import React, { useEffect, useState, useContext } from "react";
// // // import axios from "axios";
// // // import UserContext from "@/contextApi/UserContext";

// // // const ChatBox = ({ chat }) => {
// // //   const { user } = useContext(UserContext);
// // //   const [messages, setMessages] = useState([]);

// // //   useEffect(() => {
// // //     const fetchMessages = async () => {
// // //       try {
// // //         const config = {
// // //           headers: {
// // //             Authorization: `Bearer ${user.token}`,
// // //           },
// // //         };
// // //         const { data } = await axios.get(`http://localhost:5000/api/message/${chat._id}`, config);
// // //         setMessages(data);
// // //       } catch (error) {
// // //         console.error("Failed to fetch messages", error);
// // //       }
// // //     };

// // //     fetchMessages();
// // //   }, [chat, user]);

// // //   return (
// // //     <div className="p-4">
// // //       <h2 className="text-xl font-bold mb-4">Chat Conversation</h2>
// // //       <div className="space-y-2">
// // //         {messages.map((message) => (
// // //           <div key={message._id} className="p-2 border-b">
// // //             <div className="font-semibold">{message.sender.name}</div>
// // //             <div>{message.content}</div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ChatBox;

// // // // ChatBox.jsx
// // // import React, { useEffect, useState } from "react";
// // // import { useChat } from "../contextApi/ChatProvider";
// // // import { useUser } from "../contextApi/UserContext";
// // // import axios from "axios";

// // // export default function ChatBox() {
// // //   const { selectedChat } = useChat();
// // //   const { user } = useUser();
// // //   const [messages, setMessages] = useState([]);

// // //   useEffect(() => {
// // //     const fetchMessages = async () => {
// // //       if (!selectedChat) return;
// // //       try {
// // //         const config = {
// // //           headers: {
// // //             Authorization: `Bearer ${user.token}`,
// // //           },
// // //         };
// // //         const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);
// // //         // console.log(data);
// // //         // console.group(data)
// // //         setMessages(data);
// // //       } catch (error) {
// // //         console.error("Failed to fetch messages", error);
// // //       }
// // //     };

// // //     fetchMessages();
// // //   }, [selectedChat, user]);


// // //   return (
// // //     <div className="p-4">
// // //       <h2 className="text-xl font-bold mb-4">Chat Conversation</h2>
// // //       <div className="space-y-2">
// // //         {messages.map((message) => (
// // //           <div key={message._id} className="p-2 border-b">
// // //             <div className="font-semibold">{message.sender.name}</div>
// // //             <div>{message.content}</div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import React, { useEffect, useState } from "react";
// // import { useChat } from "../contextApi/ChatProvider";
// // import { useUser } from "../contextApi/UserContext";
// // import axios from "axios";

// // export default function ChatBox() {
// //   const { selectedChat } = useChat();
// //   const { user } = useUser();
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState("");

// //   // Fetch messages whenever the selected chat or user changes.
// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       if (!selectedChat) return;
// //       try {
// //         const config = {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //           },
// //         };
// //         // Use the correct backend URL here (ensure no extra colon in the URL)
// //         const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);
// //         setMessages(data);
// //       } catch (error) {
// //         console.error("Failed to fetch messages", error);
// //       }
// //     };

// //     fetchMessages();
// //   }, [selectedChat, user]);

// //   // Send a new message to the backend.
// //   const sendMessage = async () => {
// //     if (!newMessage) return; // do nothing if message is empty
// //     try {
// //       const config = {
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${user.token}`,
// //         },
// //       };

// //       // Send the message. Your backend should create a message and update the chat's latestMessage.
// //       const { data } = await axios.post(
// //         "http://localhost:5000/api/message",
// //         { chatId: selectedChat._id, content: newMessage },
// //         config
// //       );

// //       // Append the new message to the current list.
// //       setMessages([...messages, data]);
// //       setNewMessage("");
// //     } catch (error) {
// //       console.error("Failed to send message", error);
// //     }
// //   };

// //   return (
// //     <div className="p-4 flex flex-col h-full">
// //       <h2 className="text-xl font-bold mb-4">Chat Conversation</h2>
// //       {/* Message list */}
// //       <div className="flex-1 space-y-2 overflow-y-auto">
// //         {messages.map((message) => (
// //           <div key={message._id} className="p-2 border-b">
// //             <div className="font-semibold">{message.sender.name}</div>
// //             <div>{message.content}</div>
// //           </div>
// //         ))}
// //       </div>
// //       {/* Input field and Send button */}
// //       <div className="flex items-center mt-4">
// //         <input
// //           type="text"
// //           placeholder="Type your message..."
// //           value={newMessage}
// //           onChange={(e) => setNewMessage(e.target.value)}
// //           className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none"
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
// //         >
// //           Send
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useChat } from "../contextApi/ChatProvider";
// import { useUser } from "../contextApi/UserContext";
// import axios from "axios";

// export default function ChatBox() {
//   const { selectedChat } = useChat();
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Fetch messages when the selected chat or user changes.
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedChat) return;
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         // Ensure the URL is correct (no extra colon)
//         const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);
//         setMessages(data);
//       } catch (error) {
//         console.error("Failed to fetch messages", error);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat, user]);

//   // Send a new message to the backend.
//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.post(
//         "http://localhost:5000/api/message",
//         { chatId: selectedChat._id, content: newMessage },
//         config
//       );
//       // Append the new message to the messages list.
//       setMessages([...messages, data]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Failed to send message", error);
//     }
//   };

//   return (
//     <div className="p-4 flex flex-col h-full">
//       <h2 className="text-xl font-bold mb-4">Chat Conversation</h2>
//       {/* Message list */}
//       <div className="flex-1 space-y-2 overflow-y-auto">
//         {messages.map((message) => (
//           <div key={message._id} className="p-2 border-b">
//             <div className="font-semibold">{message.sender.name}</div>
//             <div>{message.content}</div>
//           </div>
//         ))}
//       </div>
//       {/* Message input and send button */}
//       <div className="flex items-center mt-4">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
// ChatBox.jsx
import React, { useEffect, useState } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatBox({ onBack }) {
  const { selectedChat } = useChat();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  // Fetch messages when selectedChat or user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:5000/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
  }, [selectedChat, user]);

  // Function to send a new message
  const sendMessage = async (messageContent) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/message",
        { chatId: selectedChat._id, content: messageContent },
        config
      );

      setMessages([...messages, data]);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={selectedChat} onBack={onBack} />
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
