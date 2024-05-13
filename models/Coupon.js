const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiredDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Coupon', CouponSchema)