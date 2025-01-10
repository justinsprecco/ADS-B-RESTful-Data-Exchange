const cors = require("cors")
const validationMiddleware = require("./validationMiddleware")

const corsMiddleware = cors({
   origin: "*",
   methods: ["GET", "PUT", "POST", "DELETE"],
   allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "x-auth"],
   exposedHeaders: ["x-auth"]
})

// Error handling middleware for server errors
function errorHandler(err, req, res, next)
{
   console.error(err.stack)
   res.status(500).json({ message: "Something went wrong!" })
}

// 404 catch-all handler for handling undefined routes
function notFoundHandler(req, res)
{
   console.log("Undefined route in auth service")
   res.status(404).json({ message: "Could not find resource!" })
}

module.exports = {
   ...validationMiddleware,
   corsMiddleware,
   errorHandler,
   notFoundHandler,
}
