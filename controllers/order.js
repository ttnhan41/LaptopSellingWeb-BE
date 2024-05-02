const Order = require('../models/Order')
const Laptop = require('../models/Laptop')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue'
  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('No cart items provided')
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError('Please provide tax and shipping fee')
  }

  let orderItems = []
  let subtotal = 0
  for (const item of cartItems) {
    const dbProduct = await Laptop.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new NotFoundError(`No item with id: ${item.product}`)
    }
    const { name, price, imageUrl, _id } = dbProduct
    const singleOrderItem = {
      name,
      price,
      imageUrl,
      product: _id,
    }
    // Add item to order
    orderItems = [...orderItems, singleOrderItem]
    subtotal += price
  }
  const total = tax + shippingFee + subtotal
  
  // Get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'vnd',
  })

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  })
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