// src/components/Settings/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    email: "",
    lastLogin: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get admin info from localStorage (mock data)
    const session = JSON.parse(localStorage.getItem("adminSession"));
    if (session) {
      setAdmin({
        email: session.email || "admin@example.com",
        lastLogin: session.lastLogin || new Date().toLocaleString(),
      });
    } else {
      // redirect if not logged in
      navigate("/");
    }
  }, [navigate]);

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (newPassword.trim().length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    // You can replace this logic with a real Supabase update call later.
    const session = JSON.parse(localStorage.getItem("adminSession")) || {};
    session.password = newPassword;
    localStorage.setItem("adminSession", JSON.stringify(session));

    setMessage("✅ Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    navigate("/");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center text-amber-500">
        Admin Settings
      </h1>

      {/* Admin Info */}
      <div className="mb-6">
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> {admin.email}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Last Login:</span> {admin.lastLogin}
        </p>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="space-y-3">
        <h2 className="font-medium text-lg mb-2">Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition"
        >
          Update Password
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <p
          className={`mt-3 text-sm text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Logout Button */}
      <div className="mt-6 border-t pt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
