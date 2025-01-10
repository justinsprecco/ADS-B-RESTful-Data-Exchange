const cors = require("cors")

// Error handling middleware for server errors
function errorHandler(err, req, res, next)
{
   console.error(err.stack)
   res.status(500).send("Something went wrong!")
}

// 404 catch-all handler for handling undefined routes
function notFoundHandler(req, res)
{
   console.log("Undefined route in broker service")
   res.status(404).send("Could not find resource!")
}

module.exports = {
   corsMiddleware: cors(),
   errorHandler,
   notFoundHandler,
}
