const Device = require("../models/Device")
const User = require("../models/User")

// post "/users/:id/devices"
// input a new device tied to user id
exports.postDevice = async (req, res) =>
{
   try
   {

      const userId = req.params.id
      const { macAddress, latitude, longitude } = req.body

      const { user } = await User.getById(userId)

      // NOTE: should get macAddress / identifier from somewhere else???

      const { device } = await Device.create(user._id, macAddress, latitude, longitude)

      return res.status(201).json({ message: `Device ${device.macAddress} added with id ${device._id} and associated with user ${device.userId}` })
   }
   catch (err)
   {
      const status = err.message === "User not found" ? 404 : err.message === "Device already exists" ? 409 : 500
      return res.status(status).json({ message: err.message })
   }
}

// get "/users/:id/devices"
// get all devices from a user given query
exports.getDevices = async (req, res) =>
{
   try
   {
      const userId = req.params.id

      const { user } = await User.getById(userId)

      const { devices } = await Device.getByUserId(userId)

      return res.status(200).json({ devices })
   }
   catch (err)
   {
      const status = err.message === "No devices found for this user" ? 404 : err.message === "User not found" ? 404 : 500
      return res.status(status).json({ message: err.message })
   }
}

// get "/users/:id/devices/:deviceid"
// get device information given a device ID and user ID
exports.getDevice = async (req, res) =>
{
   try
   {
      const { deviceId } = req.params

      const { device } = await Device.getById(deviceId)

      return res.status(200).json({ device })
   }
   catch (err)
   {
      const status = err.message === "Device not found" ? 404 : 500
      return res.status(status).json({ message: err.message })
   }
}

// delete "/users/:id/devices/:deviceid"
// delete a device tied to a specific user
exports.deleteDevice = async (req, res) =>
{
   try
   {
      const { deviceId } = req.params

      await Device.delete(deviceId)

      return res.status(200).json({ message: `Device ${deviceId} deleted successfully.` })
   }
   catch (err)
   {
      const status = err.message === "Device not found" ? 404 : 500
      return res.status(status).json({ message: err.message })
   }
}

// put "/users/:id/devices/:deviceid"
// update a device tied to a specific user
exports.updateDevice = async (req, res) =>
{
   try
   {
      const { deviceId } = req.params
      const { latitude, longitude } = req.body

      console.log(deviceId)
      const { device } = await Device.update(deviceId, latitude, longitude)

      return res.status(200).json({ message: `Device ${device._id} updated successfully.` })
   }
   catch (err)
   {
      const status = err.message === "Device not found" ? 404 : err.message === "Latitude and/or longitude not provided" ? 400 : 500
      return res.status(status).json({ message: err.message })
   }
}
