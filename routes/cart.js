const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { addItemToCart, getCurrentUserCart, deleteItemInCart } = require('../controllers/cart')

router.route('/addItemToCart').post(authenticateUser, addItemToCart)
router.route('/showMyCart').get(authenticateUser, getCurrentUserCart)
router.route('/deleteItemInCart').delete(authenticateUser, deleteItemInCart)

module.exports = router