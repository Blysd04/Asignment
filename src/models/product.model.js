const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, required: true },
  sizes: [{ type: String, required: true }],
  colors: [{ type: String, required: true }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
