import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Calendar,
  User,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Consultations = () => {
  const { API_BASE } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/consultancy/all`);
      setConsultations(response.data.data || []);
    } catch (error) {
      console.error("Error loading consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = statusFilter
    ? consultations.filter(
        (consultation) => consultation.status === statusFilter,
      )
    : consultations;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "flag-green";
      case "in-progress":
        return "flag-yellow";
      case "pending":
        return "flag-red";
      default:
        return "flag-red";
    }
  };

  if (loading) {
    return <div className="loading">Loading consultations...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Consultations Management</h1>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-primary" onClick={loadConsultations}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle />
          </div>
          <div className="stat-content">
            <h3>
              {consultations.filter((c) => c.status === "pending").length}
            </h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar />
          </div>
          <div className="stat-content">
            <h3>
              {consultations.filter((c) => c.status === "in-progress").length}
            </h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <User />
          </div>
          <div className="stat-content">
            <h3>
              {consultations.filter((c) => c.status === "completed").length}
            </h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <User />
          </div>
          <div className="stat-content">
            <h3>{consultations.length}</h3>
            <p>Total Requests</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No consultation requests found
                </td>
              </tr>
            ) : (
              filteredConsultations.map((consultation) => (
                <tr key={consultation._id}>
                  <td>
                    <strong>
                      {consultation.firstName} {consultation.lastName}
                    </strong>
                  </td>
                  <td>
                    <span className="email-text">{consultation.email}</span>
                  </td>
                  <td>
                    <span className="phone-text">
                      {consultation.phoneNumber}
                    </span>
                  </td>
                  <td>
                    <div className="message-text">
                      {consultation.message?.length > 50
                        ? `${consultation.message.substring(0, 50)}...`
                        : consultation.message}
                    </div>
                  </td>
                  <td>{consultation.assignedTo?.fullName || "Unassigned"}</td>
                  <td>
                    <span
                      className={`flag-badge ${getStatusClass(consultation.status)}`}
                    >
                      {consultation.status?.toUpperCase() || "PENDING"}
                    </span>
                  </td>
                  <td>{formatDate(consultation.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Consultations;
