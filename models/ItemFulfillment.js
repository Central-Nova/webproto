const mongoose = require('mongoose');

const ItemFulfillmentSchema = new mongoose.Schema({
  salesOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'salesOrder'
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
      picker: {
        type: String
      },
      pickingStatus: {
        type: Boolean
      },
      loader: {
        type: String
      },
      loadingStatus: {
        type: Boolean
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ItemFulfillment = mongoose.model(
  'itemFulfillment',
  ItemFulfillmentSchema
);
