const Device = require("../models/Device.js")

// post "/users/:id/devices"
// input a new device tied to user id
exports.postDevice = async (req, res) =>
{
   try
   {
      const userId = parseInt(req.params.id, 10)
      const { macAddress, latitude, longitude } = req.body

      // NOTE: should get macAddress / identifier from somewhere else???

      const device = await Device.create(userId, macAddress, latitude, longitude)

      return res.status(201).json({ message: `Device ${device.macAddress} added with id ${device._id} and associated with user ${device.userId}` })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: device registration failed" + err })
   }
}

// get "/users/:id/devices"
// get all devices from a user given query
exports.getDevices = async (req, res) =>
{
   try
   {
      const userId = parseInt(req.params.id)

      const { devices } = await Device.getByUserId(userId)

      if (!devices.length)
      {
         return res.status(404).json({ message: "No devices found for this user." })
      }

      return res.status(200).json({ message: devices })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: failed to get devices" + err })
   }
}

// get "/users/:id/devices/:deviceid"
// get device information given a device ID and user ID
exports.getDevice = async (req, res) =>
{
   try
   {
      const deviceId = parseInt(req.params.deviceid)

      const { device } = await Device.getById(deviceId)

      if (!device)
      {
         return res.status(404).json({ message: `No device found with id ${deviceId}.` })
      }

      return res.status(200).json({ message: device })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: failed getting device" + err })
   }
}

// delete "/users/:id/devices/:deviceid"
// delete a device tied to a specific user
exports.deleteDevice = async (req, res) =>
{
   try
   {
      const deviceId = parseInt(req.params.deviceid)

      const { device } = await Device.delete(deviceId)

      if (!device)
      {
         return res.status(404).json({ message: `No device found with id ${deviceId}.` })
      }

      return res.status(200).json({ message: `Device ${deviceId} deleted successfully.` })
   }
   catch (err)
   {
      return res.status(500).json({ message: `Error: Unable to delete device.` + err })
   }
}

// put "/users/:id/devices/:deviceid"
// update a device tied to a specific user
exports.updateDevice = async (req, res) =>
{
   try
   {
      const deviceId = parseInt(req.params.deviceid)
      const { latitude, longitude } = req.body

      if (latitude == undefined && longitude == undefined)
      {
         return res.status(402).json({ message: "Include latitude or longitude in body to update" })
      }

      const { device } = await Device.update(deviceId, latitude, longitude)

      if (!device)
      {
         return res.status(404).json({ message: `No device found with id ${deviceId}.` })
      }

      return res.status(200).json({ message: `Device ${deviceId} updated successfully.` })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: Unable to update device." + err })
   }
}
