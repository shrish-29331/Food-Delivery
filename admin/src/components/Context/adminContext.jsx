// src/components/Context/AdminContext.js
import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || null);

  const saveToken = (token) => {
    setAdminToken(token);
    localStorage.setItem("adminToken", token);
  };

  const logout = () => {
    setAdminToken(null);
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider value={{ adminToken, saveToken, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
