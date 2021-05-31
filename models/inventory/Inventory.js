const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  lot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lot'
  },
  serial: {
    type: String
  },
  status: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  lastEdited: Date,
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
});

module.exports = Inventory = mongoose.model('inventory', InventorySchema);
