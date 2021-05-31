const mongoose = require('mongoose');

const OrderRequestSchema = new mongoose.Schema({
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
      }
    }
  ],
  paymentMethod: {
    type: String
  },
  paymentTerms: {
    type: String
  },
  shipToAddress: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = OrderRequest = mongoose.model(
  'orderRequest',
  OrderRequestSchema
);
