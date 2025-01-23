require("dotenv").config({ path: "dev.env" })

exports.NODE_ENV = process.env.NODE_ENV
exports.PORT = process.env.PORT || 3000
exports.USER_SOCKET_PORT = process.env.USER_SOCKET_PORT || 3003
exports.USER_PROXY = process.env.USER_PROXY
exports.AUTH_PROXY = process.env.AUTH_PROXY
exports.DB_URI = process.env.DB_URI
