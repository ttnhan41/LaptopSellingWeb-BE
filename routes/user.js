const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { getAllUsers, getUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/user')

router.route('/').get(authenticateUser, getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/:id').get(authenticateUser, getUser)

module.exports = router