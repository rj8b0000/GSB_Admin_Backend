import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Plus,
  Users,
  Edit,
  Trash2,
  Search,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Team = () => {
  const { API_BASE } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([
    "Customer Support",
    "Technical Support",
    "Sales",
    "Marketing",
    "Management",
  ]);
  const [departmentForm, setDepartmentForm] = useState({ name: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  useEffect(() => {
    // Filter members based on search
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredMembers(filtered);
  }, [teamMembers, searchTerm]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/teams`);
      setTeamMembers(response.data.data || []);
      setFilteredMembers(response.data.data || []);
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        // Update member (you'll need to implement this endpoint)
        await axios.put(`${API_BASE}/teams/${editingMember._id}`, formData);
      } else {
        await axios.post(`${API_BASE}/teams`, formData);
      }

      setShowModal(false);
      setEditingMember(null);
      setFormData({
        fullName: "",
        email: "",
        department: "",
      });
      loadTeamMembers();
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("Error saving team member. Please try again.");
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      department: member.department || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await axios.delete(`${API_BASE}/teams/${memberId}`);
        loadTeamMembers();
      } catch (error) {
        console.error("Error deleting team member:", error);
        alert("Error deleting team member. Please try again.");
      }
    }
  };

  // Department Management Functions
  const handleAddDepartment = () => {
    if (departmentForm.name && !departments.includes(departmentForm.name)) {
      setDepartments([...departments, departmentForm.name]);
      setDepartmentForm({ name: "" });
      setShowDepartmentModal(false);
    }
  };

  const handleEditDepartment = (oldDepartment) => {
    if (departmentForm.name && !departments.includes(departmentForm.name)) {
      const updatedDepartments = departments.map((dept) =>
        dept === oldDepartment ? departmentForm.name : dept,
      );
      setDepartments(updatedDepartments);
      setDepartmentForm({ name: "" });
      setEditingDepartment(null);
      setShowDepartmentModal(false);
    }
  };

  const handleDeleteDepartment = (departmentToDelete) => {
    if (
      window.confirm(
        `Are you sure you want to delete the department "${departmentToDelete}"?`,
      )
    ) {
      setDepartments(departments.filter((dept) => dept !== departmentToDelete));
    }
  };

  if (loading) {
    return <div className="loading">Loading team members...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Team Management</h1>
        <div className="filter-controls">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingMember(null);
              setFormData({
                fullName: "",
                email: "",
                department: "",
              });
              setShowModal(true);
            }}
          >
            <Plus size={16} />
            Add Team Member
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setEditingDepartment(null);
              setDepartmentForm({ name: "" });
              setShowDepartmentModal(true);
            }}
          >
            <Edit size={16} />
            Manage Departments
          </button>
          <button className="btn btn-secondary" onClick={loadTeamMembers}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="filter-controls" style={{ marginBottom: "20px" }}>
        <div
          className="search-box"
          style={{ position: "relative", flex: "1", maxWidth: "400px" }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-gray)",
            }}
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 8px 8px 35px",
              background: "var(--input-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              color: "var(--text-white)",
            }}
          />
        </div>
      </div>

      {/* Team Members Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Assigned Chats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No team members found
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member._id}>
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{member.department || "Not specified"}</td>
                  <td>
                    <span className="flag-badge flag-green">
                      {member.assignedChats?.length || 0} chats
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn btn-edit"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="action-btn btn-delete"
                      onClick={() => handleDelete(member._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--card-bg)",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2 style={{ color: "var(--primary-gold)", marginBottom: "20px" }}>
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-white)",
                  }}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-white)",
                  }}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-white)",
                  }}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {!editingMember && (
                <div
                  style={{
                    background: "var(--background-light)",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <p
                    style={{
                      color: "var(--text-gray)",
                      fontSize: "0.9rem",
                      margin: 0,
                    }}
                  >
                    <strong>Default Password:</strong> gsbpathy123
                    <br />
                    Team member can change this after first login.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? "Update" : "Add"} Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Stats */}
      <div className="stats-grid" style={{ marginTop: "30px" }}>
        <div className="stat-card">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-content">
            <h3>{teamMembers.length}</h3>
            <p>Total Team Members</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>
              {teamMembers.filter((m) => m.assignedChats?.length > 0).length}
            </h3>
            <p>Active Members</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>
              {teamMembers.reduce(
                (total, m) => total + (m.assignedChats?.length || 0),
                0,
              )}
            </h3>
            <p>Total Assigned Chats</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>
              {
                [
                  ...new Set(
                    teamMembers.map((m) => m.department).filter((d) => d),
                  ),
                ].length
              }
            </h3>
            <p>Departments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
