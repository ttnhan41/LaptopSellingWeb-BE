const { StatusCodes } = require('http-status-codes')

const configStripe = (req, res, next) => {
  res.status(StatusCodes.OK).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  })
}

module.exports = {
  configStripe,
}