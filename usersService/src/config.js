require("dotenv").config({ path: "dev.env" })

const PORT = process.env.PORT || 3001
const AUTH_URI = process.env.AUTH_URI
const DB_URI =
   process.env.DB_URI ||
   `postgresql://${process.env.ADSDB_USER}:${process.env.ADSDB_PASSWORD}@${process.env.ADSDB_HOST}:${process.env.ADSDB_PORT}/${process.env.ADSDB_DB}`

module.exports = { PORT, DB_URI, AUTH_URI }
