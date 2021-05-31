const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  sku: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  basePrice: {
    unit: {
      type: String,
      required: true
    },
    subUnit: {
      type: String,
      required: true
    },
    contains: {
      type: Number,
      required: true
    },
    price: {
      // price in cents
      type: Number,
      required: true
    },
  },
  priceRules: [
    {
      unit: String,
      quantity: Number,
      // price in cents
      price: Number
    }
  ],
  quantity: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  weight: String,
  color: String,
  primaryMaterial: String,
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'  
  },
  lastEdited: {
    type: Date,
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
});

module.exports = Product = mongoose.model('product', ProductSchema);
