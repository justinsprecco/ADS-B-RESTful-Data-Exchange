const { ADSMessage, RadarMessage } = require("../models/Message")

exports.getADSMessages = async (req, res) =>
{
   const { start, end } = req.query

   try
   {
      const { messages } =
      start && end
         ? await ADSMessage.getByTime(start, end)
         : await ADSMessage.getAll()

      res.status(200).json({ messages })
   }
   catch (err)
   {
      const status = err.message === "No messages found" ? 404 : 500
      res.status(status).json({ message: err.message })
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
