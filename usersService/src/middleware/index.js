const cors = require("cors")
const authMiddleware = require("./authMiddleware")
const validationMiddleware = require("./validationMiddleware")

// Error handling middleware for server errors
function errorHandler(err, req, res, next) 
{
   console.error(err.stack)
   res.status(500).send("Something went wrong!")
}

// 404 catch-all handler for handling undefined routes
function notFoundHandler(req, res) 
{
   console.log("Undefined route in user service")
   res.status(404).send("Could not find resource!")
}

module.exports = {
   ...authMiddleware,
   ...validationMiddleware,
   corsMiddleware: cors(),
   errorHandler,
   notFoundHandler,
}
