const mongoose = require('mongoose');

const SalesOrderSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refer: 'organization'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refer: 'organization'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    refer: 'user'
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refer: 'product'
      },
      quantity: {
        type: Number
      },
      price: {
        type: Number
      }
    }
  ],
  paymentMethod: {
    type: String
  },
  shipToAddress: {
    type: String
  },
  shipFromAddress: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  confirmedByBuyer: {
    type: Boolean,
    default: false
  },
  picked: {
    type: Boolean,
    default: false
  },
  delivered: {
    type: Boolean,
    default: false
  }
});

module.exports = SalesOrder = mongoose.model('salesOrder', SalesOrderSchema);
