const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users, count: users.length })
}

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user with id: ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user with id: ${req.user.userId}`)
  }
  res.status(StatusCodes.OK).json({ user })
}

const updateUser = async (req, res) => {
  const { fullName, email, phoneNumber } = req.body
  const user = await User.findOne({ _id: req.user.userId })
  if (fullName) {
    user.fullName = fullName
  }
  if (email) {
    user.email = email
  }
  if (phoneNumber) {
    user.phoneNumber = phoneNumber
  }
  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token,
    },
  })
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both old password and new password')
  }
  const user = await User.findOne({ _id: req.user.userId })
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Old password is incorrect')
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Password has been changed successfully!' })
}

module.exports = {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}