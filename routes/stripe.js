const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { configStripe } = require('../controllers/stripe')

router.route('/').get(authenticateUser, configStripe)

module.exports = router