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
    throw new NotFoundError(`Không có mã giảm giá với id: ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ coupon })
}

const addCoupon = async (req, res) => {
  const { name, amount, code, expiredDate } = req.body
  if (!name) {
    throw new BadRequestError('Hãy cung cấp tên')
  }
  else if (!amount) {
    throw new BadRequestError('Hãy cung cấp số tiền giảm')
  }
  else if (!code) {
    throw new BadRequestError('Hãy cung cấp mã')
  }
  else if (!expiredDate) {
    throw new BadRequestError('Hãy cung cấp ngày hết hạn')
  }
  
  const couponCodeAlreadyExists = await Coupon.findOne({ code })
  if (couponCodeAlreadyExists) {
    throw new BadRequestError('Mã giảm giá đã tồn tại')
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
    throw new BadRequestError('Tên không được để trống')
  }
  else if (amount === '') {
    throw new BadRequestError('Số tiền giảm không được để trống')
  }
  else if (code === '') {
    throw new BadRequestError('Mã không được để trống')
  }
  else if (expiredDate === '') {
    throw new BadRequestError('Ngày hết hạn không được để trống')
  }
  const coupon = await Coupon.findOne({ _id: couponId })
  if (!coupon) {
    throw new NotFoundError(`Không có mã giảm giá với id: ${couponId}`)
  }
  const couponCodeAlreadyExists = await Coupon.findOne({ code })
  if (coupon.code !== code && couponCodeAlreadyExists) {
    throw new BadRequestError('Mã giảm giá đã tồn tại')
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
    throw new NotFoundError(`Không có mã giảm giá với id ${couponId}`)
  }
  res.status(StatusCodes.OK).send()
}

const addCouponToCart = async (req, res) => {
  const { code } = req.body
  const coupon = await Coupon.findOne({ code })
  if (!coupon) {
    throw new NotFoundError('Không tìm thấy mã giảm giá')
  }
  if (coupon.expiredDate < Date.now()) {
    throw new BadRequestError('Mã giảm giá đã hết hạn')
  }

  let cart = await Cart.findOne({ user: req.user.userId })
  if (!cart) {
    throw new NotFoundError('Không tìm thấy giỏ hàng')
  }
  if (!cart.cartItems || cart.cartItems.length < 1) {
    throw new BadRequestError('Không có sản phẩm nào trong giỏ hàng')
  }

  if (cart.usedCoupons.find((couponId) => couponId.toString() === coupon._id.toString())) {
    throw new BadRequestError('Mã giảm giá đã được sử dụng 1 lần')
  }

  if (cart.subtotal < coupon.amount) {
    cart.subtotal = 0
  }
  else {
    cart.subtotal -= coupon.amount
  }

  cart.usedCoupons.push(coupon._id)
  await cart.save()
  res.status(StatusCodes.OK).json({ msg: 'Mã giảm giá đã được áp dụng thành công!' })
}

module.exports = {
  getAllCoupons,
  getCoupon,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  addCouponToCart,
}