

// import React, { useEffect, useState, useRef } from "react";
// import { useChat } from "../contextApi/ChatProvider";
// import { useUser } from "../contextApi/UserContext";
// import axios from "axios";
// // import "./ChatBox.css"; // Import the CSS file with your styles

// export default function ChatBox() {
//   const { selectedChat } = useChat();
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom whenever messages change.
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetch messages when selectedChat or user changes.
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedChat) return;
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         // Ensure your backend URL is correct.
//         const { data } = await axios.get(
//           `http://localhost:5000/api/message/${selectedChat._id}`,
//           config
//         );
//         setMessages(data);
//       } catch (error) {
//         console.error("Failed to fetch messages", error);
//       }
//     };

//     fetchMessages();
//   }, [selectedChat, user]);

//   // Handle sending a new message.
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return; // Do nothing if message is empty
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       // Post the new message to the backend.
//       const { data } = await axios.post(
//         "http://localhost:5000/api/message",
//         { chatId: selectedChat._id, content: newMessage },
//         config
//       );

//       // Append the newly sent message to the messages list.
//       setMessages([...messages, data]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Failed to send message", error);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="messages-container">
//         {messages.map((message) => (
//           <div
//             key={message._id}
//             className={`message ${
//               message.sender && message.sender._id === user._id ? "sent" : "received"
//             }`}
//           >
//             {/* Display sender's name if available */}
//             {message.sender && message.sender.name && (
//               <div className="font-semibold">{message.sender.name}</div>
//             )}
//             <div>{message.content || message.text}</div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form className="message-input" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../contextApi/ChatProvider";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";
// import "./ChatBox.css"; // Ensure this file is imported so that the styles are applied

export default function ChatBox() {
  const { selectedChat } = useChat();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when selectedChat or user changes.
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Ensure your backend URL is correct.
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

  // Handle sending a new message.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return; // Do nothing if message is empty
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Post the new message to the backend.
      const { data } = await axios.post(
        "http://localhost:5000/api/message",
        { chatId: selectedChat._id, content: newMessage },
        config
      );

      // Append the newly sent message to the messages list.
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${
              message.sender && message.sender._id === user._id
                ? "sent"
                : "received"
            }`}
          >
            {message.sender && message.sender.name && (
              <div className="font-semibold">{message.sender.name}</div>
            )}
            <div>{message.content || message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
