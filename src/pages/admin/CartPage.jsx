import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const isInitialMount = useRef(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const reloadCart = () => {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(stored);
    };
    const onStorage = (e) => {
      if (e.key === "cart") reloadCart();
    };
    window.addEventListener("cartUpdated", reloadCart);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cartUpdated", reloadCart);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Increase quantity (of offers)
  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      )
    );
  };

  // Decrease quantity (of offers)
  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantityInCart: Math.max(item.quantityInCart - 1, 1) }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // --- CHANGE 1: Calculate Total Price (already correct) ---
  const totalPrice = cart.reduce(
    (total, item) => total + item.offer_price * item.quantityInCart,
    0
  );

  // --- CHANGE 2: Calculate Total Items ---
  const totalItems = cart.reduce(
    // (items per offer) * (number of offers)
    (total, item) => total + (item.quantity * item.quantityInCart),
    0
  );

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
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => {
            const imageUrl =
              item.image_url && item.image_url.startsWith("http")
                ? item.image_url
                : "/placeholder.png";

            // --- CHANGE 3: Calculate totals for this specific line item ---
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

                    {/* --- CHANGE 4: Updated Price/Item Display --- */}
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
                    {/* --- END OF CHANGE --- */}

                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    {/* --- CHANGE 5: Added a label for clarity --- */}
                    <label className="text-sm font-medium text-gray-700">
                      Quantity (Offers):
                    </label>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    {/* This span correctly shows the number of offers */}
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

        {/* Cart Summary */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between">
          <div> {/* Added wrapper div for better spacing */}
            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            {/* --- CHANGE 6: Updated Summary Box --- */}
            <div className="space-y-3 mb-6">
              <p className="text-gray-700 text-lg flex justify-between">
                <span>Total Items:</span>
                <span className="font-bold text-gray-900">{totalItems}</span>
              </p>
              <p className="text-gray-700 text-lg flex justify-between">
                <span>Grand Total:</span>
                <span className="font-bold text-amber-600">₹{totalPrice}</span>
              </p>
            </div>
            {/* --- END OF CHANGE --- */}

          </div>
          <button className="bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition duration-300">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;