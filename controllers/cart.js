const Cart = require('../models/Cart')
const Laptop = require('../models/Laptop')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const addItemToCart = async (req, res) => {
  const { productId } = req.body

  const dbProduct = await Laptop.findOne({ _id: productId })
  if (!dbProduct) {
    throw new NotFoundError(`No item with id: ${productId}`)
  }
  const { name, price, saleOff, imageUrl, _id } = dbProduct
  const singleCartItem = {
    name,
    price,
    saleOff,
    imageUrl,
    product: _id,
  }

  let cart = await Cart.findOne({ user: req.user.userId })

  if (cart) {
    // Cart exists for user
    if (!cart.cartItems || cart.cartItems.length < 1) {
      cart.subtotal = 0
    }

    if (cart.cartItems.find((item) => item.product.toString() === productId.toString())) {
      throw new BadRequestError('This product is already in cart')
    }

    cart.cartItems.push({
      name: singleCartItem.name,
      price: singleCartItem.price,
      saleOff: singleCartItem.saleOff,
      imageUrl: singleCartItem.imageUrl,
      product: singleCartItem.product
    })
    cart.subtotal += singleCartItem.price - (singleCartItem.price * (singleCartItem.saleOff / 100))
    await cart.save()
    res.status(StatusCodes.CREATED).json({ cart })
  } else {
    // No cart for user, create new cart
    const currentPrice = singleCartItem.price - (singleCartItem.price * (singleCartItem.saleOff / 100))
    const newCart = await Cart.create({
      user: req.user.userId,
      cartItems: [singleCartItem],
      subtotal: currentPrice,
    })
    res.status(StatusCodes.CREATED).json({ newCart })
  }
}

const getCurrentUserCart = async (req, res) => {
  const cart = await Cart.find({ user: req.user.userId })
  res.status(StatusCodes.OK).json({ cart })
}

const deleteItemInCart = async (req, res) => {
  const { itemId } = req.body

  let cart = await Cart.findOne({ user: req.user.userId })

  if (!cart) {
    throw new NotFoundError('No cart found')
  }

  const itemIndex = cart.cartItems.findIndex((item) => item._id.toString() === itemId.toString())
  if (itemIndex === -1) {
    throw new NotFoundError(`No item with id: ${itemId}`)
  }
  // Delete item in cart
  const removedItem = cart.cartItems.splice(itemIndex, 1)[0]
  cart.subtotal -= removedItem.price - (removedItem.price * (removedItem.saleOff / 100))

  const updatedCart = await cart.save()
  res.status(StatusCodes.OK).json({ updatedCart })
}

module.exports = {
  addItemToCart,
  getCurrentUserCart,
  deleteItemInCart,
}