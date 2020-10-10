const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sku: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Product = mongoose.model('product', ProductSchema);
