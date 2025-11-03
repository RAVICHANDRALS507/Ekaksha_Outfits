import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Determine products to show based on mobile and showAll state
  const productsToShow =
    isMobile && !showAll ? products.slice(0, 5) : products;

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="text-sm text-gray-500 border-b">
          <tr>
            <th className="w-2/5 px-2">Product</th>
            <th className="w-1/5 px-2">Category</th>
            <th className="w-1/5 px-2">Price</th>
            <th className="w-1/5 px-2">Status</th>
            <th className="w-1/5 px-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsToShow.length > 0 ? (
            productsToShow.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-3 px-2 break-words">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {p.image_url && (
                        <img
                          src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/outfit_images/${p.image_url.split("/").pop()}`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="break-words">
                      <div className="font-medium break-words">{p.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 break-words">{p.categories || "-"}</td>
                <td className="px-2 break-words">
                  ₹{p.offer_price != null ? p.offer_price.toFixed(2) : "-"}
                </td>
                <td className="px-2 break-words">{p.status || "Active"}</td>
                <td className="px-2 text-right whitespace-nowrap">
                  <button className="text-sm mr-2 text-blue-500">Edit</button>
                  <button
                    className="text-sm text-red-500"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No products yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Show "Show All" button on mobile if there are more than 5 products */}
      {isMobile && products.length > 5 && (
        <div className="text-center mt-4">
          <button
            className="text-blue-500 underline"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "Show All Products"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
