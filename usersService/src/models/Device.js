const { Schema, model, startSession } = require("mongoose")
const User = require("./User")

/*
Groundstation schema relies on the client to have its _id field match up
with the groundstationID key from the messageADBSSchema and
messageRadarSchema.

Groundstation schema also relies on the client to have its userID field
match up with userSchema's _id field.

A user can have many groundstations but a groundstation can only have one
user.
*/
const groundstationSchema = new Schema(
   {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      macAddress: { type: String, unique: true, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
   })

groundstationSchema.statics.create = async function(userId, macAddress, latitude, longitude)
{
   const existingDevice = await this.findOne({ macAddress })
   if (existingDevice) throw new Error("Device already exists")

   const device = new this({ userId, macAddress, latitude, longitude })
   await device.save()

   return { device }
}

groundstationSchema.statics.getByUserId = async function(userId)
{
   const devices = await this.find({ userId })

   if (!devices.length) throw new Error("No devices found for this user")

   return { devices }
}

groundstationSchema.statics.getById = async function(deviceId)
{
   const device = await this.findById(deviceId)
   if (!device) throw new Error("Device not found")
   return { device }
}

groundstationSchema.statics.delete = async function(deviceId)
{
   const session = await startSession()

   try
   {
      session.startTransaction()
      const device = await this.findByIdAndDelete(deviceId)
      if (!device) throw new Error("Device not found")

      await User.updateOne({ devices: deviceId }, { $pull: { devices: deviceId } }).session(session)

      await session.commitTransaction()
      return { deviceId: device._id }
   }
   catch (error)
   {
      await session.abortTransaction()
      throw error
   }
   finally
   {
      session.endSession()
   }
}

groundstationSchema.statics.update = async function(userId, deviceId, latitude, longitude)
{
   const device = await this.findById(deviceId)
   if (!device) throw new Error("Device not found")

   if (!latitude && !longitude) throw new Error("Latitude and/or longitude not provided")

   if (latitude !== undefined) device.latitude = latitude
   if (longitude !== undefined) device.longitude = longitude

   await device.save()

   return { device }
}

const Device = model("Device", groundstationSchema)

module.exports = Device
