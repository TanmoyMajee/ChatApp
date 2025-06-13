
import React, { createContext, useContext, useState, useEffect } from "react";
import {auth,googleProvider} from '../Firebase/firebase'
import { signInWithPopup } from 'firebase/auth';
import { useNavigate} from "react-router-dom";
import axios from "axios";


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

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send ID token to backend
      const backendURL = import.meta.env.VITE_BACKEND_URL || "";
      const response = await axios.post(`${backendURL}/api/users/google-login`, {
        idToken
      });

      if (response.data) {
        login(response.data);
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const googleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const backendURL = import.meta.env.VITE_BACKEND_URL || "";
      const response = await axios.post(`${backendURL}/api/users/google-register`, {
        idToken
      });

      if (response.data) {
        login(response.data);
      }
    } catch (error) {
      console.error("Google registration error:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout , socket,setSocketID,onlineUsers,setOnlineUsers , googleLogin , googleRegister}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
