// src/pages/admin/ProductsPage.jsx
import React from "react";
import ProductList from "../../components/Products/ProductList";
import AddProduct from "../../components/Products/AddProduct";

const ProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductList />
        </div>
        <div>
          <AddProduct />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
