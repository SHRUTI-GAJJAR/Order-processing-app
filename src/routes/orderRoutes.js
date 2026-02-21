const express = require('express');
const router = express.Router();
const {
  createOrder,
  acceptOrder,
  cancelOrder,
  getMyOrders,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');

// ----------------------
// ADMIN GET ALL ORDERS
// ----------------------
router.get('/admin/orders', protect, authorize('admin'), getAllOrders);

// ----------------------
// CREATE A NEW ORDER - USER
// ----------------------
router.post(
  '/',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
  ],
  validateRequest,
  createOrder
);

// ----------------------
// GET ORDERS OF LOGGED-IN USER
// ----------------------
router.get('/my-orders', protect, getMyOrders);

// ----------------------
// ADMIN ACCEPT ORDER
// ----------------------
router.put('/:orderId/accept', protect, authorize('admin'), acceptOrder);

// ----------------------
// USER CANCEL ORDER
// ----------------------
router.put('/:orderId/cancel', protect, cancelOrder);

module.exports = router;