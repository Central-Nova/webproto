const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  totalQuantity: {
    type: Number
  },
  availableQuantity: {
    type: Number
  },
  outboundQuantity: {
    type: Number
  },
  inboundQuantity: {
    type: Number
  }
});

module.export = Inventory;
