// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const { data, error } = await supabase
        .from("admins")
        .select("id, email, role")
        .eq("email", email)
        .eq("password", password) // NOTE: plain-text for now, plan to hash
        .single();

      if (error || !data) {
        setErrorMsg("Invalid email or password");
        return;
      }

      // Save minimal session info
      localStorage.setItem("adminSession", JSON.stringify(data));
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-200">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2">Admin Login</h2>
        <p className="text-center text-gray-600 mb-6">
          Manage <span className="font-semibold text-amber-500">Men’s</span> &{" "}
          <span className="font-semibold text-amber-500">Women’s</span> Outfits
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

          <button className="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-lg">
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          For authorized admins only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
