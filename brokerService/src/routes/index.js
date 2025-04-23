const express = require("express")
const proxy = require("express-http-proxy")
const {
   handleStream,
   getADSMessages,
   getLatestADSMessages,
   subscribe,
   unsubscribe,
} = require("../controllers")
const { USER_PROXY, AUTH_PROXY } = require("../config")

const router = express.Router()

// Proxy Routes
router.all("/users/*", proxy(USER_PROXY))
router.all("/auth/*", proxy(AUTH_PROXY))

// Message Routes
router.get("/message/ads", getADSMessages)
router.get("/message/ads/latest", getLatestADSMessages)

// Stream Routes
router.post("/users/:id/devices/:deviceid/stream", handleStream)

// Subscription Routes
router.post("/subscribe", subscribe)
router.post("/unsubscribe", unsubscribe)

module.exports = router
