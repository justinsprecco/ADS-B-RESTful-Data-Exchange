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

router.get("/:id/devices/:deviceid", getDevice)

router.delete("/:id/devices/:deviceid", deleteDevice)

router.put("/:id/devices/:deviceid", updateDevice)

module.exports = router
