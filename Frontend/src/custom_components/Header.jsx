


import {React,useState} from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import Profile from "./Profile";
import { useContext } from "react";
import { Bell } from "lucide-react"
import UserContext from "@/contextApi/UserContext";

export default function Header() {
  const { user } = useContext(UserContext);
  const [isShowingProfile, setIsShowingProfile] = useState(false);

  const showProfile = () => {
    setIsShowingProfile(!isShowingProfile);
  }

  return (
    <header className="flex items-center justify-between p-4 bg-background text-foreground shadow">
      <div className="text-xl font-bold">Chat App</div>
      <div className="flex items-center space-x-4">
        {/* Dark/Light Mode Toggle */}
        <Button>
            <Bell  size={24} />
        </Button>
        {/* Notification Button */}
        <ThemeToggle />
        {/* Profile Button */}
        <Button variant="ghost">
          <img
            src={user?.pic || "/path/to/profile.jpg"} // Replace with actual profile image URL
            alt="Profile"
            className="w-8 h-8 rounded-full"
            onClick={showProfile}
          />
        </Button>
       {
        isShowingProfile && (
           <div className="relative">
            <Profile onClose={()=>{setIsShowingProfile(false)}} />
          </div>
        )
       }
      </div>
    </header>
  );
}
