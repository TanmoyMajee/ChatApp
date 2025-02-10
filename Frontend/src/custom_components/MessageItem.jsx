// MessageItem.jsx
import React from "react";
import { useUser } from "../contextApi/UserContext";

export default function MessageItem({ message }) {
  const { user } = useUser();
  const isSent = message.sender._id === user._id;

  return (
    <div className={`p-2 ${isSent ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block p-2 rounded-lg ${
          isSent ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        <p>{message.content}</p>
        <small className="text-xs">
          {new Date(message.createdAt).toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
}
