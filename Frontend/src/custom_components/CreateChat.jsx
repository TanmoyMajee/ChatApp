// // import React, { useState, useEffect } from "react";
// // import { Input } from "@/components/ui/input";
// // import { useUser } from "../contextApi/UserContext";
// // import axios from "axios";

// // const CreateChat = ({  onClose, onCreateChat }) => {
// //   const { user} = useUser();
// //   const [allUsers , setAllUsers] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filteredUsers, setFilteredUsers] = useState(allUsers);
// //   const [selectedUsers, setSelectedUsers] = useState([]);

// //   useEffect(() => {
// //     if (searchTerm === "") {
// //       setFilteredUsers(allUsers);
// //     } else {
// //       const filtered = allUsers.filter((user) =>
// //         user.name.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //       setFilteredUsers(filtered);
// //     }
// //   }, [searchTerm, allUsers]);

// // useEffect(() => {
// //   const fetchUsers = async () => {
// //     try {
// //       const config = {
// //         headers: {
// //           Authorization: `Bearer ${user.token}`,
// //         },
// //       };
// //       const { data } = await axios.get("http://localhost:5000/api/users", config);
// //         // Filter out the current user from the list
// //       const filteredData = data.filter(u => u._id !== user._id);
// //       setAllUsers(filteredData);
// //     } catch (error) {
// //       console.error("Failed to fetch users:", error);
// //     }
// //   };

// //   fetchUsers();
// // }, []);

// //   const handleUserSelect = (user) => {
// //     // Toggle user selection
// //     if (selectedUsers.find((u) => u._id === user._id)) {
// //       setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
// //     } else {
// //       setSelectedUsers([...selectedUsers, user]);
// //     }
// //   };

// // //   If the user is already selected:
// // // Remove them from the selectedUsers array.
// // // If the user is not selected:
// // // Add them to the selectedUsers array.

// //   const handleCreateChat = () => {
// //     if (selectedUsers.length === 0) return;
// //     if (selectedUsers.length === 1) {
// //       onCreateChat(selectedUsers, null);
// //     } else {
// //       // For group chat, prompt for a group name
// //       const groupName = prompt("Enter group name:");
// //       onCreateChat(selectedUsers, groupName);
// //     }
// //     onClose();
// //   };

// //   return (
// //     <div className="fixed inset-0 flex flex-col bg-white z-50">
// //       {/* Header */}
// //       <div className="flex items-center justify-between p-4 bg-green-500">
// //         <h2 className="text-xl text-white font-bold">Create New Chat</h2>
// //         <button onClick={onClose} className="text-white text-2xl">&times;</button>
// //       </div>
// //       {/* Search Input */}
// //       <div className="p-4">
// //         <Input
// //           type="text"
// //           placeholder="Search Users..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="w-full"
// //         />
// //       </div>
// //       {/* Selected Contacts */}
// //       {selectedUsers.length > 0 && (
// //         <div className="px-4 m-4 flex space-x-2 overflow-x-auto">
// //           {selectedUsers.map((user) => (
// //             <div key={user._id} className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
// //               <span>{user.name}</span>
// //               <button
// //                 onClick={() => handleUserSelect(user)}
// //                 className="ml-2 text-red-500"
// //               >
// //                 &times;
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //       {/* Contacts List */}
// //       <div className="flex-1 p-4 overflow-y-auto">
// //         {filteredUsers.map((user) => (
// //           <div
// //             key={user._id}
// //             className={`p-3 border-b flex items-center cursor-pointer ${
// //               selectedUsers.find((u) => u._id === user._id) ? "bg-gray-100" : ""
// //             }`}
// //             onClick={() => handleUserSelect(user)}
// //           >
// //             <div className="font-semibold">{user.name}</div>
// //           </div>
// //         ))}
// //       </div>
// //       {/* Footer Button */}
// //       <div className="p-4">
// //         <button
// //           className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
// //           onClick={handleCreateChat}
// //           disabled={selectedUsers.length === 0}
// //         >
// //           {selectedUsers.length > 1 ? "Create Group" : "Start Chat"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateChat;

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { useUser } from "../contextApi/UserContext";
// import axios from "axios";

