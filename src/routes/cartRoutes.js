const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// Add product to cart
router.post('/', protect, addToCart);

// Get logged-in user's cart
router.get('/', protect, getCart);

// Remove item from cart
router.delete('/', protect, removeFromCart);

module.exports = router;
