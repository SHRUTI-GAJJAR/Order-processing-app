const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');
const nodemailer = require('nodemailer');
const logger = require('../middlewares/logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// registration email
const sendRegisterEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"FastOrder API" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to FastOrder 🎉',
      // text: `Hello ${name}, your account has been successfully registered!`,
      html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <div style="background: #2563eb; padding: 20px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0;">Welcome to FastOrder 🎉</h1>
    </div>

    <div style="padding: 30px; color: #333;">
      <h2 style="margin-top: 0;">Hi ${name},</h2>
      <p>Your account has been successfully created. We're excited to have you onboard!</p>

      <p>With FastOrder, you can:</p>
      <ul style="padding-left: 20px;">
        <li>✔ Browse products easily</li>
        <li>✔ Place secure orders</li>
        <li>✔ Track your order status</li>
        <li>✔ Request cancellations/refunds</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="background: #2563eb; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
          Start Shopping
        </a>
      </div>

      <p style="font-size: 14px; color: #777;">If you have any questions, feel free to contact us.</p>
    </div>

    <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
      © 2026 FastOrder. All rights reserved.
    </div>

  </div>
</div>
`
    });
    logger.info(`Registration email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send registration email: ${error.message}`);
  }
};

// -------------------
// New Order Emails
// -------------------

// Order created
const sendOrderCreatedEmail = async (to, productName) => {
  try {
    await transporter.sendMail({
      from: `"FastOrder API" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Order Placed Successfully',
      text: `Your order for ${productName} has been placed.`,
      html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
    
    <div style="background: #16a34a; padding: 20px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0;">Order Placed Successfully ✅</h1>
    </div>

    <div style="padding: 30px; color: #333;">
      <h2 style="margin-top: 0;">Thank You for Your Order!</h2>

      <p>Your order for <strong>${productName}</strong> has been placed successfully.</p>

      <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin-top: 20px;">
        <h3 style="margin-top: 0;">Cancellation & Refund Policy</h3>
        <ul style="padding-left: 20px;">
          <li>Unpaid orders can be cancelled before admin acceptance.</li>
          <li>Paid Orders:</li>
          <li style="margin-left: 15px;">• Within 24h → 10% deduction</li>
          <li style="margin-left: 15px;">• 24–48h → 75% deduction</li>
          <li style="margin-left: 15px;">• After 48h → Cancellation not allowed</li>
        </ul>
      </div>

      <p style="margin-top: 25px;">We will notify you once the admin reviews your order.</p>
    </div>

    <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
      FastOrder Team 🚀
    </div>

  </div>
</div>
`   });
    logger.info(`Order created email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send order created email: ${error.message}`);
  }
};

// Order accepted by admin
const sendOrderAcceptedEmail = async (to, productName) => {
  try {
    await transporter.sendMail({
      from: `"FastOrder API" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Order Accepted',
      text: `Your order for ${productName} has been accepted by admin.`,
      html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
    
    <div style="background: #2563eb; padding: 20px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0;">Order Accepted 🎉</h1>
    </div>

    <div style="padding: 30px; color: #333;">
      <p>Your order for <strong>${productName}</strong> has been accepted by our admin.</p>
      <p>We are now preparing it for further processing.</p>
      <p>You’ll receive another update soon.</p>
    </div>

    <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
      Thank you for choosing FastOrder ❤️
    </div>

  </div>
</div>
`
    });
    logger.info(`Order accepted email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send order accepted email: ${error.message}`);
  }
};

// Order cancelled (unpaid)
const sendOrderCancelledEmail = async (to, productName) => {
  try {
    await transporter.sendMail({
      from: `"FastOrder API" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Order Cancelled',
      text: `Your order for ${productName} has been cancelled successfully.`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.05);">

          <div style="background:#dc2626; padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0;">Order Cancelled ❌</h1>
          </div>

          <div style="padding:30px; color:#333;">
            <p style="font-size:16px;">Your order for <strong>${productName}</strong> has been successfully cancelled.</p>

            <div style="background:#fef2f2; padding:15px; border-radius:6px; margin:20px 0;">
              <p style="margin:0; color:#b91c1c; font-weight:bold;">
                No charges were applied because this order was unpaid.
              </p>
            </div>

            <p style="margin-top:20px;">We hope to serve you again soon 😊</p>
          </div>

          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            FastOrder Team
          </div>

        </div>
      </div>
      `
    });
    logger.info(`Order cancelled email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send order cancelled email: ${error.message}`);
  }
};

// Order cancelled & refunded (paid)
const sendOrderRefundEmail = async (to, productName, refundAmount) => {
  try {
    await transporter.sendMail({
      from: `"FastOrder API" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Order Cancelled & Refunded',
      text: `Your order for ${productName} has been cancelled.
Refund amount: ${refundAmount}`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.05);">

          <div style="background:#f59e0b; padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0;">Refund Processed 💰</h1>
          </div>

          <div style="padding:30px; color:#333;">
            <p style="font-size:16px;">
              Your order for <strong>${productName}</strong> has been cancelled successfully.
            </p>

            <div style="background:#f9fafb; padding:25px; border-radius:8px; text-align:center; margin:25px 0; border:1px solid #e5e7eb;">
              <p style="margin:0; font-size:14px; color:#6b7280;">Refund Amount</p>
              <h1 style="margin:10px 0; color:#16a34a; font-size:32px;">${refundAmount}</h1>
            </div>

            <p>The refunded amount will be credited to your original payment method within <strong>3–5 business days</strong>.</p>

            <p style="margin-top:20px;">If you have any questions, feel free to contact our support team.</p>
          </div>

          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © 2026 FastOrder | Secure Transactions
          </div>

        </div>
      </div>
      `
    });
    logger.info(`Order refund email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send order refund email: ${error.message}`);
  }
};

// Function to generate PDF receipt for an order
const generateReceiptPDF = (order) => {
  return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
    const bufferStream = new streamBuffers.WritableStreamBuffer();

    doc.pipe(bufferStream);

    // =========================
    // HEADER
    // =========================
    doc
      .fontSize(22)
      .fillColor('#2563eb')
      .text('FastOrder', { align: 'left' });

    doc
      .fontSize(10)
      .fillColor('#555')
      .text('Secure Online Shopping Platform');

    doc.moveDown(2);

    // =========================
    // INVOICE TITLE
    // =========================
    doc
      .fontSize(18)
      .fillColor('#000')
      .text('PAYMENT RECEIPT', { align: 'center' });

    doc.moveDown();

    // =========================
    // ORDER INFO BOX
    // =========================
    doc
      .rect(50, doc.y, 500, 80)
      .stroke('#e5e7eb');

    doc.moveDown(1);

    doc
      .fontSize(12)
      .fillColor('#000')
      .text(`Order ID: ${order._id}`)
      .text(`Payment Date: ${new Date().toLocaleString()}`)
      .text(`Payment Status: SUCCESS`);

    doc.moveDown(2);

    // =========================
    // TABLE HEADER
    // =========================
      const tableTop = doc.y;

      doc
        .rect(50, tableTop, 500, 25)
        .fill('#2563eb');

      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .text('Product', 60, tableTop + 7)
        .text('Qty', 320, tableTop + 7)
        .text('Price', 380, tableTop + 7)
        .text('Total', 450, tableTop + 7);

      doc.moveDown(2);

      // =========================
      // TABLE ROW
      // =========================
      const rowTop = doc.y;

      doc
        .fillColor('#000')
        .fontSize(12)
        .text(order.product.name, 60, rowTop)
        .text(order.quantity.toString(), 320, rowTop)
        .text(`₹${(order.totalPrice / order.quantity).toFixed(2)}`, 380, rowTop)
        .text(`₹${order.totalPrice.toFixed(2)}`, 450, rowTop);

      doc.moveDown(3);

          // =========================
      // TOTAL BOX
      // =========================
      const totalTop = doc.y;

      doc
        .rect(300, totalTop, 250, 40)
        .fill('#f3f4f6');

      doc
        .fillColor('#000')
        .fontSize(14)
        .text('Total Paid:', 310, totalTop + 12);

      doc
        .fillColor('#16a34a')
        .fontSize(16)
        .text(`₹${order.totalPrice.toFixed(2)}`, 430, totalTop + 10);

      doc.moveDown(4);

    // =========================
    // FOOTER
    // =========================
    doc
      .fontSize(10)
      .fillColor('#777')
      .text('Thank you for shopping with FastOrder!', { align: 'center' });

    doc
      .text('For support contact: support@fastorder.com', {
        align: 'center',
      });

    doc.end();

    bufferStream.on('finish', () => {
      resolve(bufferStream.getContents());
    });

    bufferStream.on('error', reject);
  });
};

// Function to send payment receipt email with PDF attachment
const sendPaymentReceiptEmail = async (to, order) => {
  try {

    const pdfBuffer = await generateReceiptPDF(order);

    await transporter.sendMail({
      from: `"FastOrder API" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Payment Receipt - FastOrder',

      text: `Payment received. Please find attached receipt.`,

      html: `<h2>Payment Successful ✅</h2>
             <p>Your payment has been received.</p>
             <p>Receipt is attached as PDF.</p>`,

      attachments: [
        {
          filename: `receipt-${order._id}.pdf`,
          content: pdfBuffer
        }
      ]
    });

    logger.info(`Payment receipt sent to ${to}`);

  } catch (error) {
    logger.error(`Failed to send receipt: ${error.message}`);
  }
};

// =======================
// SEND OTP EMAIL
// =======================
const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"FastOrder API" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset OTP - FastOrder',
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Password Reset Request 🔐</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="color:#2563eb;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `
    });

    logger.info(`OTP email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send OTP email: ${error.message}`);
  }
};

module.exports = {
  sendRegisterEmail,
  sendOrderCreatedEmail,
  sendOrderAcceptedEmail,
  sendOrderCancelledEmail,
  sendOrderRefundEmail,
  generateReceiptPDF,
  sendPaymentReceiptEmail,
  sendOtpEmail
};