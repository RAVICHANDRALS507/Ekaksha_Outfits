import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("product").select("*");
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
        setFilteredProducts(data || []);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter products by category
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700 animate-pulse">Loading outfits...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
        Explore Our Outfits
      </h1>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full font-medium border transition duration-300 ${
              activeCategory === category
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-gray-800 border-gray-300 hover:bg-amber-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {filteredProducts.map((product) => {
            const imageUrl = supabase.storage
              .from("outfit_images")
              .getPublicUrl(product.image_url).data.publicUrl;

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                {/* Image */}
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-40 sm:h-64 object-cover"
                />

                {/* Details */}
                <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-amber-600 font-bold text-sm sm:text-lg">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    <span className="font-semibold">Size:</span> {product.size}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.category}
                  </p>
                  {product.coupon && (
                    <p className="text-green-600 font-medium text-xs sm:text-sm">
                      Coupon: {product.coupon}
                    </p>
                  )}
                  <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <button className="flex-1 bg-amber-500 text-white text-xs sm:text-base py-1.5 sm:py-2 rounded-lg hover:bg-amber-600 transition duration-300">
                      Buy Now
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-800 text-xs sm:text-base py-1.5 sm:py-2 rounded-lg hover:bg-gray-300 transition duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;
