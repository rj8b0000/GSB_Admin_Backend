const Payment = require("../models/Payment");
const User = require("../models/User");

// Create a new payment record
exports.createPayment = async (req, res) => {
  try {
    const {
      userId,
      amount,
      paymentMethod,
      transactionId,
      subscriptionType,
      source,
      description,
    } = req.body;

    const payment = new Payment({
      user: userId,
      amount,
      paymentMethod,
      transactionId,
      subscriptionType,
      source: source || "app",
      description,
      status: "completed",
    });

    await payment.save();
    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all payments with user details
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "fullName phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ payments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get payment analytics
exports.getPaymentAnalytics = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments({ status: "completed" });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const appPayments = await Payment.countDocuments({
      source: "app",
      status: "completed",
    });
    const webPayments = await Payment.countDocuments({
      source: "web",
      status: "completed",
    });
    const manualPayments = await Payment.countDocuments({
      source: "manual",
      status: "completed",
    });

    const monthlySubscriptions = await Payment.countDocuments({
      subscriptionType: "monthly",
      status: "completed",
    });
    const yearlySubscriptions = await Payment.countDocuments({
      subscriptionType: "yearly",
      status: "completed",
    });
    const lifetimeSubscriptions = await Payment.countDocuments({
      subscriptionType: "lifetime",
      status: "completed",
    });

    // Revenue by source
    const revenueBySource = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$source",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly revenue trend
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      analytics: {
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
        paymentSources: {
          app: appPayments,
          web: webPayments,
          manual: manualPayments,
        },
        subscriptionTypes: {
          monthly: monthlySubscriptions,
          yearly: yearlySubscriptions,
          lifetime: lifetimeSubscriptions,
        },
        revenueBySource,
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get payments by user
exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ payments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
