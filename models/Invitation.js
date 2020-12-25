const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  date: {
    type: Date,
    default: Date.now
  },
  code: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }

})

module.exports = Invitation = mongoose.model('invitation', InvitationSchema);
