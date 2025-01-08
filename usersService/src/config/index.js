require("dotenv").config({ path: "dev.env" })

exports.NODE_ENV = process.env.NODE_ENV
exports.PORT = process.env.PORT || 3001
exports.AUTH_URI = process.env.AUTH_URI
exports.AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET
exports.DB_URI =
   process.env.DB_URI ||
   `postgresql://${process.env.ADSDB_USER}:${process.env.ADSDB_PASSWORD}@${process.env.ADSDB_HOST}:${process.env.ADSDB_PORT}/${process.env.ADSDB_DB}`
