
const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  try {
    const { userId, product } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [product] });
    } else {
      const existingItem = cart.items.find(item => item.productId == product.productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push(product);
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();
    res.status(200).json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};
