// src/components/Products/AddProduct.jsx
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    size: "",
    category: "",
    description: "",
    coupon: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please choose an image");
      return;
    }
    if (!form.size) {
      alert("Please select a size");
      return;
    }
    if (!form.category) {
      alert("Please select a category");
      return;
    }

    setLoading(true);
    const fileName = `${Date.now()}_${image.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("outfit_images")
      .upload(fileName, image);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    const imagePath = uploadData.path;
    const { error } = await supabase.from("products").insert([
      {
        name: form.name,
        price: form.price,
        size: form.size,
        category: form.category,
        description: form.description,
        coupon: form.coupon,
        image_url: imagePath,
      },
    ]);

    setLoading(false);
    if (error) alert(error.message);
    else {
      alert("✅ Product added successfully!");
      setForm({
        name: "",
        price: "",
        size: "",
        category: "",
        description: "",
        coupon: "",
      });
      setImage(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Product Name */}
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product Name"
          className="w-full border p-2 rounded"
        />

        {/* Price */}
        <input
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          type="number"
          placeholder="Price"
          className="w-full border p-2 rounded"
        />

        {/* Size (Styled Radio Buttons) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select Size:
          </label>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={form.size === size}
                  onChange={(e) =>
                    setForm({ ...form, size: e.target.value })
                  }
                  className="hidden peer"
                />
                <div
                  className={`px-3 py-1.5 rounded-lg border-2 text-base font-medium transition
                  ${
                    form.size === size
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-amber-100"
                  }`}
                >
                  {size}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category:</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Description */}
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        {/* Coupon */}
        <input
          value={form.coupon}
          onChange={(e) => setForm({ ...form, coupon: e.target.value })}
          placeholder="Coupon code (optional)"
          className="w-full border p-2 rounded"
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full bg-amber-500 text-white py-2 rounded mt-2 hover:bg-amber-600 transition duration-300"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
