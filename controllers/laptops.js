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
    throw new NotFoundError(`No laptop with id ${laptopId}`)
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
    throw new BadRequestError('Name field cannot be empty')
  }
  else if (price === '') {
    throw new BadRequestError('Price field cannot be empty')
  }
  else if (cpu === '') {
    throw new BadRequestError('CPU field cannot be empty')
  }
  else if (ram === '') {
    throw new BadRequestError('RAM field cannot be empty')
  }
  else if (hardDisk === '') {
    throw new BadRequestError('Hard disk field cannot be empty')
  }
  else if (graphicCard === '') {
    throw new BadRequestError('Graphic card field cannot be empty')
  }
  else if (screen === '') {
    throw new BadRequestError('Screen field cannot be empty')
  }
  else if (connectionPort === '') {
    throw new BadRequestError('Connection port field cannot be empty')
  }
  else if (keyboard === '') {
    throw new BadRequestError('Keyboard field cannot be empty')
  }
  else if (audio === '') {
    throw new BadRequestError('Audio field cannot be empty')
  }
  else if (lan === '') {
    throw new BadRequestError('LAN field cannot be empty')
  }
  else if (wirelessLan === '') {
    throw new BadRequestError('Wireless LAN field cannot be empty')
  }
  else if (webcam === '') {
    throw new BadRequestError('Webcam field cannot be empty')
  }
  else if (os === '') {
    throw new BadRequestError('OS field cannot be empty')
  }
  else if (battery === '') {
    throw new BadRequestError('Battery field cannot be empty')
  }
  else if (imageUrl === '') {
    throw new BadRequestError('Image URL field cannot be empty')
  }
  const laptop = await Laptop.findByIdAndUpdate(
    { _id: laptopId }, 
    req.body, 
    { new: true, runValidators: true }
  )
  if (!laptop) {
    throw new NotFoundError(`No laptop with id ${laptopId}`)
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
    throw new NotFoundError(`No laptop with id ${laptopId}`)
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