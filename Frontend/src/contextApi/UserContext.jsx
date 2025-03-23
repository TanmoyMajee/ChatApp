
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";

const UserContext = createContext();
// const location = useLocation();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket,setSocketID] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/signup");
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout , socket,setSocketID,onlineUsers,setOnlineUsers}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
