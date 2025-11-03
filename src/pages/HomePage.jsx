import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Mobile filter popup states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  // Predefined price ranges
  const priceRanges = [
    { label: "₹0 - ₹999", min: 0, max: 999 },
    { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
    { label: "₹2000 - ₹4999", min: 2000, max: 4999 },
    { label: "₹5000+", min: 5000, max: Infinity },
  ];

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
        setFilteredProducts(data || []);

        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map((item) => item.category))];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Apply category and price filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((p) =>
        selectedPriceRanges.some(
          (range) => p.offer_price >= range.min && p.offer_price <= range.max
        )
      );
    }

    setFilteredProducts(filtered);
  }, [activeCategory, selectedPriceRanges, products]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const togglePriceRange = (range) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  // Clear filters handler
  const clearFilters = () => {
    setActiveCategory("All");
    setSelectedPriceRanges([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700 animate-pulse">Loading outfits...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 relative">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
        Explore Our Outfits
      </h1>

      {/* Desktop Clear Filters Button */}
      <div className="hidden sm:flex justify-center mb-4">
        <button
          onClick={clearFilters}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex justify-end mb-4 sm:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow hover:bg-amber-600"
        >
          Filter
        </button>
      </div>

      {/* Desktop Category Filter */}
      <div className="hidden sm:flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
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

      {/* Mobile Filter Popup */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="bg-white w-3/4 max-w-sm h-full p-5 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Category</h3>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`block w-full text-left px-3 py-2 rounded-md mb-1 ${
                    activeCategory === category
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedPriceRanges.includes(range)}
                    onChange={() => togglePriceRange(range)}
                  />
                  {range.label}
                </label>
              ))}
            </div>

            {/* Buttons: Clear & Apply */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={clearFilters}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition duration-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Safely get public URL, fallback if missing
            let imageUrl = "/placeholder.png"; // fallback
            if (product.image_url) {
              const { data } = supabase.storage
                .from("outfit_images")
                .getPublicUrl(product.image_url);
              if (data?.publicUrl) {
                imageUrl = data.publicUrl;
              }
            }

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                {/* Image */}
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>

                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-800">Offer:</span>{" "}
                      {product.quantity
                        ? `${product.quantity} items for ₹${product.offer_price}`
                        : "No active offer"}
                    </p>
                  </div>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Available Size:</span> {product.size}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock_status}
                  </p>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {product.description || "No description available."}
                  </p>

                  <p className="text-lg font-bold text-amber-600">₹{product.offer_price}</p>

                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 bg-gray-200 text-gray-800 text-sm py-2 rounded-lg hover:bg-gray-300 transition duration-300">
                      Add to Cart
                    </button>
                    <button className="flex-1 bg-amber-500 text-white text-sm py-2 rounded-lg hover:bg-amber-600 transition duration-300">
                      Buy Now
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
