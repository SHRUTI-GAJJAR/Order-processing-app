const Order = require('../models/Order');
const Payment = require('../models/Payment');
const retry = require('../services/retryService');
const circuitBreaker = require('../services/circuitBreaker');
const { sendPaymentReceiptEmail } = require('../services/emailService');

// Simulated Payment Function
const fakePaymentGateway = async () => {
  // simulate random failure
  if (Math.random() < 0.5) {
    throw new Error('Payment Gateway Failed');
  }
  return true;
};

// ========================
// MAKE PAYMENT - USER
// ========================
const makePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Find order and populate product + user
    const order = await Order.findById(orderId)
      .populate('product')
      .populate('user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only accepted orders can be paid
    if (order.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot pay for this order. Admin has not accepted it yet.'
      });
    }

    // Prevent duplicate payment
    if (order.paymentStatus === 'success') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Apply retry + circuit breaker for payment gateway
    await retry(() => circuitBreaker(fakePaymentGateway), 3);

    // Save payment record
    const payment = await Payment.create({
      order: orderId,
      amount: order.totalPrice,
      status: 'success',
    });

    // Update order payment status
    order.paymentStatus = 'success';
    order.paidAt = new Date(); // optional but professional
    await order.save();

    // 📧 Send Payment Receipt Email (PDF attached)
    if (order.user && order.user.email) {
      await sendPaymentReceiptEmail(order.user.email, order);
    }

    return res.json({
      success: true,
      message: 'Payment successful',
      data: payment,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { makePayment };