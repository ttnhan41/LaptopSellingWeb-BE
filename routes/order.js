const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { getAllOrders, getOrder, getCurrentUserOrders, createOrderCOD, createOrderStripe, createPaymentIntent, updateOrderStatus } = require('../controllers/order')

router.route('/').get(authenticateUser, getAllOrders)
router.route('/createPaymentIntent').post(authenticateUser, createPaymentIntent)
router.route('/createOrderCOD').post(authenticateUser, createOrderCOD)
router.route('/createOrderStripe').post(authenticateUser, createOrderStripe)
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)
router.route('/updateOrderStatus').patch(authenticateUser, updateOrderStatus)
router.route('/:id').get(authenticateUser, getOrder)

module.exports = router