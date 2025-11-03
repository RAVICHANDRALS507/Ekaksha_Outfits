import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Mobile filter popup
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  // Predefined price ranges
  const priceRanges = [
    { label: "₹0 - ₹499", min: 0, max: 499 },
    { label: "₹500 - ₹999", min: 500, max: 999 },
    { label: "₹1000 - ₹1499", min: 1000, max: 1499 },
    { label: "₹1500 - ₹1999", min: 1500, max: 1999 },
    // { label: "₹2000+", min: 2000, max: Infinity },
  ];

  // Fetch products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error.message);
      return;
    }
    setProducts(data || []);
    setFilteredProducts(data || []);
  };

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error.message);
      return;
    }

    // Assuming your table has a `name` column
    const categoryList = data?.map((c) => c.name) || [];
    setCategories(["All", ...categoryList]);
  };

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => {
        if (!p.categories) return false;

        // Handle both array type and comma-separated string
        const productCategories = Array.isArray(p.categories)
          ? p.categories
          : p.categories.split(",").map((c) => c.trim());

        return productCategories.includes(activeCategory);
      });
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

  const clearFilters = () => {
    setActiveCategory("All");
    setSelectedPriceRanges([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700 animate-pulse">
          Loading outfits...
        </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-sm max-h-[80vh] rounded-xl p-5 shadow-xl overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute top-3 right-3 text-gray-600 text-2xl font-bold hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Filters</h2>

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
            // Use direct image URL if available, otherwise try Supabase Storage, else fallback
            let imageUrl = "/placeholder.png";

            if (product.image_url) {
              if (product.image_url.startsWith("http")) {
                imageUrl = product.image_url;
              } else {
                const { data } = supabase.storage
                  .from("outfit_images")
                  .getPublicUrl(product.image_url);
                if (data?.publicUrl) {
                  imageUrl = data.publicUrl;
                }
              }
            }

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Offer:</span>{" "}
                    {product.quantity
                      ? `${product.quantity} items for ₹${product.offer_price}`
                      : "No active offer"}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Size:</span>{" "}
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                      {product.size}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.categories}
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      product.stock_status === "In Stock"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock_status}
                  </p>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {product.description || "No description available."}
                  </p>

                  <p className="text-lg font-bold text-amber-600">
                    ₹{product.offer_price}
                  </p>

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
