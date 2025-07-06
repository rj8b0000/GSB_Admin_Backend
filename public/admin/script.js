// GSB Admin Panel JavaScript

// API Base URL
const API_BASE = "/api";

// Global variables
let currentSection = "dashboard";
let authToken = localStorage.getItem("adminToken");

// DOM Elements
const menuItems = document.querySelectorAll(".menu-item");
const contentSections = document.querySelectorAll(".content-section");
const pageTitle = document.getElementById("page-title");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is authenticated
  if (!authToken) {
    // Redirect to login page or show login modal
    showLoginModal();
    return;
  }

  // Initialize sidebar navigation
  initSidebarNavigation();

  // Load initial data
  loadDashboardData();

  // Setup auto-refresh for dashboard
  setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
});

// Sidebar Navigation
function initSidebarNavigation() {
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const section = this.dataset.section;

      if (section === "logout") {
        logout();
        return;
      }

      switchSection(section);
    });
  });
}

function switchSection(section) {
  // Update active menu item
  menuItems.forEach((item) => item.classList.remove("active"));
  document.querySelector(`[data-section="${section}"]`).classList.add("active");

  // Update active content section
  contentSections.forEach((section) => section.classList.remove("active"));
  document.getElementById(`${section}-section`).classList.add("active");

  // Update page title
  const titles = {
    dashboard: "Dashboard",
    users: "Users Management",
    payments: "Payment Analytics",
    "daily-updates": "Daily Updates",
    consultations: "Consultations",
    orders: "Orders",
    team: "Team Management",
  };

  pageTitle.textContent = titles[section] || "Dashboard";
  currentSection = section;

  // Load section specific data
  loadSectionData(section);
}

function loadSectionData(section) {
  switch (section) {
    case "dashboard":
      loadDashboardData();
      break;
    case "users":
      loadUsers();
      break;
    case "payments":
      loadPayments();
      break;
    default:
      console.log(`Loading ${section} data...`);
  }
}

