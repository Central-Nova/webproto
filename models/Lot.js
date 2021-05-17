const mongoose = require('mongoose');

const LotSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  lotCode: {
    type: String,
    required: true
  },
  sku: {
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
