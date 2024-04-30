const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { getAllUsers, getUser, updateUser, updateUserPassword } = require('../controllers/user')

router.route('/').get(authenticateUser, getAllUsers)
router.route('/:id').get(authenticateUser, getUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

module.exports = router