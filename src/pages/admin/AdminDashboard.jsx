// src/pages/AdminDashboard.jsx
import React from "react";
import Sidebar from "../../Components/Layout/Sidebar";
import AdminTopbar from "../../Components/Layout/AdminTopbar";
import DashboardOverview from "../../Components/Dashboard/DashboardOverview";
import ProductsPage from "./ProductsPage";
import OrdersPage from "./OrdersPage";
import CategoriesPage from "./CategoriesPage";
import { Routes, Route } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import InventoryPage from "./InventoryPage";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/add" element={<div><h2>Add product page</h2></div>} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            {/* add more admin child routes here */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
