require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const initializeSocketIO = require("./chat_socket_io");
const { connectDB } = require("./config/db");
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocketIO(server);

// Make Socket.IO available to routes
app.set("io", io);

// Connect to database (non-blocking)
connectDB()
  .then((dbConnected) => {
    if (dbConnected) {
      console.log("Server starting with database connection");
    } else {
      console.log("⚠️Server starting WITHOUT database connection");
      console.log(
        "Database-dependent features will not work until MongoDB is connected"
      );
    }
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// CORS configuration
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3001",
  "https://apis.gsbpathy.com",
  "https://apis.gsbpathy.com/",
  "https://main.d13yqss2i4o49v.amplifyapp.com", // Add your Amplify app origin
  "https://main.d13yqss2i4o49v.amplifyapp.com/", // Add your Amplify app origin
  "https://admin.gsbpathy.com",
  "https://admin.gsbpathy.com/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request origin:", origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS: origin not allowed");
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
);
app.use(express.static("public"));
dotenv.config();

// Routes
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
const easebuzzRoutes = require("./routes/easebuzzRoutes");
const mockDataRoutes = require("./routes/mockDataRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const videoCategoryRoutes = require("./routes/videoCategoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
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
app.use("/api/easebuzz", easebuzzRoutes);
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

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const { connectDB } = require("./config/db");
// const app = express();

// // Connect to database (non-blocking)
// connectDB()
//   .then((dbConnected) => {
//     if (dbConnected) {
//       console.log("Server starting with database connection");
//     } else {
//       console.log("⚠️Server starting WITHOUT database connection");
//       console.log(
//         "Database-dependent features will not work until MongoDB is connected"
//       );
//     }
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err);
//   });

// // CORS configuration for React frontend
// const allowedOrigins = [
//   "http://localhost:3001",
//   "http://localhost:3002",
//   "http://127.0.0.1:3001",
//   "https://apis.gsbpathy.com",
//   "https://apis.gsbpathy.com/",
//   "https://main.d13yqss2i4o49v.amplifyapp.com", // Add your Amplify app origin
//   "https://main.d13yqss2i4o49v.amplifyapp.com/", // Add your Amplify app origin
//   "https://admin.gsbpathy.com",
//   "https://admin.gsbpathy.com/",
// ];

// // Configure CORS middleware to handle dynamic origins
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("Request origin:", origin); // Log the origin of each request
//       // Allow requests with no origin (e.g., mobile apps, curl)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.log("Blocked by CORS: origin not allowed"); // Log if the origin is blocked
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow credentials if needed
//   })
// );
// app.use(express.json({ limit: "100mb" }));
// app.use(
//   express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
// );
// app.use(express.static("public"));
// dotenv.config();

// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const storyRoutes = require("./routes/storyRoutes");
// const teamRoutes = require("./routes/teamRoutes");
// const dietPlanRoutes = require("./routes/PDFRoutes");
// const videoRoutes = require("./routes/videoRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// const productRoutes = require("./routes/Product");
// const consultantRoutes = require("./routes/consultationRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const dailyUpdateRoutes = require("./routes/dailyUpdateRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const easebuzzRoutes = require("./routes/easebuzzRoutes");
// const mockDataRoutes = require("./routes/mockDataRoutes");
// const departmentRoutes = require("./routes/departmentRoutes");
// const videoCategoryRoutes = require("./routes/videoCategoryRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/teams", teamRoutes);
// app.use("/api/stories", storyRoutes);
// app.use("/api/daily-updates", dailyUpdateRoutes);
// app.use("/api/dietplans", dietPlanRoutes);
// app.use("/api/videos", videoRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/consultancy", consultantRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/easebuzz", easebuzzRoutes);
// app.use("/api/mock", mockDataRoutes);
// app.use("/api/dept", departmentRoutes);
// app.use("/api/video-categories", videoCategoryRoutes);

// // Health check endpoint
// app.get("/api/health", (req, res) => {
//   const dbStatus = mongoose.connection.readyState;
//   const dbStatusText = {
//     0: "disconnected",
//     1: "connected",
//     2: "connecting",
//     3: "disconnecting",
//   };

//   res.json({
//     status: "server_running",
//     database: dbStatusText[dbStatus] || "unknown",
//     timestamp: new Date().toISOString(),
//     message:
//       dbStatus === 1 ? "All systems operational" : "Database connection needed",
//   });
// });

// // Admin panel route
// app.get("/admin", (req, res) => {
//   res.sendFile(__dirname + "/public/admin/index.html");
// });

// // Root route
// app.get("/", (req, res) => {
//   res.json({
//     message: "GSB Admin Backend API",
//     status: "running",
//     admin_panel: "/admin",
//     health_check: "/api/health",
//     database_status:
//       mongoose.connection.readyState === 1 ? "connected" : "disconnected",
//   });
// });

// app.listen(3000, "0.0.0.0", () => {
//   console.log("Server running on port 3000");
//   console.log("Admin Panel: http://localhost:3000/admin");
//   console.log("Health Check: http://localhost:3000/api/health");
//   console.log("API Status: http://localhost:3000/");
// });
