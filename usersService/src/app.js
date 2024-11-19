const express = require("express")
const path = require('path')
const morgan = require("morgan")
const swaggerUi = require("swagger-ui-express")
const { readFileSync } = require("fs")
const { parse } = require('yaml')
const {
   corsMiddleware,
   errorHandler,
   requestLogger,
   notFoundHandler,
} = require("./middleware")
const userRoutes = require("./routes/userRoutes")
const deviceRoutes = require("./routes/deviceRoutes")
const { NODE_ENV } = require("./config")
const apiDoc = readFileSync(path.join(__dirname, "../docs/openapi.yaml"), 'utf8')

const app = express()

// Middleware Setup
app.use(corsMiddleware)
app.use(express.json())

// Swagger Middleware
app.use("/api", swaggerUi.serve, swaggerUi.setup(parse(apiDoc)))

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
