const Device = require("../models/Device.js")

// post "/users/:id/devices"
// input a new device tied to user id
exports.postDevice = async (req, res) =>
{
   try
   {
      const id = parseInt(req.params.id)
      const { macAddress, latitude, longitude } = req.body

      // NOTE: should get macAddress / identifier from somewhere else???

      const device = await Device.postDevice(macAddress, latitude, longitude)

      return res.status(201).json({ message: `Device ${macAddress} added with id ${device.id} and associated with user ${id}` })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: device registration failed" + err })
   }
}

// get "/users/:id/devices?limit=<param>&start[< "l,g" + "e, ">]=<param>"
// get devices from a user given query
// Q: so this query will only be for a specific user?
exports.getDevices = async (req, res) =>
{
   try
   {
      const userId = parseInt(req.params.id)

      const devices = await Device.getDevices(userId)

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
      const userId = parseInt(req.params.id)
      const deviceid = parseInt(req.params.deviceid)

      const device = await Device.getDevice(userId, deviceId)

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
      const userId = parseInt(req.params.id)
      const deviceid = parseInt(req.params.deviceid)

      await Device.deleteDevice(userId, deviceId)

      return res.status(200).json({ message: `device ${deviceid} deleted.` })
   }
   catch (err)
   {
      return res.status(500).json({ message: `Error: Unable to delete device ${deviceid}.` + err })
   }
}

// put "/users/:id/devices/:deviceid"
// update a device tied to a specific user
exports.updateDevice = async (req, res) =>
{
   try
   {
      const userId = parseInt(req.params.id)
      const deviceid = parseInt(req.params.deviceid)
      const { latitude, longitude } = req.body

      const results = await Device.updateDevice(userId, deviceId, latitude, longitude)

      if (!results)
      {
         return res.status(402).json({ message: "Include latitude or longitude in body to update" })
      }

      return res.status(200).json({ message: `Device ${deviceid} updated.` })
   }
   catch (err)
   {
      return res.status(500).json({ message: "Error: Unable to update device." + err })
   }
}
