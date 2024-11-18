const express = require('express')
const {
   corsMiddleware,
   errorHandler,
   requestLogger,
   notFoundHandler,
} = require("./middleware")
const userRoutes = require("./routes/userRoutes")
const deviceRoutes = require("./routes/deviceRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

// Middleware Setup
app.use(corsMiddleware)
app.use(express.json())

// Logging Middleware
app.use(requestLogger)

// Route Setup
app.use("/users", userRoutes)
app.use("/users", deviceRoutes)
app.use(authRoutes)

// Error Handling Middleware
app.use(errorHandler)

// 404 Catchall
app.use(notFoundHandler)

module.exports = app
