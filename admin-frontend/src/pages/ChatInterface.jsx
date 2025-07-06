import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  ArrowLeft,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ChatInterface = ({ chatId, onBack }) => {
  const { API_BASE } = useAuth();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChat = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/chat/${chatId}`);
      setChat(response.data);
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await axios.post(`${API_BASE}/chat/${chatId}/reply`, {
        text: newMessage,
        agentId: "admin", // In real implementation, use actual admin ID
      });

      setNewMessage("");
      loadChat(); // Reload chat to get updated messages
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleMarkResolved = async () => {
    if (window.confirm("Mark this chat as resolved?")) {
      try {
        await axios.put(`${API_BASE}/chat/${chatId}/resolve`);
        loadChat();
        onBack && onBack();
      } catch (error) {
        console.error("Error marking chat as resolved:", error);
        alert("Error updating chat status. Please try again.");
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading chat...</div>;
  }

  if (!chat) {
    return (
      <div
        className="chart-card"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <MessageSquare
          size={48}
          color="var(--text-gray)"
          style={{ marginBottom: "15px" }}
        />
        <h3 style={{ color: "var(--text-gray)" }}>Chat not found</h3>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Chat Header */}
      <div className="chart-card" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={onBack} className="btn btn-secondary">
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 style={{ color: "var(--primary-gold)", margin: 0 }}>
                {chat.customerName}
              </h2>
              <p
                style={{
                  color: "var(--text-gray)",
                  margin: 0,
                  fontSize: "0.9rem",
                }}
              >
                {chat.customerEmail} •{" "}
                {chat.chatType.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span
              className={`flag-badge flag-${chat.status === "open" ? "yellow" : "green"}`}
            >
              {chat.status.toUpperCase()}
            </span>
            {chat.status === "open" && (
              <button
                onClick={handleMarkResolved}
                className="btn btn-primary"
                style={{ fontSize: "0.8rem", padding: "6px 12px" }}
              >
                <CheckCircle size={14} />
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="chart-card"
        style={{ height: "500px", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {chat.messages && chat.messages.length > 0 ? (
            chat.messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection:
                    message.sender === "customer" ? "row" : "row-reverse",
                  gap: "10px",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background:
                      message.sender === "customer"
                        ? "var(--accent-blue)"
                        : "var(--primary-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {message.sender === "customer" ? (
                    <User size={20} color="white" />
                  ) : (
                    <MessageSquare size={20} color="var(--background-dark)" />
                  )}
                </div>

                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px 15px",
                    borderRadius: "18px",
                    background:
                      message.sender === "customer"
                        ? "var(--background-light)"
                        : "var(--primary-gold)",
                    color:
                      message.sender === "customer"
                        ? "var(--text-white)"
                        : "var(--background-dark)",
                    border:
                      message.sender === "customer"
                        ? "1px solid var(--border-color)"
                        : "none",
                  }}
                >
                  <p style={{ margin: 0, lineHeight: "1.4" }}>{message.text}</p>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.7,
                      marginTop: "5px",
                      textAlign:
                        message.sender === "customer" ? "left" : "right",
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-gray)",
                fontStyle: "italic",
                marginTop: "50px",
              }}
            >
              No messages yet
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {chat.status === "open" && (
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid var(--border-color)",
              background: "var(--background-dark)",
            }}
          >
            <form
              onSubmit={handleSendMessage}
              style={{ display: "flex", gap: "10px" }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                disabled={sending}
                style={{
                  flex: 1,
                  padding: "12px 15px",
                  background: "var(--input-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "25px",
                  color: "var(--text-white)",
                  fontSize: "14px",
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="btn btn-primary"
                style={{
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {chat.status === "resolved" && (
          <div
            style={{
              padding: "15px",
              background: "var(--accent-green)",
              color: "white",
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            This chat has been resolved
          </div>
        )}
      </div>

      {/* Chat Info */}
      <div className="chart-card" style={{ marginTop: "20px" }}>
        <h3 style={{ color: "var(--primary-gold)", marginBottom: "15px" }}>
          Chat Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <strong style={{ color: "var(--text-white)" }}>Customer:</strong>
            <p style={{ color: "var(--text-gray)", margin: 0 }}>
              {chat.customerName}
            </p>
          </div>
          <div>
            <strong style={{ color: "var(--text-white)" }}>Email:</strong>
            <p style={{ color: "var(--text-gray)", margin: 0 }}>
              {chat.customerEmail}
            </p>
          </div>
          <div>
            <strong style={{ color: "var(--text-white)" }}>Type:</strong>
            <p style={{ color: "var(--text-gray)", margin: 0 }}>
              {chat.chatType.replace("_", " ").toUpperCase()}
            </p>
          </div>
          <div>
            <strong style={{ color: "var(--text-white)" }}>Started:</strong>
            <p style={{ color: "var(--text-gray)", margin: 0 }}>
              {formatDate(chat.createdAt)} at {formatTime(chat.createdAt)}
            </p>
          </div>
          <div>
            <strong style={{ color: "var(--text-white)" }}>Assigned to:</strong>
            <p style={{ color: "var(--text-gray)", margin: 0 }}>
              {chat.assignedTo?.fullName || "Unassigned"}
            </p>
          </div>
          <div>
            <strong style={{ color: "var(--text-white)" }}>Messages:</strong>
            <p style={{ color: "var(--text-gray)", margin: 0 }}>
              {chat.messages?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
