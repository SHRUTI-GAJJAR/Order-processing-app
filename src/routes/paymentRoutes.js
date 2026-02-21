const express = require('express');
const router = express.Router();
const { makePayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');

// Only payment route remains
router.post(
  '/',
  protect,
  [body('orderId').notEmpty().withMessage('Order ID required')],
  validateRequest,
  makePayment
);

module.exports = router;