// Dashboard Functions
async function loadDashboardData() {
  try {
    // Load various dashboard statistics
    await Promise.all([
      loadUserStats(),
      loadPaymentStats(),
      loadPaymentSourceChart(),
      loadUserScoreChart(),
    ]);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

async function loadUserStats() {
  try {
    const response = await fetch(`${API_BASE}/user/all/scores`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch user stats");

    const data = await response.json();
    const users = data.users || [];

    // Update user statistics
    document.getElementById("total-users").textContent = users.length;

    const greenFlagUsers = users.filter((user) => user.flag === "green").length;
    document.getElementById("green-flag-users").textContent = greenFlagUsers;
  } catch (error) {
    console.error("Error loading user stats:", error);
  }
}

async function loadPaymentStats() {
  try {
    const response = await fetch(`${API_BASE}/payments/analytics`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch payment stats");

    const data = await response.json();
    const analytics = data.analytics || {};

    // Update payment statistics
    document.getElementById("total-revenue").textContent =
      `₹${analytics.totalRevenue || 0}`;
    document.getElementById("total-payments").textContent =
      analytics.totalPayments || 0;
  } catch (error) {
    console.error("Error loading payment stats:", error);
  }
}

// Users Management
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE}/user/all/scores`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    const users = data.users || [];

    displayUsers(users);
  } catch (error) {
    console.error("Error loading users:", error);
    displayError("users-table-body", "Failed to load users");
  }
}

function displayUsers(users) {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";

  if (users.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align: center;">No users found</td></tr>';
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.fullName || "N/A"}</td>
            <td>${user.phoneNumber || "N/A"}</td>
            <td><strong>${user.score || 0}</strong></td>
            <td><span class="flag-badge flag-${user.flag || "red"}">${(user.flag || "red").toUpperCase()}</span></td>
            <td>${user.goal || "N/A"}</td>
            <td>${formatDate(user.lastScoreUpdate || user.updatedAt)}</td>
            <td>
                <button class="action-btn btn-view" onclick="viewUser('${user._id}')">View</button>
                <button class="action-btn btn-edit" onclick="editUser('${user._id}')">Edit</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Payments Management
async function loadPayments() {
  try {
    const [paymentsResponse, analyticsResponse] = await Promise.all([
      fetch(`${API_BASE}/payments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
      fetch(`${API_BASE}/payments/analytics`, {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    ]);

    if (!paymentsResponse.ok || !analyticsResponse.ok) {
      throw new Error("Failed to fetch payment data");
    }

    const paymentsData = await paymentsResponse.json();
    const analyticsData = await analyticsResponse.json();

    displayPayments(paymentsData.payments || []);
    displayPaymentAnalytics(analyticsData.analytics || {});
  } catch (error) {
    console.error("Error loading payments:", error);
    displayError("payments-table-body", "Failed to load payments");
  }
}

function displayPayments(payments) {
  const tbody = document.getElementById("payments-table-body");
  tbody.innerHTML = "";

  if (payments.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" style="text-align: center;">No payments found</td></tr>';
    return;
  }

  payments.forEach((payment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${payment.user?.fullName || "Unknown User"}</td>
            <td>₹${payment.amount}</td>
            <td>${payment.paymentMethod}</td>
            <td>${payment.subscriptionType}</td>
            <td><span class="flag-badge flag-${getSourceColor(payment.source)}">${payment.source.toUpperCase()}</span></td>
            <td>${formatDate(payment.paymentDate)}</td>
            <td><span class="flag-badge flag-${getStatusColor(payment.status)}">${payment.status.toUpperCase()}</span></td>
        `;
    tbody.appendChild(row);
  });
}

function displayPaymentAnalytics(analytics) {
  const sources = analytics.paymentSources || {};
  document.getElementById("app-payments").textContent = sources.app || 0;
  document.getElementById("web-payments").textContent = sources.web || 0;
  document.getElementById("manual-payments").textContent = sources.manual || 0;
}

// Chart Functions
function loadPaymentSourceChart() {
  const ctx = document.getElementById("paymentSourceChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["App", "Web", "Manual"],
      datasets: [
        {
          data: [60, 30, 10], // Sample data - replace with real data
          backgroundColor: ["#D4AF37", "#FFD700", "#B8860B"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
          },
        },
      },
    },
  });
}

function loadUserScoreChart() {
  const ctx = document.getElementById("userScoreChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Green Flag", "Yellow Flag", "Red Flag"],
      datasets: [
        {
          label: "Number of Users",
          data: [25, 15, 10], // Sample data - replace with real data
          backgroundColor: ["#22c55e", "#fbbf24", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "#ffffff",
          },
          grid: {
            color: "#404040",
          },
        },
        x: {
          ticks: {
            color: "#ffffff",
          },
          grid: {
            color: "#404040",
          },
        },
      },
    },
  });
}

// Utility Functions
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

function getSourceColor(source) {
  switch (source?.toLowerCase()) {
    case "app":
      return "green";
    case "web":
      return "yellow";
    case "manual":
      return "red";
    default:
      return "red";
  }
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "completed":
      return "green";
    case "pending":
      return "yellow";
    case "failed":
      return "red";
    default:
      return "red";
  }
}

function displayError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<tr><td colspan="100%" style="text-align: center; color: #ef4444;">${message}</td></tr>`;
  }
}

// User Actions
function viewUser(userId) {
  // Implement user view functionality
  console.log("Viewing user:", userId);
  alert("User view functionality will be implemented");
}

function editUser(userId) {
  // Implement user edit functionality
  console.log("Editing user:", userId);
  alert("User edit functionality will be implemented");
}

// Authentication
function showLoginModal() {
  // For now, just use a simple prompt - in production, use a proper modal
  const email = prompt("Enter admin email:");
  const password = prompt("Enter admin password:");

  if (email && password) {
    login(email, password);
  }
}

async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    authToken = data.token;
    localStorage.setItem("adminToken", authToken);

    // Reload the page to initialize with authenticated state
    location.reload();
  } catch (error) {
    alert("Login failed: " + error.message);
    showLoginModal();
  }
}

function logout() {
  localStorage.removeItem("adminToken");
  authToken = null;
  location.reload();
}

// Sidebar toggle for mobile
document
  .querySelector(".sidebar-toggle")
  ?.addEventListener("click", function () {
    document.querySelector(".sidebar").classList.toggle("open");
  });

// Filter functionality
document.getElementById("flag-filter")?.addEventListener("change", function () {
  const selectedFlag = this.value;
  filterUsersByFlag(selectedFlag);
});

function filterUsersByFlag(flag) {
  const rows = document.querySelectorAll("#users-table-body tr");
  rows.forEach((row) => {
    if (!flag) {
      row.style.display = "";
      return;
    }

    const flagCell = row.querySelector(".flag-badge");
    if (flagCell && flagCell.textContent.toLowerCase().includes(flag)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
