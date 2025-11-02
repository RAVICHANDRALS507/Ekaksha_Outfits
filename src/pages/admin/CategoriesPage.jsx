import React, { useState } from "react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName) return;
    const newCategory = {
      id: Date.now(),
      name: categoryName,
      description: categoryDescription,
    };
    setCategories([...categories, newCategory]);
    setCategoryName("");
    setCategoryDescription("");
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !discount) return;
    const newCoupon = {
      id: Date.now(),
      code: couponCode,
      discount,
      expiryDate,
    };
    setCoupons([...coupons, newCoupon]);
    setCouponCode("");
    setDiscount("");
    setExpiryDate("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      <p className="text-gray-600 mb-8">Manage product categories and coupon codes here.</p>

      {/* Add Category Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter category description"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Category
          </button>
        </form>

        {/* Display Categories */}
        {categories.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Category List:</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <strong>{cat.name}</strong> — {cat.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Coupon Code Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add Coupon Code</h2>
        <form onSubmit={handleAddCoupon} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Coupon Code</label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter coupon code"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter discount percentage"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Coupon
          </button>
        </form>

        {/* Display Coupons */}
        {coupons.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Coupons List:</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {coupons.map((c) => (
                <li key={c.id}>
                  <strong>{c.code}</strong> — {c.discount}% off{" "}
                  {c.expiryDate && `(expires on ${c.expiryDate})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
