// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const { userId, contactInfo, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cart.items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    const order = new Order({
      userId,
      items: cart.items,
      contactInfo,
      paymentMethod,
      total,
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};


exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ message: 'Orders fetched', orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};
