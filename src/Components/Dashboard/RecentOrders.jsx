// src/components/Dashboard/RecentOrders.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6);
      if (data) setOrders(data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="py-2 text-sm">{o.id.slice(0,8)}</td>
                <td>{o.customer_name}</td>
                <td>{o.total_items}</td>
                <td>₹{o.total_amount}</td>
                <td className="text-sm text-gray-500">{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="5" className="py-4 text-center text-gray-500">No recent orders</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
