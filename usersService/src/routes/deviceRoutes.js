/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management
 */

const express = require("express")
const router = express.Router()

const {
   postDevice,
   getDevices,
   getDevice,
   deleteDevice,
   updateDevice,
} = require("../controllers")

/**
 * @swagger
 * /users/{id}/devices:
 *   post:
 *     summary: Add a new device
 *     description: Registers a new device and returns the created device ID.
 *     tags:
 *       - Devices
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               macAddress:
 *                 type: string
 *                 example: 01:a2:b3:c4:d5:e6
 *                 description: The mac address of the device.
 *               latitude:
 *                 type: float
 *                 example: 38.8951
 *                 description: The latitude where the device is located.
 *               longitude:
 *                 type: float
 *                 example: -77.0364
 *                 description: The longitude where the device is located.
 *     responses:
 *       201:
 *         description: Device added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Device 01:a2:b3:c4:d5:e6 added with id 1 and associated with user 1"
 *       500:
 *         description: Error during device registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Error: Device registration failed"
 */
router.post("/:id/devices", postDevice)

router.get("/:id/devices", getDevices)

router.get("/:id/devices/:deviceid", getDevice)

router.delete("/:id/devices/:deviceid", deleteDevice)

router.put("/:id/devices/:deviceid", updateDevice)

module.exports = router
