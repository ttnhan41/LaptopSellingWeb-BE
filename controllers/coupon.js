const Coupon = require('../models/Coupon')
const Cart = require('../models/Cart')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find({}).sort({ expiredDate: -1 })
  res.status(StatusCodes.OK).json({ coupons, count: coupons.length })
}

const getCoupon = async (req, res) => {
  const coupon = await Coupon.findOne({ _id: req.params.id })
  if (!coupon) {
    throw new NotFoundError(`No coupon with id: ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ coupon })
}

const addCoupon = async (req, res) => {
  const { name, amount, code, expiredDate } = req.body
  if (!name) {
    throw new BadRequestError('Please provide name')
  }
  else if (!amount) {
    throw new BadRequestError('Please provide amount')
  }
  else if (!code) {
    throw new BadRequestError('Please provide code')
  }
  else if (!expiredDate) {
    throw new BadRequestError('Please provide expired date')
  }
  
  const couponCodeAlreadyExists = await Coupon.findOne({ code })
  if (couponCodeAlreadyExists) {
    throw new BadRequestError('This coupon code already exists')
  }

  const newCoupon = await Coupon.create({
    name,
    amount,
    code,
    expiredDate,
  })
  res.status(StatusCodes.CREATED).json({ newCoupon })
}

const updateCoupon = async (req, res) => {
  const { id: couponId } = req.params
  const { name, amount, code, expiredDate } = req.body
  if (name === '') {
    throw new BadRequestError('Name field cannot be empty')
  }
  else if (amount === '') {
    throw new BadRequestError('Sale off field cannot be empty')
  }
  else if (code === '') {
    throw new BadRequestError('Code field cannot be empty')
  }
  else if (expiredDate === '') {
    throw new BadRequestError('Expired date field cannot be empty')
  }
  const coupon = await Coupon.findOne({ _id: couponId })
  if (!coupon) {
    throw new NotFoundError(`No coupon with id: ${couponId}`)
  }
  const couponCodeAlreadyExists = await Coupon.findOne({ code })
  if (coupon.code !== code && couponCodeAlreadyExists) {
    throw new BadRequestError('This coupon code already exists')
  }
  coupon.name = name
  coupon.amount = amount
  coupon.code = code
  coupon.expiredDate = expiredDate
  await coupon.save()
  res.status(StatusCodes.OK).json({ coupon })
}

const deleteCoupon = async (req, res) => {
  const { id: couponId } = req.params
  const coupon = await Coupon.findOneAndDelete({
    _id: couponId,
  })
  if (!coupon) {
    throw new NotFoundError(`No coupon with id ${couponId}`)
  }
  res.status(StatusCodes.OK).send()
}

const addCouponToCart = async (req, res) => {
  const { code } = req.body
  const coupon = await Coupon.findOne({ code })
  if (!coupon) {
    throw new NotFoundError('No coupon found')
  }
  if (coupon.expiredDate < Date.now()) {
    throw new BadRequestError('Coupon is expired')
  }

  let cart = await Cart.findOne({ user: req.user.userId })
  if (!cart) {
    throw new NotFoundError('No cart found')
  }
  if (!cart.cartItems || cart.cartItems.length < 1) {
    throw new BadRequestError('No items in cart')
  }

  if (cart.usedCoupons.find((couponId) => couponId.toString() === coupon._id.toString())) {
    throw new BadRequestError('This coupon was already used')
  }

  if (cart.subtotal < coupon.amount) {
    cart.subtotal = 0
  }
  else {
    cart.subtotal -= coupon.amount
  }

  cart.usedCoupons.push(coupon._id)
  await cart.save()
  res.status(StatusCodes.OK).json({ msg: 'Coupon applied successfully!' })
}

module.exports = {
  getAllCoupons,
  getCoupon,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  addCouponToCart,
}