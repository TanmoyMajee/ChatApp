// // SideDrawer.jsx
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, X } from "lucide-react";
// import ThemeToggle from "./ThemeToggle"; // Import the ThemeToggle component

// export default function SideDrawer() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const toggleDrawer = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   return (
//     <>
//       {/* Header */}
//       <header className="flex items-center justify-between p-4 bg-background text-foreground shadow">
//         <div className="text-xl font-bold">Chat App</div>
//         <div className="flex items-center space-x-4">
//           <Button variant="ghost" onClick={toggleDrawer}>
//             <Search size={24} />
//           </Button>
//           {/* Dark/Light Mode Toggle Button */}
//           <ThemeToggle />
//           <Button variant="ghost">
//             {/* Replace with actual profile image URL */}
//             <img
//               src="/path/to/profile.jpg"
//               alt="Profile"
//               className="w-8 h-8 rounded-full"
//             />
//           </Button>
//         </div>
//       </header>

//          {/* Sliding Search Panel */}
//       <div
//         className={`fixed top-0 left-0 h-full w-80 bg-background text-foreground shadow-lg 
//           transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"   }`}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-border">
//           <h2 className="text-lg font-semibold">Search Users</h2>
//           <Button variant="ghost" onClick={toggleDrawer}>
//             <X size={24} />
//           </Button>
//         </div>
//         <div className="p-4">
//           <Input
//             type="text"
//             placeholder="Search by name or email"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="w-full"
//           />
//           {/* You can add search result rendering here */}
//         </div>
//       </div>
//     </>
//   );
// }
// // Now, you can use the SideDrawer component in the HomePage component by uncommenting the import statement and the <SideDrawer /> component in the HomePage component.

import React from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function SideDrawer() {
  return (
    <header className="flex items-center justify-between p-4 bg-background text-foreground shadow">
      <div className="text-xl font-bold">Chat App</div>
      <div className="flex items-center space-x-4">
        {/* Dark/Light Mode Toggle */}
        <ThemeToggle />
        {/* Profile Button */}
        <Button variant="ghost">
          <img
            src="/path/to/profile.jpg" // Replace with actual profile image URL
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </Button>
      </div>
    </header>
  );
}
