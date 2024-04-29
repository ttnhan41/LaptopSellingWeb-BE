const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ token })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ token })
}

const updateUser = async(req, res) => {
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

module.exports = {
  register,
  login,
  updateUser,
}