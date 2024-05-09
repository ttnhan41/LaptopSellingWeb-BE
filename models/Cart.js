const mongoose = require('mongoose')

const SingleCartItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Laptop',
      required: true,
    },
  }
)

const CartSchema = new mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
    },
    cartItems: [SingleCartItemSchema],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  }
)

module.exports = mongoose.model('Cart', CartSchema)