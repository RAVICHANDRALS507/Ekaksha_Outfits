// src/components/Dashboard/DashboardOverview.jsx
import React from "react";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";

const DashboardOverview = () => {
  const stats = [
    { title: "Total Products", value: "240", color: "bg-amber-400" },
    { title: "Total Categories", value: "1,230", color: "bg-green-400" },
    // { title: "Total Revenue", value: "₹1,25,000", color: "bg-blue-400" },
    // { title: "Pending Orders", value: "32", color: "bg-red-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.title} className={`${s.color} text-white rounded-xl p-4 shadow`}>
            <h3 className="text-sm">{s.title}</h3>
            <p className="text-2xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopProducts />
      </div>

      <RecentOrders />
    </div>
  );
};

export default DashboardOverview;
