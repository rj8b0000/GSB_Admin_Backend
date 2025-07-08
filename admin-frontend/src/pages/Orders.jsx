import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { API_BASE } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/orders`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );
  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_BASE}/orders/${orderId}/status`, {
        status: newStatus,
      });
      loadOrders(); // Reload orders to show updated status
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "flag-green";
      case "shipped":
        return "flag-yellow";
      case "pending":
        return "flag-red";
      default:
        return "flag-red";
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Orders Management</h1>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button className="btn btn-primary" onClick={loadOrders}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart />
          </div>
          <div className="stat-content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package />
          </div>
          <div className="stat-content">
            <h3>{orders.filter((o) => o.status === "pending").length}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(avgOrderValue)}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {order._id.slice(-8)}
                  </td>
                  <td>
                    <strong>{order.userId?.fullName || "Unknown"}</strong>
                    <br />
                    <span className="email-text">{order.userId?.email}</span>
                  </td>
                  <td>
                    <div>{order.contactInfo?.name}</div>
                    <div className="phone-text">{order.contactInfo?.phone}</div>
                  </td>
                  <td>
                    <div className="items-list">
                      {order.items?.length || 0} item(s)
                      {order.items && order.items.length > 0 && (
                        <div style={{ fontSize: "0.8rem", color: "#999" }}>
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index}>{item.name}</div>
                          ))}
                          {order.items.length > 2 && (
                            <div>...and {order.items.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{formatCurrency(order.total)}</strong>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span
                      className={`flag-badge ${getStatusClass(order.status)}`}
                    >
                      {order.status?.toUpperCase() || "PENDING"}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
