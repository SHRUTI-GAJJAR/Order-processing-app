const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'cancelled','refunded'], 
      default: 'pending',
    },
    paymentStatus: {
  type: String,
  enum: ['pending', 'success', 'failed', 'refunded'], // add refunded here
  default: 'pending',
},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);