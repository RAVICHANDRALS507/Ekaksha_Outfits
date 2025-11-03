// src/components/Products/AddProduct.jsx
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    offer_quantity: "",
    offer_price: "",
    size: "",
    category: "",
    description: "",
    stock_status: "In Stock",
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

    try {
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}_${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("outfit_images")
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      // Get public URL of uploaded image
      const { publicUrl, error: urlError } = supabase
        .storage
        .from("outfit_images")
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      // Insert product into database
      const { error } = await supabase.from("products").insert([
        {
          name: form.name,
          quantity: form.offer_quantity, // DB column is 'quantity'
          offer_price: form.offer_price,
          size: form.size,
          category: form.category,
          description: form.description,
          stock_status: form.stock_status,
          image_url: publicUrl, // store public URL
        },
      ]);

      if (error) throw error;

      // Reset form
      setForm({
        name: "",
        offer_quantity: "",
        offer_price: "",
        size: "",
        category: "",
        description: "",
        stock_status: "In Stock",
      });
      setImage(null);

      alert("✅ Product added successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product: " + err.message);
    } finally {
      setLoading(false);
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

        {/* Offer Section */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Offer Details:</label>
          <div className="flex gap-3">
            <input
              required
              type="number"
              min="1"
              value={form.offer_quantity}
              onChange={(e) => setForm({ ...form, offer_quantity: e.target.value })}
              placeholder="Quantity (e.g. 2)"
              className="w-1/2 border p-2 rounded"
            />
            <input
              required
              type="number"
              min="0"
              value={form.offer_price}
              onChange={(e) => setForm({ ...form, offer_price: e.target.value })}
              placeholder="Offer Price (e.g. 1000)"
              className="w-1/2 border p-2 rounded"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Example: 2 shirts for ₹1000</p>
        </div>

        {/* Size */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Size:</label>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={form.size === size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="hidden peer"
                />
                <div
                  className={`px-3 py-1.5 rounded-lg border-2 text-base font-medium transition ${
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

        {/* Category */}
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
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        {/* Stock Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Stock Status:</label>
          <div className="flex gap-4">
            {["In Stock", "Out of Stock"].map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="stock_status"
                  value={status}
                  checked={form.stock_status === status}
                  onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>

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
