import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const navigate = useNavigate();

  const adminMenu = [
    { name: "Overview", to: "/admin" },
    { name: "Products", to: "/admin/products" },
    { name: "Orders", to: "/admin/orders" },
    { name: "Categories", to: "/admin/categories" },
    // { name: "Inventory", to: "/admin/inventory" },
    // { name: "Offers", to: "/admin/offers" },
    { name: "Settings", to: "/admin/settings" },
  ];

  // Load admin session and handle storage changes
  useEffect(() => {
    const loadAdminSession = () => {
      const session = localStorage.getItem("adminSession");
      if (session) {
        try {
          const data = JSON.parse(session);
          setAdminEmail(data.email || null);
        } catch (e) {
          console.error("Invalid adminSession:", e);
          setAdminEmail(null);
        }
      } else {
        setAdminEmail(null);
      }
    };

    loadAdminSession();

    const handleStorageChange = (e) => {
      if (e.key === "adminSession") {
        loadAdminSession();
      }
    };

    // handle same-tab updates (custom event)
    const handleAdminSessionChanged = () => loadAdminSession();

    const handleResize = () => setIsMobile(window.innerWidth < 850);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("adminSessionChanged", handleAdminSessionChanged);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("adminSessionChanged", handleAdminSessionChanged);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    // notify same-tab listeners (NavBar)
    window.dispatchEvent(new Event("adminSessionChanged"));
    navigate("/");
  };

  return (
    <nav className="bg-amber-300 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-gray-800 tracking-wide">
          Ekaksha <span className="text-white">Outfits</span>
        </Link>

        {/* Desktop Menu */}
        {!adminEmail && (
          <ul className="hidden md:flex space-x-8 text-lg font-medium">
            <li>
              <Link to="/" className="text-gray-800 hover:text-white transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-gray-800 hover:text-white transition duration-300">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-800 hover:text-white transition duration-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-800 hover:text-white transition duration-300">
                Contact
              </Link>
            </li>
          </ul>
        )}

        {/* Admin Section */}
        <div className="hidden md:flex items-center space-x-4">
          {adminEmail ? (
            <>
              <span className="text-gray-800 font-medium">👤 {adminEmail}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin-login"
              className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition duration-300"
            >
              Admin Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none ml-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-amber-200 shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4 text-lg font-medium">
            {!adminEmail && (
              <>
                <li>
                  <Link
                    to="/admin-login"
                    className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    className="text-gray-800 hover:text-white transition duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-800 hover:text-white transition duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-800 hover:text-white transition duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </>
            )}

            {adminEmail && isMobile && (
              <>
                {adminMenu.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      className="text-gray-800 hover:text-white transition duration-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
