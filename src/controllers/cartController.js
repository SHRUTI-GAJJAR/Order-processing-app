const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add to Cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json({ success: true, message: 'Product added to cart', data: cart });

  } catch (error) {
    next(error);
  }
};

// Get User Cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart)
      return res.json({ success: true, items: [] });

    res.json({ success: true, data: cart });

  } catch (error) {
    next(error);
  }
};

// Remove Item From Cart
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart)
      return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json({ success: true, message: 'Item removed from cart' });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
