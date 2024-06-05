const Order = require('../models/Order')
const Cart = require('../models/Cart')
const User = require('../models/User')
const Address = require('../models/Address')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const createPaymentIntent = async (req, res) => {
  let { tax, shippingFee } = req.body
  if (!tax) {
    tax = 0
  }
  if (!shippingFee) {
    shippingFee = 0
  }

  let cart = await Cart.findOne({ user: req.user.userId })

  if (!cart) {
    throw new NotFoundError('Không tìm thấy giỏ hàng')
  }
  if (!cart.cartItems || cart.cartItems.length < 1) {
    throw new BadRequestError('Không có sản phẩm nào trong giỏ hàng')
  }

  const total = tax + shippingFee + cart.subtotal

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'vnd',
    automatic_payment_methods: { enabled: true },
  })

  res.status(StatusCodes.CREATED).json({ clientSecret: paymentIntent.client_secret })
} 

const createOrderStripe = async (req, res) => {
  let { tax, shippingFee, addressId, clientSecret, paymentIntentId } = req.body
  if (!addressId) {
    throw new BadRequestError('Hãy cung cấp ID địa chỉ')
  }
  if (!tax) {
    tax = 0
  }
  if (!shippingFee) {
    shippingFee = 0
  }

  let cart = await Cart.findOne({ user: req.user.userId })

  if (!cart) {
    throw new NotFoundError('Không tìm thấy giỏ hàng')
  }
  if (!cart.cartItems || cart.cartItems.length < 1) {
    throw new BadRequestError('Không có sản phẩm nào trong giỏ hàng')
  }

  const total = tax + shippingFee + cart.subtotal

  const address = await Address.findOne({ _id: addressId })
  if (!address) {
    throw new NotFoundError(`Không có địa chỉ với id: ${addressId}`)
  }
  const user = await User.findOne({ _id: req.user.userId })
  if (!user.address.find((address) => address.toString() === addressId.toString())) {
    throw new BadRequestError('Địa chỉ không nằm trong danh sách địa chỉ của người dùng')
  }
  const { recipientName, deliveryAddress, contactNumber } = address
  const singleAddress = {
    recipientName,
    deliveryAddress,
    contactNumber,
  }

  const status = 'paid'

  // Create order
  const order = await Order.create({
    orderItems: cart.cartItems,
    total,
    subtotal: cart.subtotal,
    tax,
    shippingFee,
    clientSecret,
    paymentIntentId,
    status,
    user: req.user.userId,
    address: singleAddress,
  })

  // Reset cart after creating order
  cart.cartItems = []
  cart.subtotal = 0
  await cart.save()

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret })
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user')
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`Không có đơn hàng với id: ${orderId}`)
  }
  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const createOrderCOD = async (req, res) => {
  let { tax, shippingFee, addressId } = req.body
  if (!addressId) {
    throw new BadRequestError('Hãy cung cấp ID địa chỉ')
  }
  if (!tax) {
    tax = 0
  }
  if (!shippingFee) {
    shippingFee = 0
  }

  let cart = await Cart.findOne({ user: req.user.userId })

  if (!cart) {
    throw new NotFoundError('Không tìm thấy giỏ hàng')
  }
  if (!cart.cartItems || cart.cartItems.length < 1) {
    throw new BadRequestError('Không có sản phẩm nào trong giỏ hàng')
  }

  const total = tax + shippingFee + cart.subtotal

  const address = await Address.findOne({ _id: addressId })
  if (!address) {
    throw new NotFoundError(`Không có địa chỉ với id: ${addressId}`)
  }
  const user = await User.findOne({ _id: req.user.userId })
  if (!user.address.find((address) => address.toString() === addressId.toString())) {
    throw new BadRequestError('Địa chỉ không nằm trong danh sách địa chỉ của người dùng')
  }
  const { recipientName, deliveryAddress, contactNumber } = address
  const singleAddress = {
    recipientName,
    deliveryAddress,
    contactNumber,
  }
  
  const clientSecret = 'None'

  // Create order
  const order = await Order.create({
    orderItems: cart.cartItems,
    total,
    subtotal: cart.subtotal,
    tax,
    shippingFee,
    clientSecret,
    user: req.user.userId,
    address: singleAddress,
  })

  // Reset cart after creating order
  cart.cartItems = []
  cart.subtotal = 0
  await cart.save()

  res.status(StatusCodes.CREATED).json({ order })
}

const updateOrderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`Không có đơn hàng với id: ${orderId}`)
  }
  order.status = orderStatus
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  createPaymentIntent,
  createOrderStripe,
  getAllOrders,
  getOrder,
  getCurrentUserOrders,
  createOrderCOD,
  updateOrderStatus,
}