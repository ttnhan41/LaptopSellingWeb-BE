const Laptop = require('../models/Laptop')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllLaptops = async (req, res) => {
  const laptops = await Laptop.find({}).sort('createdAt')
  res.status(StatusCodes.OK).json({ laptops, count: laptops.length })
}

const getLaptop = async (req, res) => {
  const {
    params: { id: laptopId },
  } = req
  const laptop = await Laptop.findOne({
    _id: laptopId,
  })
  if (!laptop) {
    throw new NotFoundError(`Không có laptop với id ${laptopId}`)
  }
  res.status(StatusCodes.OK).json({ laptop })
}

const createLaptop = async (req, res) => {
  const laptop = await Laptop.create(req.body)
  res.status(StatusCodes.CREATED).json({ laptop })
}

const updateLaptop = async (req, res) => {
  const {
    body: { name, price, saleOff, status, cpu, ram, hardDisk, graphicCard, screen, connectionPort, keyboard, audio, lan, wirelessLan, webcam, os, battery, weight, color, size, imageUrl },
    params: { id: laptopId },
  } = req

  if (name === '') {
    throw new BadRequestError('Tên không được để trống')
  }
  else if (price === '') {
    throw new BadRequestError('Giá không được để trống')
  }
  else if (cpu === '') {
    throw new BadRequestError('CPU không được để trống')
  }
  else if (ram === '') {
    throw new BadRequestError('RAM không được để trống')
  }
  else if (hardDisk === '') {
    throw new BadRequestError('Ổ cứng không được để trống')
  }
  else if (graphicCard === '') {
    throw new BadRequestError('Card đồ họa không được để trống')
  }
  else if (screen === '') {
    throw new BadRequestError('Màn hình không được để trống')
  }
  else if (connectionPort === '') {
    throw new BadRequestError('Cổng kết nối không được để trống')
  }
  else if (keyboard === '') {
    throw new BadRequestError('Bàn phím không được để trống')
  }
  else if (audio === '') {
    throw new BadRequestError('Audio không được để trống')
  }
  else if (lan === '') {
    throw new BadRequestError('LAN không được để trống')
  }
  else if (wirelessLan === '') {
    throw new BadRequestError('Wireless LAN không được để trống')
  }
  else if (webcam === '') {
    throw new BadRequestError('Webcam không được để trống')
  }
  else if (os === '') {
    throw new BadRequestError('OS không được để trống')
  }
  else if (battery === '') {
    throw new BadRequestError('Pin không được để trống')
  }
  else if (imageUrl === '') {
    throw new BadRequestError('Đường dẫn hình ảnh không được để trống')
  }
  const laptop = await Laptop.findByIdAndUpdate(
    { _id: laptopId }, 
    req.body, 
    { new: true, runValidators: true }
  )
  if (!laptop) {
    throw new NotFoundError(`Không có laptop với id ${laptopId}`)
  }
  res.status(StatusCodes.OK).json({ laptop })
}

const deleteLaptop = async (req, res) => {
  const {
    params: { id: laptopId },
  } = req

  const laptop = await Laptop.findOneAndDelete({
    _id: laptopId,
  })
  if (!laptop) {
    throw new NotFoundError(`Không có laptop với id ${laptopId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllLaptops,
  getLaptop,
  createLaptop,
  updateLaptop,
  deleteLaptop,
}