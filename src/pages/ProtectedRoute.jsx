// src/pages/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const admin = localStorage.getItem("adminSession");
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

export default ProtectedRoute;
