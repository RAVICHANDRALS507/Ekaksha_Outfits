import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 850);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    navigate("/");
  };

  const menu = [
    { name: "Overview", to: "/admin" },
    { name: "Products", to: "/admin/products" },
    { name: "Orders", to: "/admin/orders" },
    { name: "Categories", to: "/admin/categories" },
    { name: "Inventory", to: "/admin/inventory" },
    { name: "Offers", to: "/admin/offers" },
    { name: "Settings", to: "/admin/settings" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 850);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) return null; // Do not render sidebar if width < 850px

  return (
    <aside className="w-64 bg-white shadow-md h-full flex flex-col">
      <div className="text-2xl font-bold p-4 text-amber-500 text-center">
        Ekaksha Admin
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className="block py-2 px-3 rounded hover:bg-amber-100 text-gray-700"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-600 font-semibold hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
