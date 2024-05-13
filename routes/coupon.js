const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { getAllCoupons, getCoupon, addCoupon, updateCoupon, deleteCoupon, addCouponToCart } = require('../controllers/coupon')

router.route('/').post(authenticateUser, addCoupon).get(authenticateUser, getAllCoupons)
router.route('/addCouponToCart').post(authenticateUser, addCouponToCart)
router.route('/:id').get(authenticateUser, getCoupon).patch(authenticateUser, updateCoupon).delete(authenticateUser, deleteCoupon)

module.exports = router