const userRoutes = require("./userRoutes")
const deviceRoutes = require("./deviceRoutes")

module.exports = {
   ...userRoutes,
   ...deviceRoutes,
}
