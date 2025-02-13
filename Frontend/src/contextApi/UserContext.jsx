
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";

const UserContext = createContext();
// const location = useLocation();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socketId,setSocketID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/home");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout , socketId,setSocketID}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
