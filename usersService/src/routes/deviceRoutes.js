const express = require("express")
const router = express.Router()

const {
   postDevice,
   getDevices,
   getDevice,
   deleteDevice,
   updateDevice,
} = require("../controllers")

router.post("/:id/devices", postDevice)

router.get("/:id/devices", getDevices)

router.get("/:id/devices/:deviceId", getDevice)

router.delete("/:id/devices/:deviceId", deleteDevice)

router.put("/:id/devices/:deviceId", updateDevice)

module.exports = router
