const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    subscriptionType: {
      type: String,
      enum: ["monthly", "yearly", "lifetime"],
      required: true,
    },
    source: { type: String, enum: ["app", "web", "manual"], default: "app" },
    description: { type: String },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
