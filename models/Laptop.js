const mongoose = require('mongoose')

const LaptopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'Please provide laptop name'],
    },
    price: {
      type: Number,
      require: [true, 'Please provide laptop price'],
    },
    status: {
      type: String,
      default: 'New 100%, Fullbox',
    },
    cpu: {
      type: String,
      require: [true, 'Please provide CPU infomation'],
    },
    ram: {
      type: String,
      require: [true, 'Please provide RAM infomation'],
    },
    hardDisk: {
      type: String,
      require: [true, 'Please provide hard disk infomation'],
    },
    graphicCard: {
      type: String,
      require: [true, 'Please provide graphic card infomation'],
    },
    screen: {
      type: String,
      require: [true, 'Please provide screen infomation'],
    },
    connectionPort: {
      type: String,
      require: [true, 'Please provide connection port infomation'],
    },
    keyboard: {
      type: String,
      require: [true, 'Please provide keyboard infomation'],
    },
    audio: {
      type: String,
      require: [true, 'Please provide audio infomation'],
    },
    lan: {
      type: String,
      require: [true, 'Please provide LAN infomation'],
    },
    wirelessLan: {
      type: String,
      require: [true, 'Please provide wireless LAN infomation'],
    },
    webcam: {
      type: String,
      require: [true, 'Please provide webcam infomation'],
    },
    os: {
      type: String,
      require: [true, 'Please provide OS infomation'],
    },
    battery: {
      type: String,
      require: [true, 'Please provide battery infomation'],
    },
    weight: {
      type: String,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    imageUrl: {
      type: String,
      require: [true, 'Please provide image URL'],
    },
  }, 
  { timestamps: true }
)

module.exports = mongoose.model('Laptop', LaptopSchema)