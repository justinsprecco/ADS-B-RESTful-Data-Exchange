require("dotenv").config({ path: "dev.env" })

exports.NODE_ENV = process.env.NODE_ENV
exports.BROKER_SOCKET_SERV = process.env.BROKER_SOCKET_SERV
