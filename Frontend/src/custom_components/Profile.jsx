import React from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "../contextApi/UserContext";

export default function Profile({ onClose }) {
  const { user, logout } = useUser();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-end p-4"
      onClick={onClose}
    >
      <div
        className="w-64 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-4">
          <img
            src={user?.pic || "/default-profile.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {user?.name || "User Name"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
