const mongoose = require('mongoose');

const LotSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },  
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  lotCode: {
    type: String,
    required: true
  },
  dateExpiration: Date,
  dateManufacture: Date,
//   shipment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: shipment
//   },
//   invoice: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: invoice
//   },
  cost: {
      type: String,
      required: true
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

module.exports = Lot = mongoose.model('lot', LotSchema);
