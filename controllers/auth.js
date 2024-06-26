const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const { email, password } = req.body
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError('Email đã tồn tại')
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const user = await User.create({ email, password, role })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ token })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Hãy cung cấp email và mật khẩu')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Email không tồn tại')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Mật khẩu không đúng')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ token })
}

module.exports = {
  register,
  login,
}