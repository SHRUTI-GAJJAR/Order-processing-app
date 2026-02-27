const express = require('express');
const router = express.Router();
const { makePayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment related APIs
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Make payment for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 64fa123abc456
 *     responses:
 *       200:
 *         description: Payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment completed successfully
 *       400:
 *         description: Validation error or payment failed
 *       401:
 *         description: Unauthorized (JWT required)
 */
// Only payment route remains
router.post(
  '/',
  protect,
  [body('orderId').notEmpty().withMessage('Order ID required')],
  validateRequest,
  makePayment
);

module.exports = router;