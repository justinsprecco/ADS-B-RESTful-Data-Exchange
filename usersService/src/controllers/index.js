const userController = require('./userController')
const deviceController = require('./deviceController')

module.exports = {
   ...userController,
   ...deviceController,
}
