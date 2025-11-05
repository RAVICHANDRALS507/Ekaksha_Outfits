import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import SummaryPage from "./admin/SummaryPage";


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Mobile filter popup
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // ✅ Buy Now Summary popup
  const [showSummary, setShowSummary] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  const priceRanges = [
    { label: "₹0 - ₹499", min: 0, max: 499 },
    { label: "₹500 - ₹999", min: 500, max: 999 },
    { label: "₹1000 - ₹1499", min: 1000, max: 1499 },
    { label: "₹1500 - ₹1999", min: 1500, max: 1999 },
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

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error.message);
      return;
    }
    const categoryList = data?.map((c) => c.name) || [];
    setCategories(["All", ...categoryList]);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = [...products];

    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => {
        if (!p.categories) return false;
        const productCategories = Array.isArray(p.categories)
          ? p.categories
          : p.categories.split(",").map((c) => c.trim());
        return productCategories.includes(activeCategory);
      });
    }

    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((p) =>
        selectedPriceRanges.some(
          (range) => p.offer_price >= range.min && p.offer_price <= range.max
        )
      );
    }

    setFilteredProducts(filtered);
  }, [activeCategory, selectedPriceRanges, products]);

  const handleCategoryClick = (category) => setActiveCategory(category);

  const togglePriceRange = (range) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setSelectedPriceRanges([]);
  };

  // Add to Cart
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantityInCart += 1;
    } else {
      cart.push({ ...product, quantityInCart: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`${product.name} added to cart!`);
  };

  // ✅ Buy Now → open summary modal
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowSummary(true);
  };

  const closeSummary = () => {
    setSelectedProduct(null);
    setShowSummary(false);
  };

  // Lightbox controls
  const openLightbox = (index) => setCurrentProductIndex(index) || setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);
  const goToPrev = () =>
    setCurrentProductIndex((prevIndex) =>
      prevIndex === 0 ? filteredProducts.length - 1 : prevIndex - 1
    );
  const goToNext = () =>
    setCurrentProductIndex((prevIndex) =>
      prevIndex === filteredProducts.length - 1 ? 0 : prevIndex + 1
    );

  const getImageUrl = (product) => {
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
    return imageUrl;
  };

  // Lightbox view
  const Lightbox = () => {
    if (!filteredProducts.length) return null;
    const product = filteredProducts[currentProductIndex];
    const imageUrl = getImageUrl(product);
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4"
        onClick={closeLightbox}
      >
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 text-white text-4xl font-light z-10"
        >
          &times;
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-5xl bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 hidden sm:block"
        >
          &lt;
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-5xl bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 hidden sm:block"
        >
          &gt;
        </button>

        <img
          src={imageUrl}
          alt={product.name}
          className="max-w-full max-h-screen object-contain cursor-grab"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 p-2 rounded-lg text-lg sm:text-2xl font-semibold">
          {product.name}
        </div>
      </div>
    );
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
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
        Explore Our Outfits
      </h1>

      {/* Filter buttons */}
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

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const imageUrl = getImageUrl(product);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-56 object-cover cursor-pointer"
                  onClick={() => openLightbox(index)}
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
                  <p className="text-lg font-bold text-amber-600">
                    ₹{product.offer_price}
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-gray-200 text-gray-800 text-sm py-2 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)} // ✅ Opens summary popup
                      className="flex-1 bg-amber-500 text-white text-sm py-2 rounded-lg hover:bg-amber-600 transition duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox view */}
      {lightboxOpen && <Lightbox />}

      {/* ✅ Summary Popup Modal */}
      {showSummary && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 sm:w-1/2 md:w-1/3 rounded-xl p-6 shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={closeSummary}
            >
              &times;
            </button>

            <SummaryPage
              totalItems={selectedProduct.quantity || 1}
              totalPrice={selectedProduct.offer_price}
              discountPercent={0}
              discountAmount={0}
              selectedCoupon={null}
              finalTotal={selectedProduct.offer_price}
              coupons={[]} // No coupons in direct buy mode
              selectedCouponHandler={() => {}}
              clearCouponHandler={() => {}}
              openCouponModal={() => {}}
            />
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => navigate("/cart")}
        className="sm:hidden fixed bottom-5 right-5 bg-amber-500 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl hover:bg-amber-600 transition duration-300 z-50"
        aria-label="Go to Cart"
      >
        🛒
      </button>
    </div>
  );
};

export default HomePage;
