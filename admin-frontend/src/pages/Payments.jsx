import React, { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, Smartphone, Globe, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Payments = () => {
  const { API_BASE } = useAuth();
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    // Filter payments when filter changes
    if (sourceFilter) {
      setFilteredPayments(
        payments.filter((payment) => payment.source === sourceFilter),
      );
    } else {
      setFilteredPayments(payments);
    }
  }, [payments, sourceFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const [paymentsResponse, analyticsResponse] = await Promise.all([
        axios.get(`${API_BASE}/payments`),
        axios.get(`${API_BASE}/payments/analytics`),
      ]);

      setPayments(paymentsResponse.data.payments || []);
      setFilteredPayments(paymentsResponse.data.payments || []);
      setAnalytics(analyticsResponse.data.analytics || {});
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case "app":
        return <Smartphone size={16} />;
      case "web":
        return <Globe size={16} />;
      case "manual":
        return <User size={16} />;
      default:
        return <User size={16} />;
    }
  };

  const getSourceClass = (source) => {
    switch (source?.toLowerCase()) {
      case "app":
        return "flag-green";
      case "web":
        return "flag-yellow";
      case "manual":
        return "flag-red";
      default:
        return "flag-red";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "flag-green";
      case "pending":
        return "flag-yellow";
      case "failed":
        return "flag-red";
      default:
        return "flag-red";
    }
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  const paymentSources = analytics.paymentSources || {};

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Payment Analytics</h1>
        <div className="filter-controls">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="app">App</option>
            <option value="web">Web</option>
            <option value="manual">Manual</option>
          </select>
          <button className="btn btn-primary" onClick={loadPayments}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Payment Source Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Smartphone />
          </div>
          <div className="stat-content">
            <h3>{paymentSources.app || 0}</h3>
            <p>App Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Globe />
          </div>
          <div className="stat-content">
            <h3>{paymentSources.web || 0}</h3>
            <p>Web Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <User />
          </div>
          <div className="stat-content">
            <h3>{paymentSources.manual || 0}</h3>
            <p>Manual Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(analytics.totalRevenue || 0)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Subscription Types */}
      <div className="chart-card" style={{ marginBottom: "30px" }}>
        <h3>Subscription Types</h3>
        <div className="stats-grid">
          <div className="stat-content">
            <h3>{analytics.subscriptionTypes?.monthly || 0}</h3>
            <p>Monthly Subscriptions</p>
          </div>
          <div className="stat-content">
            <h3>{analytics.subscriptionTypes?.yearly || 0}</h3>
            <p>Yearly Subscriptions</p>
          </div>
          <div className="stat-content">
            <h3>{analytics.subscriptionTypes?.lifetime || 0}</h3>
            <p>Lifetime Subscriptions</p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Type</th>
              <th>Source</th>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.user?.fullName || "Unknown User"}</td>
                  <td>
                    <strong>{formatCurrency(payment.amount)}</strong>
                  </td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.subscriptionType}</td>
                  <td>
                    <span
                      className={`flag-badge ${getSourceClass(payment.source)}`}
                    >
                      {getSourceIcon(payment.source)}
                      {payment.source?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {payment.transactionId}
                  </td>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td>
                    <span
                      className={`flag-badge ${getStatusClass(payment.status)}`}
                    >
                      {payment.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Revenue by Source */}
      {analytics.revenueBySource && analytics.revenueBySource.length > 0 && (
        <div className="chart-card" style={{ marginTop: "30px" }}>
          <h3>Revenue by Source</h3>
          <div className="stats-grid">
            {analytics.revenueBySource.map((source) => (
              <div key={source._id} className="stat-content">
                <h3>{formatCurrency(source.total)}</h3>
                <p>
                  {source._id?.toUpperCase()} ({source.count} payments)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
