const User = require('../models/User')
const Address = require('../models/Address')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const addAddress = async (req, res) => {
  const { recipientName, deliveryAddress, contactNumber } = req.body
  if (!recipientName) {
    throw new BadRequestError('Please provide recipient name')
  }
  else if (!deliveryAddress) {
    throw new BadRequestError('Please provide delivery address')
  }
  else if (!contactNumber) {
    throw new BadRequestError('Please provide contact number')
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
    throw new NotFoundError(`No address with id: ${req.params.id}`)
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
    throw new BadRequestError('Recipient name field cannot be empty')
  }
  else if (deliveryAddress === '') {
    throw new BadRequestError('Delivery address field cannot be empty')
  }
  else if (contactNumber === '') {
    throw new BadRequestError('Contact number field cannot be empty')
  }
  const address = await Address.findOne({ _id: addressId })
  if (!address) {
    throw new NotFoundError(`No address with id: ${addressId}`)
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
    throw new NotFoundError(`No address with id ${addressId}`)
  }
  const user = await User.findOne({ _id: req.user.userId })
  const addressIndex = user.address.findIndex((address) => address.toString() === addressId.toString())
  if (addressIndex === -1) {
    throw new NotFoundError(`No address with id: ${addressId}`)
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