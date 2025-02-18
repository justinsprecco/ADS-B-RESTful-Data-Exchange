const express = require("express")
const router = express.Router()

const { verifyAccessToken } = require("../middleware")

const {
   postDevice,
   getDevices,
   getDevice,
   findDevice,
   deleteDevice,
   updateDevice,
} = require("../controllers")

router.post("/:id/devices", verifyAccessToken, postDevice)

router.get("/:id/devices", verifyAccessToken, getDevices)

router.get("/:id/devices/:deviceId", verifyAccessToken, getDevice)

router.get("/devices/:macAddress", verifyAccessToken, findDevice)

router.delete("/:id/devices/:deviceId", verifyAccessToken, deleteDevice)

router.put("/:id/devices/:deviceId", verifyAccessToken, updateDevice)

module.exports = router
