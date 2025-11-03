import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [couponDescription, setCouponDescription] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories (manual trigger)
  const fetchCategories = async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      setLoadingCategories(false);
    } else {
      setCategories(data);
      setLoadingCategories(false);
    }
  };

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: categoryName }])
      .select();

    if (error) {
      console.error("Error adding category:", error);
    } else {
      setCategories([...categories, data[0]]);
      setCategoryName("");
    }
  };

  // Start editing
  const startEditing = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  // Save edited category
  const saveCategory = async (id) => {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: editingCategoryName })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating category:", error);
    } else {
      setCategories(categories.map((cat) => (cat.id === id ? data[0] : cat)));
      cancelEditing();
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
    } else {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  // Add coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !discount) return;

    const newCoupon = {
      id: Date.now(),
      code: couponCode,
      discount,
      expiryDate,
      description: couponDescription,
    };

    setCoupons([...coupons, newCoupon]);
    setCouponCode("");
    setDiscount("");
    setExpiryDate("");
    setCouponDescription("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      <p className="text-gray-600 mb-8">
        Manage product categories and coupon codes here.
      </p>

      {/* Add Category Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="flex flex-row justify-between gap-2 w-full">
  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1 text-center"
  >
    Add Category
  </button>

  <button
    type="button"
    onClick={fetchCategories}
    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 flex-1 text-center"
  >
    {loadingCategories ? "Loading..." : "Fetch Categories"}
  </button>
</div>

        </form>

        {/* Display Categories (after clicking fetch) */}
{/* Display Categories (after clicking fetch) */}
{categories.length > 0 && (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">Category List:</h3>
    <ul className="space-y-2 text-gray-700">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
        >
          {editingCategoryId === cat.id ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={editingCategoryName}
                onChange={(e) => setEditingCategoryName(e.target.value)}
                className="border border-gray-300 rounded-md p-1 flex-1"
              />
              <button
                onClick={() => saveCategory(cat.id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span className="font-medium">{cat.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEditing(cat)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          )}
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
            <label className="block text-gray-700 font-medium mb-1">
              Coupon Code
            </label>
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
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={couponDescription}
              onChange={(e) => setCouponDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter coupon description"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Discount (%)
            </label>
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
            <label className="block text-gray-700 font-medium mb-1">
              Expiry Date
            </label>
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
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              {coupons.map((c) => (
                <li key={c.id}>
                  <strong>{c.code}</strong> — {c.discount}% off{" "}
                  {c.expiryDate && `(expires on ${c.expiryDate})`}
                  {c.description && (
                    <p className="text-gray-600 ml-4 text-sm">
                      {c.description}
                    </p>
                  )}
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
