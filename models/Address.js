const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Address', AddressSchema)