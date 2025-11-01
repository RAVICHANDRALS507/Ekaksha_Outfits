// src/components/Layout/AdminTopbar.jsx
import React from "react";

const AdminTopbar = () => {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="text-sm text-gray-600">Welcome, Admin</div>
    </header>
  );
};

export default AdminTopbar;
