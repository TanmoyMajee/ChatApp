// ChatHeader.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ChatHeader({ chat, onBack }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
      )}
      <h2 className="text-lg font-bold">{chat.chatName}</h2>
    </div>
  );
}
