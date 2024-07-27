const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  total_price: { type: Number, required: true },
  status: { type: Number, required: true, default: 0 },
  created_at: { type: Date, default: Date.now },
  shippingAddress: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Order', OrderSchema);
