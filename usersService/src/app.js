const express = require("express")
const morgan = require("morgan")
const {
   corsMiddleware,
   errorHandler,
   requestLogger,
   notFoundHandler,
} = require("./middleware")
const userRoutes = require("./routes/userRoutes")
const deviceRoutes = require("./routes/deviceRoutes")
const { NODE_ENV } = require("./config")

const app = express()

// Middleware Setup
app.use(corsMiddleware)
app.use(express.json())

// Logging Middleware
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"))

// Route Setup
app.use("/users", userRoutes)
app.use("/users", deviceRoutes)

// Error Handling Middleware
app.use(errorHandler)

// 404 Catchall
app.use(notFoundHandler)

module.exports = app
