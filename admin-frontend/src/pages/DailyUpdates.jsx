import React, { useState, useEffect } from "react";
import { RefreshCw, Calendar, User, Image } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const DailyUpdates = () => {
  const { API_BASE } = useAuth();
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyUpdates();
  }, []);

  const loadDailyUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/daily-updates`);
      setDailyUpdates(response.data.dailyUpdates || []);
    } catch (error) {
      console.error("Error loading daily updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatsForToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dailyUpdates.filter((update) => {
      const updateDate = new Date(update.createdAt);
      updateDate.setHours(0, 0, 0, 0);
      return updateDate.getTime() === today.getTime();
    }).length;
  };

  const getStatsForWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return dailyUpdates.filter(
      (update) => new Date(update.createdAt) >= weekAgo,
    ).length;
  };

  if (loading) {
    return <div className="loading">Loading daily updates...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Daily Updates Management</h1>
        <div className="filter-controls">
          <button className="btn btn-primary" onClick={loadDailyUpdates}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar />
          </div>
          <div className="stat-content">
            <h3>{getStatsForToday()}</h3>
            <p>Today's Updates</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar />
          </div>
          <div className="stat-content">
            <h3>{getStatsForWeek()}</h3>
            <p>This Week</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <User />
          </div>
          <div className="stat-content">
            <h3>{dailyUpdates.length}</h3>
            <p>Total Updates</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Image />
          </div>
          <div className="stat-content">
            <h3>{dailyUpdates.filter((u) => u.imageUrl).length}</h3>
            <p>With Images</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>User</th>
              <th>Description</th>
              <th>Image</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {dailyUpdates.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No daily updates found
                </td>
              </tr>
            ) : (
              dailyUpdates.map((update) => (
                <tr key={update._id}>
                  <td>
                    <strong>{update.title}</strong>
                  </td>
                  <td>
                    <div>{update.user?.fullName || "Unknown User"}</div>
                    <div className="email-text">{update.user?.email}</div>
                  </td>
                  <td>
                    <div className="description-text">
                      {update.description?.length > 100
                        ? `${update.description.substring(0, 100)}...`
                        : update.description}
                    </div>
                  </td>
                  <td>
                    {update.imageUrl ? (
                      <img
                        src={update.imageUrl}
                        alt="Daily update"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#999" }}>No image</span>
                    )}
                  </td>
                  <td>{formatDate(update.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyUpdates;
