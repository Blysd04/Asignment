const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is invalid email!`,
    },
  },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: {
    type: String, required: true, validate: {
      validator: function (v) {
        return /^\d{10,11}$/.test(v);
      },
      message: (props) =>
        `${props.value} is invalid phone!`,
    },
  },
  role: {
    type: Number,
    default: 1
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);
