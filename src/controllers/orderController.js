const Order = require('../models/Order');
const Product = require('../models/Product');
const {
  sendOrderCreatedEmail,
  sendOrderAcceptedEmail,
  sendOrderCancelledEmail,
  sendOrderRefundEmail
} = require('../services/emailService');

// ========================
// CREATE ORDER - USER
// ========================
const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.stock < quantity)
      return res.status(400).json({ success: false, message: 'Not enough stock' });

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      user: req.user._id,
      product: productId,
      quantity,
      totalPrice,
      status: 'pending',       // pending until admin accepts
      paymentStatus: 'pending' // payment will be updated separately
    });

    // Send email about new order + cancellation/refund policy
    await sendOrderCreatedEmail(req.user.email, product.name);

    res.status(201).json({
      success: true,
      message: 'Order placed. Waiting for admin confirmation.',
      data: order,
    });

  } catch (error) {
    next(error);
  }
};

// ========================
// ADMIN ACCEPT ORDER
// ========================
const acceptOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('product');

    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Cannot accept a cancelled order' });

    if (order.status !== 'pending')
      return res.status(400).json({ success: false, message: 'Order already processed' });

    if (order.product.stock < order.quantity)
      return res.status(400).json({ success: false, message: 'Not enough stock available' });

    // Reduce stock and mark accepted
    order.product.stock -= order.quantity;
    await order.product.save();

    order.status = 'accepted';
    await order.save();

    // Send email to user
    // ========================
// CREATE ORDER - USER
// ========================
const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.stock < quantity)
      return res.status(400).json({ success: false, message: 'Not enough stock' });

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      user: req.user._id,
      product: productId,
      quantity,
      totalPrice,
      status: 'pending',       // pending until admin accepts
      paymentStatus: 'pending' // payment will be updated separately
    });

    // Send email 
    await sendOrderCreatedEmail(req.user.email, product.name);

    res.status(201).json({
      success: true,
      message: 'Order placed. Waiting for admin confirmation.',
      data: order,
    });

  } catch (error) {
    next(error);
  }
};

    res.json({ success: true, message: 'Order accepted successfully', data: order });
  } catch (error) {
    next(error);
  }
};

// ========================
// CANCEL ORDER - USER (Without Admin Acceptance Requirement)
// ========================
const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('product');

    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const now = new Date();
    const hoursElapsed = Math.floor((now - order.updatedAt) / (1000 * 60 * 60));

    // ========================
    // UNPAID ORDER
    // ========================
    if (order.paymentStatus !== 'success') {
      order.status = 'cancelled';
      await order.save();

      await sendOrderCancelledEmail(req.user.email, order.product.name);

      return res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    }

    // ========================
    // PAID ORDER → REFUND POLICY
    // ========================
    let refundAmount = order.totalPrice;

    if (hoursElapsed < 24) {
      refundAmount = order.totalPrice * 0.9; // 10% deduction
    } else if (hoursElapsed >= 24 && hoursElapsed <= 48) {
      refundAmount = order.totalPrice * 0.25; // 25% refund
    } else {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel after 48 hours of payment',
      });
    }

    order.status = 'cancelled';
    order.paymentStatus = 'refunded';
    order.refundAmount = refundAmount;
    order.refundedAt = new Date();
    await order.save();

    // Restore stock
    if (order.product) {
      order.product.stock += order.quantity;
      await order.product.save();
    }

    await sendOrderRefundEmail(req.user.email, order.product.name, refundAmount);

    res.json({
      success: true,
      message: `Order cancelled successfully. Refund amount: ${refundAmount}`,
      data: order
    });

  } catch (error) {
    next(error);
  }
};

// ========================
// GET MY ORDERS - USER
// ========================
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('product');
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ========================
// GET ALL ORDERS - ADMIN
// ========================
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('product', 'name price');
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  acceptOrder,
  cancelOrder,
  getMyOrders,
  getAllOrders
};