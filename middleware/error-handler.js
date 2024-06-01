const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ')
    customError.statusCode = 400
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Giá trị trùng lặp được nhập cho trường ${Object.keys(err.keyValue)}, hãy chọn giá trị khác`
    customError.statusCode = 400
  }

  if (err.name === 'CastError') {
    customError.msg = `Không tìm thấy item với id: ${err.value}`
    customError.statusCode = 404
  }
  
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
