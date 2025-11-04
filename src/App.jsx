import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./pages/NavBar";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
// local dev/debug components (optional)
// import AddProduct from "./Components/Products/AddProduct";
import OrdersPage from "./pages/admin/OrdersPage";
import CartPage from "./pages/admin/CartPage";

const App = () => {
  return (
    <>
      <NavBar />
      <div className="pt-16">
        {" "}
        {/* offset for top nav if fixed */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* nested admin routes handled inside AdminDashboard via links */}
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
