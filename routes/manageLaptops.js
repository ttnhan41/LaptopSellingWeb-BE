const express = require('express')
const router = express.Router()

const { 
  createLaptop, 
  updateLaptop, 
  deleteLaptop, 
} = require('../controllers/laptops')

router.route('/').post(createLaptop)
router.route('/:id').delete(deleteLaptop).patch(updateLaptop)

module.exports = router