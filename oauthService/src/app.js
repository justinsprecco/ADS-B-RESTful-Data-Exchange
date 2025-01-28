const express = require("express")
const path = require('path')
const morgan = require("morgan")
const {
   corsMiddleware,
   errorHandler,
   requestLogger,
   notFoundHandler,
} = require("./middleware")
const routes = require("./routes")
const { NODE_ENV } = require("./config")

const app = express()

// Middleware Setup
app.use(corsMiddleware)
app.use(express.json())

// Logging Middleware
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"))

// Route Setup
app.use("/auth", routes)

// Error Handling Middleware
app.use(errorHandler)

// 404 Catchall
app.use(notFoundHandler)

module.exports = app
