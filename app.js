require('dotenv').config()
require('express-async-errors')

// extra security packages
const helmet = require('helmet')
const cors = require('cors')

const express = require('express')
const app = express()

// connect db
const connectDB = require('./db/connect')

// authenticate
const authenticateUser = require('./middleware/authentication')

// routers
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const getLaptopsRouter = require('./routes/getLaptops') 
const manageLaptopsRouter = require('./routes/manageLaptops')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())
app.use(helmet())
app.use(cors())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/laptops', getLaptopsRouter)
app.use('/api/v1/laptops', authenticateUser, manageLaptopsRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console(error)
  }
}

start()