const stateVectorDecoder = require("./stateVectorDecoder")
const { stateVectorParser } = require("../parsers")

module.exports = (message) =>
{
   const reportType = parseInt(message.slice(0, 4), 2)

   let parsedMessage, decodedMessage

   switch (reportType)
   {
   case 1:
      parsedMessage = stateVectorParser(message)
      decodedMessage = stateVectorDecoder(parsedMessage)
      break
   case 2: break
   }

   console.log(`Decoded Message: ${JSON.stringify(decodedMessage)}`)

   return decodedMessage
}
