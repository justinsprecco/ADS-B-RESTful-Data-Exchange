const { getMessages } = require("../models/messageModel")

exports.getMessages = async (req, res) =>
{
   try
   {
      const messages = await getMessages()
      res.status(200).json(messages)
   }
   catch (err) 
   {
      res.status(500).send("Error fetching messages: " + err)
   }
}
