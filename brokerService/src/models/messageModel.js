const { Schema, model } = require("mongoose")

/*
The message schema stores the message contents along with the groundstation
ID that corresponds to the message.

A timestamp is given to the message so that it can be determined if the
message is over a week old and needs to be purged.
*/
const messageADSBSchema = new Schema(
   {
      data: {
         type: Buffer,
         required: true
      },
      groundstationID: {
         type: Number,
         required: true
      },
      timestamp: {
         type: Date,
         required: true
      }
   })

messageADSBSchema.statics.create = async function(data, groundstationID, timestamp)
{
   const message = new this({ data, groundstationID, timestamp })
   await message.save()

   return { message }
}

messageADSBSchema.statics.getAll = async function()
{
   const messages = await this.find({})
   return { messages }
}

messageADSBSchema.statics.getLatest = async function()
{
   const messages = await this.find()
      .sort({ timestamp: -1 })
      .limit(10)

   return { messages }
}

// Function to retrieve and display ADS-B messages within a specific time range
messageADSBSchema.statics.getByTime = async function(start, end)
{
   const messages = await this.find
   ({
      timestamp: { $gte: start, $lte: end }
   })
      .sort({ timestamp: -1 })

   return { messages }
}

/*
The message Radar schema stores the message contents along with the
groundstation ID that corresponds to the message.

A timestamp is given to the message so that it can be determined if the
message is over a week old and needs to be purged.
*/
const messageRadarSchema = new Schema(
   {
      data: {
         type: String,
         required: true
      },
      timestamp: {
         type: Date,
         default: Date.now
      },
      groundstationID: {
         type: Number,
         required: true
      }
   })

messageRadarSchema.statics.getAll = async function()
{
   const messages = await this.find()
   return { messages }
}

messageRadarSchema.statics.getLatest = async function()
{
   const messages = await this.find()
      .sort({ timestamp: -1 })
      .limit(10)

   return { messages }
}

messageRadarSchema.statics.getByTime = async function(start, end)
{
   const messages = await this.find
   ({
      timestamp: { $gte: start, $lte: end }
   })
      .sort({ timestamp: -1 })

   return { messages }
}

const ADSMessage = model("ADSMessage", messageADSBSchema)
const RadarMessage = model("RadarMessage", messageRadarSchema)

module.exports = { ADSMessage, RadarMessage }
