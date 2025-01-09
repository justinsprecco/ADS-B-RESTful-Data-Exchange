const { ADSMessage, RadarMessage } = require("../models/messageModel")

exports.getAllADSMessages = async (req, res) =>
{
   try
   {
      const messages = await ADSMessage.getAll()
      res.status(200).json(messages)
   }
   catch (err) 
   {
      res.status(500).send("Error fetching messages: " + err)
   }
}

exports.getLatestADSMessages = async (req, res) =>
{
   try
   {
      const messages = await ADSMessage.getLatest()
      res.status(200).json(messages)
   }
   catch (err) 
   {
      res.status(500).send("Error fetching messages: " + err)
   }
}

exports.getADSMessagesByTime = async (req, res) =>
{
   const { start, end } = req.body

   try
   {
      const messages = await ADSMessage.getByTime(start, end)
      res.status(200).json(messages)
   }
   catch (err) 
   {
      res.status(500).send("Error fetching messages: " + err)
   }
}

exports.getAllRadarMessages = async (req, res) =>
{
   try
   {
      const messages = await RadarMessage.getAll()
      res.status(200).json(messages)
   }
   catch (err) 
   {
      res.status(500).send("Error fetching messages: " + err)
   }
}

exports.getLatestRadarMessages = async (req, res) =>
{
   try
   {
      const messages = await RadarMessage.getLatest()
      res.status(200).json(messages)
   }
   catch (err) 
   {
      res.status(500).send("Error fetching messages: " + err)
   }
}

exports.getRadarMessagesByTime = async (req, res) =>
{
   const { start, end } = req.body

   try
   {
      const messages = await RadarMessage.getByTime(start, end)
      res.status(200).json(messages)
   }
   catch (err) 
   {
      res.status(500).send("Error fetching messages: " + err)
   }
}
