const Order = require('../models/Order')
const Cart = require('../models/Cart')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue'
  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  let { tax, shippingFee } = req.body
  if (!tax) {
    tax = 0
  }
  if (!shippingFee) {
    shippingFee = 0
  }

  let cart = await Cart.findOne({ user: req.user.userId })

  if (!cart) {
    throw new NotFoundError('No cart found')
  }
  if (!cart.cartItems || cart.cartItems.length < 1) {
    throw new BadRequestError('No items in cart')
  }

  const total = tax + shippingFee + cart.subtotal
  
  // Get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'vnd',
  })

  // Create order
  const order = await Order.create({
    orderItems: cart.cartItems,
    total,
    subtotal: cart.subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  })

  // Reset cart after creating order
  cart.cartItems = []
  cart.subtotal = 0
  await cart.save()

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret })
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`No order with id: ${orderId}`)
  }
  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`No order with id: ${orderId}`)
  }
  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  getCurrentUserOrders,
  updateOrder,
}