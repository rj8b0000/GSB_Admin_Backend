import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  UserCheck,
  Eye,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ChatInterface from "./ChatInterface";

const Chats = () => {
  const { API_BASE } = useAuth();
  const [chats, setChats] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");

  const chatTypes = [
    "consultancy",
    "product_support",
    "feedback",
    "general",
    "other",
  ];
  const statuses = ["open", "resolved"];

  useEffect(() => {
    loadChats();
    loadTeamMembers();
  }, []);

  useEffect(() => {
    // Filter chats based on status, type, and assignment
    let filtered = chats;

    if (statusFilter) {
      filtered = filtered.filter((chat) => chat.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter((chat) => chat.chatType === typeFilter);
    }

    if (assignedFilter === "assigned") {
      filtered = filtered.filter((chat) => chat.assignedTo);
    } else if (assignedFilter === "unassigned") {
      filtered = filtered.filter((chat) => !chat.assignedTo);
    }

    setFilteredChats(filtered);
  }, [chats, statusFilter, typeFilter, assignedFilter]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/chat`);
      setChats(response.data.data || []);
      setFilteredChats(response.data.data || []);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/teams`);
      setTeamMembers(response.data.data || []);
    } catch (error) {
      console.error("Error loading team members:", error);
    }
  };

  const handleAssignChat = async (memberId) => {
    try {
      await axios.post(`${API_BASE}/chat/assign`, {
        chatId: selectedChat._id,
        memberId: memberId,
      });

      setShowAssignModal(false);
      setSelectedChat(null);
      loadChats();
    } catch (error) {
      console.error("Error assigning chat:", error);
      alert("Error assigning chat. Please try again.");
    }
  };

  const handleMarkResolved = async (chatId) => {
    if (window.confirm("Mark this chat as resolved?")) {
      try {
        await axios.put(`${API_BASE}/chat/${chatId}/resolve`);
        loadChats();
      } catch (error) {
        console.error("Error marking chat as resolved:", error);
        alert("Error updating chat status. Please try again.");
      }
    }
  };

  const handleViewChat = (chatId) => {
    setSelectedChatId(chatId);
    setShowChatInterface(true);
  };

  const handleBackToList = () => {
    setShowChatInterface(false);
    setSelectedChatId(null);
    loadChats(); // Refresh the chats list
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getChatTypeColor = (type) => {
    switch (type) {
      case "consultancy":
        return "flag-green";
      case "product_support":
        return "flag-yellow";
      case "feedback":
        return "flag-red";
      case "general":
        return "flag-green";
      default:
        return "flag-gray";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "flag-yellow";
      case "resolved":
        return "flag-green";
      default:
        return "flag-gray";
    }
  };

  if (loading) {
    return <div className="loading">Loading chats...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Chat Management</h1>
        <div className="filter-controls">
          <button className="btn btn-secondary" onClick={loadChats}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="filter-controls"
        style={{ marginBottom: "20px", flexWrap: "wrap" }}
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            color: "var(--text-white)",
          }}
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            color: "var(--text-white)",
          }}
        >
          <option value="">All Types</option>
          {chatTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={assignedFilter}
          onChange={(e) => setAssignedFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            color: "var(--text-white)",
          }}
        >
          <option value="">All Assignments</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>

      {/* Chats List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {filteredChats.map((chat) => (
          <div key={chat._id} className="chart-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "15px",
              }}
            >
              <div>
                <h3
                  style={{
                    color: "var(--primary-gold)",
                    marginBottom: "5px",
                    fontSize: "1.1rem",
                  }}
                >
                  {chat.customerName}
                </h3>
                <p
                  style={{
                    color: "var(--text-gray)",
                    fontSize: "0.9rem",
                    marginBottom: "5px",
                  }}
                >
                  {chat.customerEmail}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <span className={`flag-badge ${getStatusColor(chat.status)}`}>
                  {chat.status.toUpperCase()}
                </span>
                <span
                  className={`flag-badge ${getChatTypeColor(chat.chatType)}`}
                >
                  {chat.chatType.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Last Message Preview */}
            <div
              style={{
                background: "var(--background-dark)",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "15px",
              }}
            >
              {chat.messages && chat.messages.length > 0 ? (
                <div>
                  <p
                    style={{
                      color: "var(--text-white)",
                      fontSize: "0.9rem",
                      marginBottom: "5px",
                    }}
                  >
                    "{chat.messages[chat.messages.length - 1].text}"
                  </p>
                  <span
                    style={{ color: "var(--text-gray)", fontSize: "0.8rem" }}
                  >
                    {chat.messages[chat.messages.length - 1].sender ===
                    "customer"
                      ? "👤 Customer"
                      : "👨‍💼 Agent"}
                  </span>
                </div>
              ) : (
                <p style={{ color: "var(--text-gray)", fontStyle: "italic" }}>
                  No messages yet
                </p>
              )}
            </div>

            {/* Assignment Info */}
            <div style={{ marginBottom: "15px" }}>
              {chat.assignedTo ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <UserCheck size={16} color="var(--accent-green)" />
                  <span
                    style={{ color: "var(--text-white)", fontSize: "0.9rem" }}
                  >
                    Assigned to: {chat.assignedTo.fullName}
                  </span>
                </div>
              ) : (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <User size={16} color="var(--accent-yellow)" />
                  <span
                    style={{ color: "var(--text-gray)", fontSize: "0.9rem" }}
                  >
                    Unassigned
                  </span>
                </div>
              )}
            </div>

            {/* Chat Meta */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <MessageSquare size={16} color="var(--text-gray)" />
                <span style={{ color: "var(--text-gray)", fontSize: "0.8rem" }}>
                  {chat.messages?.length || 0} messages
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Clock size={16} color="var(--text-gray)" />
                <span style={{ color: "var(--text-gray)", fontSize: "0.8rem" }}>
                  {formatDate(chat.createdAt)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              {!chat.assignedTo && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedChat(chat);
                    setShowAssignModal(true);
                  }}
                  style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                >
                  <UserCheck size={14} />
                  Assign
                </button>
              )}
              {chat.status === "open" && (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleMarkResolved(chat._id)}
                  style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                >
                  <CheckCircle size={14} />
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedChat && (
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
              maxWidth: "400px",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2 style={{ color: "var(--primary-gold)", marginBottom: "20px" }}>
              Assign Chat to Team Member
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "var(--text-white)", marginBottom: "5px" }}>
                <strong>Customer:</strong> {selectedChat.customerName}
              </p>
              <p style={{ color: "var(--text-gray)", fontSize: "0.9rem" }}>
                <strong>Type:</strong>{" "}
                {selectedChat.chatType.replace("_", " ").toUpperCase()}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "var(--text-white)",
                  marginBottom: "10px",
                  display: "block",
                }}
              >
                Select Team Member:
              </label>
              {teamMembers.map((member) => (
                <button
                  key={member._id}
                  onClick={() => handleAssignChat(member._id)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-white)",
                    marginBottom: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "var(--border-color)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "var(--input-bg)")
                  }
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: "bold" }}>{member.fullName}</div>
                    <div
                      style={{ fontSize: "0.8rem", color: "var(--text-gray)" }}
                    >
                      {member.department} • {member.assignedChats?.length || 0}{" "}
                      chats
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Stats */}
      <div className="stats-grid" style={{ marginTop: "30px" }}>
        <div className="stat-card">
          <div className="stat-icon">
            <MessageSquare />
          </div>
          <div className="stat-content">
            <h3>{chats.length}</h3>
            <p>Total Chats</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{chats.filter((c) => c.status === "open").length}</h3>
            <p>Open Chats</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{chats.filter((c) => c.assignedTo).length}</h3>
            <p>Assigned Chats</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{chats.filter((c) => c.status === "resolved").length}</h3>
            <p>Resolved Chats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
