const User = require('../models/User')
const Address = require('../models/Address')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const addAddress = async (req, res) => {
  const { recipientName, deliveryAddress, contactNumber } = req.body
  if (!recipientName) {
    throw new BadRequestError('Hãy cung cấp tên người nhận')
  }
  else if (!deliveryAddress) {
    throw new BadRequestError('Hãy cung cấp địa chỉ nhận hàng')
  }
  else if (!contactNumber) {
    throw new BadRequestError('Hãy cung cấp số liên lạc')
  }
  const user = await User.findOne({ _id: req.user.userId })
  const newAddress = await Address.create({
    recipientName,
    deliveryAddress,
    contactNumber,
  })
  user.address.push(newAddress._id)
  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      address: user.address,
      token,
    },
  })
}

const getAddress = async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id })
  if (!address) {
    throw new NotFoundError(`Không có địa chỉ với id: ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ address })
}

const getCurrentUserAddresses = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId })
  let addressPromises = user.address.map((addressId) => {
    return Address.findOne({ _id: addressId })
  })
  let addresses = await Promise.all(addressPromises)
  addresses = addresses.filter((address) => address !== null)
  res.status(StatusCodes.OK).json({ addresses })
}

const updateAddress = async (req, res) => {
  const { id: addressId } = req.params
  const { recipientName, deliveryAddress, contactNumber } = req.body
  if (recipientName === '') {
    throw new BadRequestError('Tên người nhận không được để trống')
  }
  else if (deliveryAddress === '') {
    throw new BadRequestError('Địa chỉ nhận hàng không được để trống')
  }
  else if (contactNumber === '') {
    throw new BadRequestError('Số liên lạc không được để trống')
  }
  const address = await Address.findOne({ _id: addressId })
  if (!address) {
    throw new NotFoundError(`Không có địa chỉ với id: ${addressId}`)
  }
  address.recipientName = recipientName
  address.deliveryAddress = deliveryAddress
  address.contactNumber = contactNumber
  await address.save()
  res.status(StatusCodes.OK).json({ address })
}

const deleteAddress = async (req, res) => {
  const { id: addressId } = req.params
  const address = await Address.findOneAndDelete({
    _id: addressId,
  })
  if (!address) {
    throw new NotFoundError(`Không có địa chỉ với id ${addressId}`)
  }
  const user = await User.findOne({ _id: req.user.userId })
  const addressIndex = user.address.findIndex((address) => address.toString() === addressId.toString())
  if (addressIndex === -1) {
    throw new NotFoundError(`Không có địa chỉ với id: ${addressId}`)
  }
  // Delete address in user address list
  user.address.splice(addressIndex, 1)

  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      address: user.address,
      token,
    },
  })
}

module.exports = {
  addAddress,
  getAddress,
  getCurrentUserAddresses,
  updateAddress,
  deleteAddress,
}