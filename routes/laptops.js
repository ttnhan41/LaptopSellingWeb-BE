const express = require('express')
const router = express.Router()

const { 
  getAllLaptops, 
  getLaptop, 
  createLaptop, 
  updateLaptop, 
  deleteLaptop, 
} = require('../controllers/laptops')

router.route('/').post(createLaptop).get(getAllLaptops)
router.route('/:id').get(getLaptop).delete(deleteLaptop).patch(updateLaptop)

module.exports = router