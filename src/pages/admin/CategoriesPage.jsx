import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CategoriesPage = () => {
  // CATEGORY STATE
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);

  // COUPON STATE
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [couponDescription, setCouponDescription] = useState("");
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // EDITING COUPON
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [editingCouponData, setEditingCouponData] = useState({
    code: "",
    discount: "",
    expiry_date: "",
    description: "",
  });

  // =================== CATEGORY HANDLERS ===================

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("Error fetching categories:", error);
    else setCategories(data);

    setLoadingCategories(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: categoryName }])
      .select();

    if (error) console.error("Error adding category:", error);
    else {
      setCategories([...categories, data[0]]);
      setCategoryName("");
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const saveCategory = async (id) => {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: editingCategoryName })
      .eq("id", id)
      .select();

    if (error) console.error("Error updating category:", error);
    else {
      setCategories(categories.map((cat) => (cat.id === id ? data[0] : cat)));
      cancelEditingCategory();
    }
  };

  const deleteCategory = async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) console.error("Error deleting category:", error);
    else setCategories(categories.filter((cat) => cat.id !== id));
  };

  // =================== COUPON HANDLERS ===================

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching coupons:", error);
      setLoadingCoupons(false);
      return;
    }

    const today = new Date();
    const updatedCoupons = data.map((coupon) => {
      const isExpired =
        coupon.expiry_date && new Date(coupon.expiry_date) < today;
      return { ...coupon, is_active: !isExpired };
    });

    setCoupons(updatedCoupons);
    setLoadingCoupons(false);
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode || !discount) return;

    const expiry = expiryDate ? new Date(expiryDate) : null;
    const today = new Date();

    const { data, error } = await supabase
      .from("coupons")
      .insert([
        {
          code: couponCode,
          description: couponDescription,
          discount: parseInt(discount),
          expiry_date: expiryDate || null,
          is_active: !expiry || expiry >= today,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding coupon:", error);
      alert("Failed to add coupon. Check console for details.");
    } else {
      setCoupons([...coupons, data[0]]);
      setCouponCode("");
      setDiscount("");
      setExpiryDate("");
      setCouponDescription("");
    }
  };

  const deleteCoupon = async (id) => {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) console.error("Error deleting coupon:", error);
    else setCoupons(coupons.filter((c) => c.id !== id));
  };

  const startEditingCoupon = (coupon) => {
    setEditingCouponId(coupon.id);
    setEditingCouponData({
      code: coupon.code,
      discount: coupon.discount,
      expiry_date: coupon.expiry_date,
      description: coupon.description,
    });
  };

  const cancelEditingCoupon = () => {
    setEditingCouponId(null);
    setEditingCouponData({
      code: "",
      discount: "",
      expiry_date: "",
      description: "",
    });
  };

  const saveCoupon = async (id) => {
    const { data, error } = await supabase
      .from("coupons")
      .update({
        code: editingCouponData.code,
        discount: parseInt(editingCouponData.discount),
        expiry_date: editingCouponData.expiry_date || null,
        description: editingCouponData.description,
      })
      .eq("id", id)
      .select();

    if (error) console.error("Error updating coupon:", error);
    else {
      setCoupons(coupons.map((c) => (c.id === id ? data[0] : c)));
      cancelEditingCoupon();
    }
  };

  // =================== RENDER ===================

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories & Coupons</h1>
      <p className="text-gray-600 mb-8">
        Manage product categories and coupon codes here.
      </p>

      {/* ---------------------- CATEGORY SECTION ---------------------- */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

        <form onSubmit={handleAddCategory} className="space-y-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter category name"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
            >
              Add Category
            </button>
            <button
              type="button"
              onClick={fetchCategories}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 flex-1"
            >
              {loadingCategories ? "Loading..." : "Fetch Categories"}
            </button>
          </div>
        </form>

        {categories.length > 0 && (
          <ul className="mt-6 space-y-2 text-gray-700">
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
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditingCategory}
                      className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium">{cat.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEditingCategory(cat)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------------------- COUPON SECTION ---------------------- */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manage Coupons</h2>

        <form onSubmit={handleAddCoupon} className="space-y-4">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter coupon code"
            required
          />
          <textarea
            value={couponDescription}
            onChange={(e) => setCouponDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter coupon description"
            rows="2"
          />
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Discount (%)"
            required
          />
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded flex-1 hover:bg-green-700"
            >
              Add Coupon
            </button>
            <button
              type="button"
              onClick={fetchCoupons}
              className="bg-gray-700 text-white px-4 py-2 rounded flex-1 hover:bg-gray-800"
            >
              {loadingCoupons ? "Loading..." : "Fetch Coupons"}
            </button>
          </div>
        </form>

        {coupons.length > 0 && (
          <ul className="mt-6 space-y-3">
            {coupons.map((c) => (
              <li
                key={c.id}
                className={`p-4 rounded-lg border transition-all ${
                  c.is_active
                    ? "bg-gray-50 border-gray-200"
                    : "bg-gray-200 border-gray-300 opacity-80"
                }`}
              >
                {editingCouponId === c.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingCouponData.code}
                      onChange={(e) =>
                        setEditingCouponData({
                          ...editingCouponData,
                          code: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="number"
                      value={editingCouponData.discount}
                      onChange={(e) =>
                        setEditingCouponData({
                          ...editingCouponData,
                          discount: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="date"
                      value={editingCouponData.expiry_date || ""}
                      onChange={(e) =>
                        setEditingCouponData({
                          ...editingCouponData,
                          expiry_date: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <textarea
                      value={editingCouponData.description || ""}
                      onChange={(e) =>
                        setEditingCouponData({
                          ...editingCouponData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveCoupon(c.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded flex-1 hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditingCoupon}
                        className="bg-gray-500 text-white px-4 py-1 rounded flex-1 hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="text-gray-800 space-y-1">
                      <p>
                        <strong>Coupon Code:</strong> {c.code}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {c.description || "—"}
                      </p>
                      <p>
                        <strong>Discount:</strong> {c.discount}%
                      </p>
                      <p>
                        <strong>Exp:</strong>{" "}
                        {c.expiry_date || "No expiry"}
                      </p>
                      {!c.is_active && (
                        <p className="text-red-500 text-sm font-semibold">
                          (Expired)
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <button
                        onClick={() => startEditingCoupon(c)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
