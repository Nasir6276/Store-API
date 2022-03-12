require('dotenv').config('')
require('express-async-errors')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

// middleware
app.use(express.json())

// routes
app.get('/', function(req, res) {
    res.send('<h1>Toptech API</h1><a href="/api/v1/products">Products route</a>')
})

app.use('/api/v1/products', productsRouter)

// products routes

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async function() {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is running on port ${port}...`))
    } catch (error) {
        console.log(error);
    }
}

start()