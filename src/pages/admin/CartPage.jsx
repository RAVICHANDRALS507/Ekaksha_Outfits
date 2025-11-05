import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import SummaryPage from "./SummaryPage";

// ✅ Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  // 🛒 Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 🧾 Load active coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .order("discount", { ascending: false });

      if (error) console.error("Error fetching coupons:", error);
      else setCoupons(data || []);
    };
    fetchCoupons();
  }, []);

  // ✅ Update localStorage whenever cart changes
  const updateLocalStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🧮 Totals
  const totalPrice = cart.reduce(
    (total, item) => total + item.offer_price * item.quantityInCart,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity * item.quantityInCart,
    0
  );

  const finalTotal = Math.max(totalPrice - discountAmount, 0);

  // 🧠 Apply Coupon
  const applyCoupon = (coupon) => {
    const discountValue = (totalPrice * coupon.discount) / 100;
    setSelectedCoupon(coupon);
    setDiscountPercent(coupon.discount);
    setDiscountAmount(discountValue);
    setShowCouponModal(false);
  };

  // ❌ Clear Coupon
  const clearCoupon = () => {
    setSelectedCoupon(null);
    setDiscountPercent(0);
    setDiscountAmount(0);
  };

  // 🛠 Cart utility functions (now sync with localStorage)
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantityInCart: item.quantityInCart + 1 }
        : item
    );
    updateLocalStorage(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantityInCart: Math.max(item.quantityInCart - 1, 1) }
        : item
    );
    updateLocalStorage(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    updateLocalStorage(updatedCart);
  };

  // 🧩 Handle empty cart view
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🛍️ Cart Items Section */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => {
            const imageUrl =
              item.image_url && item.image_url.startsWith("http")
                ? item.image_url
                : "/placeholder.png";

            const lineTotalItems = item.quantity * item.quantityInCart;
            const lineTotalPrice = item.offer_price * item.quantityInCart;

            return (
              <div
                key={item.id}
                className="flex bg-white shadow-md rounded-xl overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-32 h-32 object-cover"
                />

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description || "No description available."}
                    </p>

                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Offer:</span>{" "}
                        {item.quantity} items for ₹{item.offer_price}
                      </p>
                      <p className="text-gray-900 font-bold">
                        <span className="font-semibold">Total Items:</span>{" "}
                        {lineTotalItems}
                      </p>
                      <p className="text-amber-600 font-bold text-base">
                        <span className="font-semibold">Line Total:</span> ₹
                        {lineTotalPrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity (Offers):
                    </label>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span>{item.quantityInCart}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Right Section (Coupon Button + Summary) */}
        <div className="flex flex-col gap-4">
          {/* ✅ Coupon Button Above Summary */}
          {coupons.length > 0 && (
            <div className="flex justify-end">
              {selectedCoupon ? (
                <button
                  onClick={clearCoupon}
                  className="bg-red-500 text-white w-full md:w-auto px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Clear Coupon ({selectedCoupon.code})
                </button>
              ) : (
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="bg-amber-500 text-white w-full md:w-auto px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                >
                  Apply Coupon
                </button>
              )}
            </div>
          )}

          {/* ✅ Summary Section Component */}
          <SummaryPage
            totalItems={totalItems}
            totalPrice={totalPrice}
            discountPercent={discountPercent}
            discountAmount={discountAmount}
            selectedCoupon={selectedCoupon}
            finalTotal={finalTotal}
          />
        </div>
      </div>

      {/* ✅ Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 sm:w-1/2 md:w-1/3 rounded-xl p-6 shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowCouponModal(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Select a Coupon
            </h2>

            {coupons.length > 0 ? (
              <ul className="space-y-3 max-h-60 overflow-y-auto">
                {coupons.map((c) => (
                  <li
                    key={c.id}
                    className="border p-3 rounded-lg flex justify-between items-center hover:bg-amber-50 cursor-pointer transition"
                    onClick={() => applyCoupon(c)}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{c.code}</p>
                      <p className="text-sm text-gray-600">
                        {c.description || "No description"} <br />
                        <span className="text-green-600 font-medium">
                          {c.discount}% off
                        </span>
                      </p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Apply
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No active coupons available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
