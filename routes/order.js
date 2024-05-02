const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { createOrder, getAllOrders, getOrder, getCurrentUserOrders, updateOrder } = require('../controllers/order')

router.route('/').post(authenticateUser, createOrder).get(authenticateUser, getAllOrders)
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)
router.route('/:id').get(authenticateUser, getOrder).patch(authenticateUser, updateOrder)

module.exports = router