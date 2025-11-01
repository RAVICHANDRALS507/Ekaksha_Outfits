// src/components/Dashboard/TopProducts.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // demo: fetch latest products or best sellers if you track sales count
    const fetch = async () => {
      const { data } = await supabase.from("products").select("id, name, price, image_url").order("created_at", { ascending: false }).limit(5);
      if (data) setProducts(data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Top Products</h3>
      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
              {p.image_url ? <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/outfit_images/${p.image_url.split("/").pop()}`} alt={p.name} className="w-full h-full object-cover" /> : null}
            </div>
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">₹{p.price}</div>
            </div>
          </li>
        ))}
        {products.length === 0 && <li className="text-gray-500">No products yet</li>}
      </ul>
    </div>
  );
};

export default TopProducts;
