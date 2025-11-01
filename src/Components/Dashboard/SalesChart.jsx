// src/components/Dashboard/SalesChart.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { supabase } from "../../supabaseClient";

const SalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // For demo: generate fake monthly data or fetch real aggregated sales from supabase
    const demo = [
      { month: "Jan", sales: 4000 },
      { month: "Feb", sales: 6000 },
      { month: "Mar", sales: 8000 },
      { month: "Apr", sales: 5000 },
      { month: "May", sales: 7000 },
    ];
    setData(demo);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Monthly Sales</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
