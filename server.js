require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const app = express();

// Connect to database (non-blocking)
connectDB()
  .then((dbConnected) => {
    if (dbConnected) {
      console.log("🚀 Server starting with database connection");
    } else {
      console.log("⚠️  Server starting WITHOUT database connection");
      console.log(
        "🔧 Database-dependent features will not work until MongoDB is connected"
      );
    }
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// CORS configuration for React frontend
const allowedOrigins = [
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "https://apis.gsbpathy.com/",
  "https://main.d13yqss2i4o49v.amplifyapp.com", // Add your Amplify app origin
  "https://main.d13yqss2i4o49v.amplifyapp.com/", // Add your Amplify app origin
  "https://admin.gsbpathy.com",
  "https://admin.gsbpathy.com/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request Origin:", origin); // Log the origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        console.log("Origin allowed:", origin);
        return callback(null, true);
      } else {
        console.log("Origin blocked:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.static("public"));
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const storyRoutes = require("./routes/storyRoutes");
const teamRoutes = require("./routes/teamRoutes");
const dietPlanRoutes = require("./routes/PDFRoutes");
const videoRoutes = require("./routes/videoRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const productRoutes = require("./routes/Product");
const consultantRoutes = require("./routes/consultationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dailyUpdateRoutes = require("./routes/dailyUpdateRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mockDataRoutes = require("./routes/mockDataRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const videoCategoryRoutes = require("./routes/videoCategoryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/daily-updates", dailyUpdateRoutes);
app.use("/api/dietplans", dietPlanRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/consultancy", consultantRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/mock", mockDataRoutes);
app.use("/api/dept", departmentRoutes);
app.use("/api/video-categories", videoCategoryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    status: "server_running",
    database: dbStatusText[dbStatus] || "unknown",
    timestamp: new Date().toISOString(),
    message:
      dbStatus === 1 ? "All systems operational" : "Database connection needed",
  });
});

// Admin panel route
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin/index.html");
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "GSB Admin Backend API",
    status: "running",
    admin_panel: "/admin",
    health_check: "/api/health",
    database_status:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running on port 3000");
  console.log("📱 Admin Panel: http://localhost:3000/admin");
  console.log("🔍 Health Check: http://localhost:3000/api/health");
  console.log("📋 API Status: http://localhost:3000/");
});
