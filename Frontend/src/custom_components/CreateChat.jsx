

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useUser } from "../contextApi/UserContext";
import { useChat } from "../contextApi/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const CreateChat = ({ onClose }) => {
    const { toast } = useToast();
  const { user } = useUser();
   const { setSelectedChat } = useChat();
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUser] = useState([]);

  // Filter users based on the search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  // Fetch all users from the backend and filter out the current user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("http://localhost:5000/api/users", config);
        const filteredData = data.filter(u => u._id !== user._id);
        setAllUsers(filteredData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [user]);

  // Toggle user selection
  const handleUserSelect = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUser(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUser([...selectedUsers, user]);
    }
  };

  // Handle creating a new chat
  const handleCreateChat =async () => {
    if (selectedUsers.length === 0) return;
    try {
    let response;
    if (selectedUsers.length === 1) {
      // One-to-one chat: use the receiverID of the selected contact
       const ChatName= prompt("Enter Chat name With New User:");
      const receiverID = selectedUsers[0]._id;
      // NOTE: Replace the endpoint URL with your one-to-one chat route
      response = await axios.post(
        "http://localhost:5000/api/chats/CreateOneToOneChat",
        { receiverID , ChatName},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
    } else {
      // Group chat: prompt for a group name and send selected user IDs
      const groupName = prompt("Enter group name:");
      // NOTE: Replace the endpoint URL with your group chat route
      response = await axios.post(
        "http://localhost:5000/api/chats/CreateGroup",
        {
          chatName: groupName,
          // Send only the _id of each selected user
          users: selectedUsers.map((u) => u._id), 
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
    }
    // Set the selected chat to the newly created (or retrieved) chat object
    console.log("ResPonse After creating New Chat : ",response)
    console.log(response.data._id)
    setSelectedChat(response.data)
    if(response.data.latestMessage){
          toast({
        title: "Can't Crate a new Chat",
        description: `As Chat with this user is exists , Redirect to that : ${response.data.chatName}`
        // variant: "destructive",
      });
      //  By placing the global <Toaster /> in the Home page, toast messages remain visible even after the CreateChat modal closes. as this create chat will close instantly and we dont want to give toast here
      // console.log("Toast")
    }else{
       toast({
        title: "Chat Created",
        description: `Redirect to caht ${response.data.chatName}`
        // variant: "destructive"5665657465
      });
    }
    // if respone lastmsg was not null then give a toast that alredy a chat exists and u will redirect to that
    // setSelectedChat(response.data);
    // Optionally update your chats list here if needed

    // Close the CreateChat modal
    onClose();
  } catch (error) {
    console.error("Error creating chat:", error);
    // Optionally, handle errors (e.g., display a message to the user)
  }
  };

  return (
    // Backdrop: covers the screen and listens for clicks to close the modal
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      {/* Backdrop: The outer <div> covers the entire screen. Its onClick={onClose} means that clicking anywhere on this backdrop will close the modal. */}
      {/* Modal Container: on mobile it covers full screen; on md+ it becomes a centered modal */}
      <div
        className="fixed inset-0 md:absolute md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-1/3 md:h-3/4 bg-white dark:bg-gray-800 z-50 flex flex-col shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* In summary, attaching onClick={(e) => e.stopPropagation()} to the inner container prevents clicks within the modal from “bubbling up” and accidentally closing the modal when the backdrop is supposed to listen for outside clicks */}
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-green-500 dark:bg-green-700">
          <h2 className="text-xl text-white font-bold">New Chat</h2>
          <button onClick={onClose} className="text-white text-2xl">&times;</button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Selected Contacts */}
        {selectedUsers.length > 0 && (
          <div className="px-4 flex space-x-2 overflow-x-auto">
            {selectedUsers.map((user) => (
              <div key={user._id} className="flex items-center bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
                <button onClick={() => handleUserSelect(user)} className="ml-2 text-red-500">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Contacts List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`p-3 border-b flex items-center cursor-pointer ${
                selectedUsers.find((u) => u._id === user._id)
                  ? "bg-gray-100 dark:bg-gray-700"
                  : ""
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="p-4">
          <button
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0}
          >
            {selectedUsers.length > 1 ? "Create Group" : "Start Chat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;


 // if (selectedUsers.length === 0) return;
    // if (selectedUsers.length === 1) {
    //   const OneToOneName = prompt("Enter Chat name:");
    //    console.log("Creating one-to-one chat with:", selectedUsers, "Chat Name:", oneToOneName);
    // } else {
    //   const groupName = prompt("Enter group name:");
    //  console.log("Creating group chat with:", selectedUsers, "Group Name:", groupName);
    // }
    // onClose();