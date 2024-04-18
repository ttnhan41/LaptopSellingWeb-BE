const express = require('express')
const router = express.Router()

const { 
  getAllLaptops, 
  getLaptop, 
} = require('../controllers/laptops')

router.route('/').get(getAllLaptops)
router.route('/:id').get(getLaptop)

module.exports = router