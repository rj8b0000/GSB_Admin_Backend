require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const app = express();

connectDB();
app.use(cors());
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

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
