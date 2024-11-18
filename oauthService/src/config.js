require("dotenv").config({ path: "dev.env" })

const PORT = process.env.PORT || 3000
const AUTH_CODE_SECRET = process.env.AUTH_CODE_SECRET
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const DB_URI =
   process.env.DB_URI ||
   `postgresql://${process.env.ADSDB_USER}:${process.env.ADSDB_PASSWORD}@${process.env.ADSDB_HOST}:${process.env.ADSDB_PORT}/${process.env.ADSDB_DB}`

module.exports = { PORT, DB_URI, AUTH_CODE_SECRET, AUTH_TOKEN_SECRET, REFRESH_TOKEN_SECRET }