// const CreateChat = ({ onClose, onCreateChat }) => {
//   const { user } = useUser();
//   const [allUsers, setAllUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   // Filter users based on the search term
//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredUsers(allUsers);
//     } else {
//       const filtered = allUsers.filter((user) =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchTerm, allUsers]);

//   // Fetch all users from the backend and filter out the current user
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         const { data } = await axios.get("http://localhost:5000/api/users", config);
//         // Remove the current user from the list if necessary
//         const filteredData = data.filter(u => u._id !== user._id);
//         setAllUsers(filteredData);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchUsers();
//   }, [user]);

//   // Toggle user selection
//   const handleUserSelect = (user) => {
//     if (selectedUsers.find((u) => u._id === user._id)) {
//       setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
//     } else {
//       setSelectedUsers([...selectedUsers, user]);
//     }
//   };

//   // Handle creating a new chat
//   const handleCreateChat = () => {
//     if (selectedUsers.length === 0) return;
//     if (selectedUsers.length === 1) {
//       onCreateChat(selectedUsers, null);
//     } else {
//       const groupName = prompt("Enter group name:");
//       onCreateChat(selectedUsers, groupName);
//     }
//     onClose();
//   };

// return (
//   // Backdrop covers the entire screen and listens for clicks to close the modal
//   <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
//     {/* Modal Container: stops click propagation so clicks inside don't close it */}
//     <div
//       className="fixed inset-0 md:absolute md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-1/2 md:h-3/4 bg-white z-50 flex flex-col shadow-lg rounded-lg"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-green-500">
//         <h2 className="text-xl text-white font-bold">New Chat</h2>
//         <button onClick={onClose} className="text-white text-2xl">&times;</button>
//       </div>

//       {/* Search Input */}
//       <div className="p-4">
//         <Input
//           type="text"
//           placeholder="Search contacts..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full"
//         />
//       </div>

//       {/* Selected Contacts */}
//       {selectedUsers.length > 0 && (
//         <div className="px-4 flex space-x-2 overflow-x-auto">
//           {selectedUsers.map((user) => (
//             <div key={user._id} className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
//               <span>{user.name}</span>
//               <button onClick={() => handleUserSelect(user)} className="ml-2 text-red-500">
//                 &times;
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Contacts List */}
//       <div className="flex-1 p-4 overflow-y-auto">
//         {filteredUsers.map((user) => (
//           <div
//             key={user._id}
//             className={`p-3 border-b flex items-center cursor-pointer ${
//               selectedUsers.find((u) => u._id === user._id) ? "bg-gray-100" : ""
//             }`}
//             onClick={() => handleUserSelect(user)}
//           >
//             <div className="font-semibold">{user.name}</div>
//           </div>
//         ))}
//       </div>

//       {/* Footer Button */}
//       <div className="p-4">
//         <button
//           className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
//           onClick={handleCreateChat}
//           disabled={selectedUsers.length === 0}
//         >
//           {selectedUsers.length > 1 ? "Create Group" : "Start Chat"}
//         </button>
//       </div>
//     </div>
//   </div>
// );
// };

// export default CreateChat;
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useUser } from "../contextApi/UserContext";
import axios from "axios";

const CreateChat = ({ onClose, onCreateChat }) => {
  const { user } = useUser();
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle creating a new chat
  const handleCreateChat = () => {
    if (selectedUsers.length === 0) return;
    if (selectedUsers.length === 1) {
      onCreateChat(selectedUsers, null);
    } else {
      const groupName = prompt("Enter group name:");
      onCreateChat(selectedUsers, groupName);
    }
    onClose();
  };

  return (
    // Backdrop: covers the screen and listens for clicks to close the modal
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      {/* Modal Container: on mobile it covers full screen; on md+ it becomes a centered modal */}
      <div
        className="fixed inset-0 md:absolute md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-1/3 md:h-3/4 bg-white dark:bg-gray-800 z-50 flex flex-col shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
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
