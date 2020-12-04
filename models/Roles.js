const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  department: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true

  },
  role: {
    type: String,
    required: true
  },
  permissions: [
    {
      action: {
      type: String,
      required: true,
    },
    allow: {
      type: Boolean,
      required: true
    }}
  ]

})

module.exports = Role = new mongoose.model('role', RoleSchema);