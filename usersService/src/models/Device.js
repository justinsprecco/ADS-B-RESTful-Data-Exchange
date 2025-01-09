const { Schema, model } = require("mongoose")

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
      macAddress: 
    {
       type: String,
       unique: true,
       required: true
    },
      latitude: {
         type: Number,
         required: true
      },
      longitude: {
         type: Number,
         required: true
      },
      userID: {
         type: Number,
         required: true
      }
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
   return { devices }
}

groundstationSchema.statics.getById = async function(userId, deviceId)
{
   const device = await this.findById(deviceId)
   return { device }
}

groundstationSchema.statics.delete = async function(deviceId)
{
   const device = await this.findByIdAndDelete(deviceId)
   if (!device) throw new Error("Device not found")

   return { device }
}

groundstationSchema.statics.update = async function(userId, deviceId, latitude, longitude)
{
   const updates = {}
   if (latitude !== undefined) updates.latitude = latitude
   if(longitude !== undefined) updates.longitude = longitude

   const device = await this.findByIdAndUpdate(deviceId, updates)
   if (!device) throw new Error("Device not found")

   return { device }
}

const Device = model("Device", groundstationSchema)

module.exports = Device
