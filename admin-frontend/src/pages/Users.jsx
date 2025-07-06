import React, { useState, useEffect } from "react";
import { RefreshCw, Eye, Edit } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const { API_BASE } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flagFilter, setFlagFilter] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users when filter changes
    if (flagFilter) {
      setFilteredUsers(users.filter((user) => user.flag === flagFilter));
    } else {
      setFilteredUsers(users);
    }
  }, [users, flagFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/user/all/scores`);
      const usersData = response.data.users || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getFlagClass = (flag) => {
    switch (flag) {
      case "green":
        return "flag-green";
      case "yellow":
        return "flag-yellow";
      case "red":
        return "flag-red";
      default:
        return "flag-red";
    }
  };

  const handleViewUser = (userId) => {
    // Implement user view functionality
    console.log("Viewing user:", userId);
    alert("User view functionality will be implemented");
  };

  const handleEditUser = (userId) => {
    // Implement user edit functionality
    console.log("Editing user:", userId);
    alert("User edit functionality will be implemented");
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Users Management</h1>
        <div className="filter-controls">
          <select
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value)}
          >
            <option value="">All Flags</option>
            <option value="green">Green Flag</option>
            <option value="yellow">Yellow Flag</option>
            <option value="red">Red Flag</option>
          </select>
          <button className="btn btn-primary" onClick={loadUsers}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Score</th>
              <th>Flag</th>
              <th>Goal</th>
              <th>Age</th>
              <th>Weight (kg)</th>
              <th>Height (cm)</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName || "N/A"}</td>
                  <td>{user.phoneNumber || "N/A"}</td>
                  <td>
                    <strong>{user.score || 0}</strong>
                  </td>
                  <td>
                    <span className={`flag-badge ${getFlagClass(user.flag)}`}>
                      {(user.flag || "red").toUpperCase()}
                    </span>
                  </td>
                  <td>{user.goal || "N/A"}</td>
                  <td>{user.age || "N/A"}</td>
                  <td>{user.weight || "N/A"}</td>
                  <td>{user.height || "N/A"}</td>
                  <td>{formatDate(user.lastScoreUpdate || user.updatedAt)}</td>
                  <td>
                    <button
                      className="action-btn btn-view"
                      onClick={() => handleViewUser(user._id)}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="action-btn btn-edit"
                      onClick={() => handleEditUser(user._id)}
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Statistics */}
      <div className="stats-grid" style={{ marginTop: "30px" }}>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{users.filter((u) => u.flag === "green").length}</h3>
            <p>Green Flag Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{users.filter((u) => u.flag === "yellow").length}</h3>
            <p>Yellow Flag Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{users.filter((u) => u.flag === "red").length}</h3>
            <p>Red Flag Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>
              {Math.round(
                users.reduce((acc, user) => acc + (user.score || 0), 0) /
                  users.length,
              ) || 0}
            </h3>
            <p>Average Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
