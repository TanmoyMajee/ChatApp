// import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');

//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//       console.log(storedUser)
//     }else{
//       navigate('/');
//     }
//   }, []);

//   console.log(`storeduser from context ${user}`)
//   const login = (userData) => {
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//     navigate('/home');
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//     navigate('/login');
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;

// UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

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
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
