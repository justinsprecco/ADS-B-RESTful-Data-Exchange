const { ADSMessage, RadarMessage } = require("../models/Message")

exports.getAllADSMessages = async (req, res) =>
{
   try
   {
      const { messages } = await ADSMessage.getAll()
      res.status(200).json({ messages })
   }
   catch (err)
   {
      const status = err.message === "No messages found" ? 404 : 500
      res.status(status).send({ message: err.message })
   }
}

exports.getLatestADSMessages = async (req, res) =>
{
   try
   {
      const { messages } = await ADSMessage.getLatest()
      res.status(200).json({ messages })
   }
   catch (err)
   {
      res.status(500).send({ message: err.message })
   }
}

exports.getADSMessagesByTime = async (req, res) =>
{
   const { start, end } = req.body

   try
   {
      const { messages } = await ADSMessage.getByTime(start, end)
      res.status(200).json({ messages })
   }
   catch (err)
   {
      res.status(500).send({ message: err.message })
   }
}
