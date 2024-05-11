const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { addAddress, getAddress, getCurrentUserAddresses, updateAddress, deleteAddress } = require('../controllers/address')

router.route('/').post(authenticateUser, addAddress)
router.route('/showMyAddresses').get(authenticateUser, getCurrentUserAddresses)
router.route('/:id').get(authenticateUser, getAddress).patch(authenticateUser, updateAddress).delete(authenticateUser, deleteAddress)

module.exports = router