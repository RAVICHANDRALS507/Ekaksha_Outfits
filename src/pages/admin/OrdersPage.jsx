// src/pages/admin/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data);
    };
    fetch();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="py-2 text-sm">{o.id.slice(0,8)}</td>
                <td>{o.customer_name}</td>
                <td>{o.total_items}</td>
                <td>₹{o.total_amount}</td>
                <td>{o.status}</td>
                <td className="text-sm text-gray-500">{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="6" className="py-4 text-center text-gray-500">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
