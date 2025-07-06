import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Plus,
  Play,
  Edit,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Videos = () => {
  const { API_BASE } = useAuth();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(10);

  const [categories, setCategories] = useState([
    "Meditation",
    "Education",
    "Success Stories",
    "Fitness",
  ]);
  const accessLevels = ["Free", "Paid"];
  const [categoryForm, setCategoryForm] = useState({ name: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    accessLevel: "Free",
    youtubeLink: "",
    videoFile: null,
    thumbnailFile: null,
  });

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    // Filter videos based on search and filters
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((video) => video.category === categoryFilter);
    }

    if (accessFilter) {
      filtered = filtered.filter((video) => video.accessLevel === accessFilter);
    }

    setFilteredVideos(filtered);
    setCurrentPage(1);
  }, [videos, searchTerm, categoryFilter, accessFilter]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/videos`);
      setVideos(response.data.videos || []);
      setFilteredVideos(response.data.videos || []);
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that either video file or YouTube link is provided
    if (!formData.videoFile && !formData.youtubeLink) {
      alert("Please provide either a video file or YouTube link");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("accessLevel", formData.accessLevel);
      formDataToSend.append("youtubeLink", formData.youtubeLink);

      // Add files if selected
      if (formData.videoFile) {
        formDataToSend.append("video", formData.videoFile);
      }
      if (formData.thumbnailFile) {
        formDataToSend.append("thumbnail", formData.thumbnailFile);
      }

      if (editingVideo) {
        // Update video (you'll need to implement this endpoint)
        await axios.put(
          `${API_BASE}/videos/${editingVideo._id}`,
          formDataToSend,
        );
      } else {
        await axios.post(`${API_BASE}/videos`, formDataToSend);
      }

      setShowModal(false);
      setEditingVideo(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        accessLevel: "Free",
        youtubeLink: "",
        videoFile: null,
        thumbnailFile: null,
      });
      loadVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Error saving video. Please try again.");
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      category: video.category,
      accessLevel: video.accessLevel,
      youtubeLink: video.youtubeLink || "",
      videoFile: null,
      thumbnailFile: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`${API_BASE}/videos/${videoId}`);
        loadVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Error deleting video. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo,
  );
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-main">Video Management</h1>
        <div className="filter-controls">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingVideo(null);
              setFormData({
                title: "",
                description: "",
                category: "",
                accessLevel: "Free",
                youtubeLink: "",
                videoFile: null,
                thumbnailFile: null,
              });
              setShowModal(true);
            }}
          >
            <Plus size={16} />
            Add Video
          </button>
          <button className="btn btn-secondary" onClick={loadVideos}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className="filter-controls"
        style={{ marginBottom: "20px", flexWrap: "wrap" }}
      >
        <div
          className="search-box"
          style={{ position: "relative", flex: "1", minWidth: "200px" }}
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
            placeholder="Search videos..."
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

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            color: "var(--text-white)",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "var(--input-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            color: "var(--text-white)",
          }}
        >
          <option value="">All Access Levels</option>
          {accessLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Videos Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {currentVideos.map((video) => (
          <div key={video._id} className="chart-card">
            <div style={{ position: "relative", marginBottom: "15px" }}>
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    background: "var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  <Play size={48} color="var(--text-gray)" />
                </div>
              )}
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <span
                  className={`flag-badge flag-${video.accessLevel === "Free" ? "green" : "yellow"}`}
                >
                  {video.accessLevel}
                </span>
              </div>
            </div>

            <h3
              style={{
                color: "var(--primary-gold)",
                marginBottom: "8px",
                fontSize: "1.1rem",
              }}
            >
              {video.title}
            </h3>

            <p
              style={{
                color: "var(--text-gray)",
                marginBottom: "10px",
                fontSize: "0.9rem",
              }}
            >
              {video.description || "No description available"}
            </p>

            <div style={{ marginBottom: "15px" }}>
              <span
                className="flag-badge flag-green"
                style={{ marginRight: "8px" }}
              >
                {video.category}
              </span>
              <span style={{ color: "var(--text-gray)", fontSize: "0.8rem" }}>
                {formatDate(video.createdAt)}
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="action-btn btn-edit"
                onClick={() => handleEdit(video)}
              >
                <Edit size={14} />
              </button>
              <button
                className="action-btn btn-delete"
                onClick={() => handleDelete(video._id)}
              >
                <Trash2 size={14} />
              </button>
              {video.youtubeLink && (
                <a
                  href={video.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn btn-view"
                  style={{
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <Play size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-secondary"}`}
              style={{ minWidth: "40px" }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

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
              {editingVideo ? "Edit Video" : "Add New Video"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-white)",
                    resize: "vertical",
                  }}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
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
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Access Level</label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, accessLevel: e.target.value })
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
                  {accessLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>YouTube Link</label>
                <input
                  type="url"
                  value={formData.youtubeLink}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeLink: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=..."
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
                <label>Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setFormData({ ...formData, videoFile: e.target.files[0] })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-white)",
                  }}
                />
                <small
                  style={{ color: "var(--text-gray)", fontSize: "0.8rem" }}
                >
                  Optional - Upload video file or provide YouTube link above
                </small>
              </div>

              <div className="form-group">
                <label>Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thumbnailFile: e.target.files[0],
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-white)",
                  }}
                />
                <small
                  style={{ color: "var(--text-gray)", fontSize: "0.8rem" }}
                >
                  Optional - Upload a thumbnail image for the video
                </small>
              </div>

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
                  {editingVideo ? "Update" : "Create"} Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid" style={{ marginTop: "30px" }}>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{videos.length}</h3>
            <p>Total Videos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{videos.filter((v) => v.accessLevel === "Free").length}</h3>
            <p>Free Videos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{videos.filter((v) => v.accessLevel === "Paid").length}</h3>
            <p>Premium Videos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>{categories.length}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
