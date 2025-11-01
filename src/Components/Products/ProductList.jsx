// src/components/Products/ProductList.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data);
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message);
    else setProducts((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <table className="w-full text-left">
        <thead className="text-sm text-gray-500">
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    {p.image_url ? <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/outfit_images/${p.image_url.split("/").pop()}`} alt={p.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.description?.slice(0,50)}</div>
                  </div>
                </div>
              </td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock_quantity ?? "-"}</td>
              <td>{p.status ?? "Active"}</td>
              <td className="text-right">
                <button className="text-sm mr-2">Edit</button>
                <button className="text-sm text-red-500" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan="6" className="py-4 text-center text-gray-500">No products yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
