require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// connect db
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/auth')
const laptopsRouter = require('./routes/laptops')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/laptops', laptopsRouter)

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