const express = require("express")
const {
   corsMiddleware,
   errorHandler,
   requestLogger,
   notFoundHandler,
} = require("./middleware")
const routes = require("./routes")

const app = express()

// Middleware Setup
app.use(corsMiddleware)
app.use(express.json())

// Logging Middleware
app.use(requestLogger)

// Error Handling Middleware
app.use(errorHandler)

// Route Setup
app.use("/", routes)

// 404 Catchall
app.use(notFoundHandler)

module.exports = app
