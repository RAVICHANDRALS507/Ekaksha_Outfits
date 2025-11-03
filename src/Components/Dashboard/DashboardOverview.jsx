import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";

const DashboardOverview = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Fetch total products
      const { count: productCount, error: productError } = await supabase
        .from("products")
        .select("*", { count: "exact" });
      if (productError) console.error("Error fetching products:", productError);

      // Fetch total categories
      const { count: categoryCount, error: categoryError } = await supabase
        .from("categories")
        .select("*", { count: "exact" });
      if (categoryError) console.error("Error fetching categories:", categoryError);

      setTotalProducts(productCount || 0);
      setTotalCategories(categoryCount || 0);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const stats = [
    { title: "Total Products", value: loading ? "..." : totalProducts, color: "bg-amber-400" },
    { title: "Total Categories", value: loading ? "..." : totalCategories, color: "bg-green-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {stats.map((s) => (
    <div key={s.title} className={`${s.color} text-white rounded-xl p-4 shadow`}>
      <h3 className="text-sm">{s.title}</h3>
      <p className="text-2xl font-bold mt-2">{s.value}</p>
    </div>
  ))}
</div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <SalesChart /> */}
        {/* <TopProducts /> */}
      </div>

      <RecentOrders />
    </div>
  );
};

export default DashboardOverview;
