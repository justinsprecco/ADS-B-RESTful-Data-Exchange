require("dotenv").config({ path: "dev.env" })

const PORT = process.env.PORT || 3000
const USER_SOCKET_PORT = process.env.USER_SOCKET_PORT || 3003
const USER_PROXY = process.env.USER_PROXY
const AUTH_PROXY = process.env.AUTH_PROXY
const DB_URI =
   process.env.DB_URI ||
   `postgresql://${process.env.ADSDB_USER}:${process.env.ADSDB_PASSWORD}@${process.env.ADSDB_HOST}:${process.env.ADSDB_PORT}/${process.env.ADSDB_DB}`

module.exports = { PORT, DB_URI, USER_SOCKET_PORT, USER_PROXY, AUTH_PROXY }
