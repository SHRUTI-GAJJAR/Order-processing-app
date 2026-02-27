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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */


/**
 * @swagger
 * /api/orders/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
// ----------------------
// ADMIN GET ALL ORDERS
// ----------------------
router.get('/admin/orders', protect, authorize('admin'), getAllOrders);


/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (User)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64fa123abc456
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
// ----------------------
// GET ORDERS OF LOGGED-IN USER
// ----------------------
router.get('/my-orders', protect, getMyOrders);


/**
 * @swagger
 * /api/orders/{orderId}/accept:
 *   put:
 *     summary: Accept an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64fa123abc456
 *     responses:
 *       200:
 *         description: Order accepted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
// ----------------------
// ADMIN ACCEPT ORDER
// ----------------------
router.put('/:orderId/accept', protect, authorize('admin'), acceptOrder);

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   put:
 *     summary: Cancel an order (User)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64fa123abc456
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       401:
 *         description: Unauthorized
 */
// ----------------------
// USER CANCEL ORDER
// ----------------------
router.put('/:orderId/cancel', protect, cancelOrder);

module.exports = router;