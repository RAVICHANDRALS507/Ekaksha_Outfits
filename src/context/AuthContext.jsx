import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminSession, setAdminSession] = useState(
    localStorage.getItem("adminSession")
  );

  const login = (data) => {
    localStorage.setItem("adminSession", data);
    setAdminSession(data);
  };

  const logout = () => {
    localStorage.removeItem("adminSession");
    setAdminSession(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setAdminSession(localStorage.getItem("adminSession"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ adminSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
