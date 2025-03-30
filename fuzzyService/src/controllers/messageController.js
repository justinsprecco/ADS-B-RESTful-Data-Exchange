const fuzzyLogic = require("../services/fuzzyLogic")
const getRunway = require("../services/runwayFinder")
const stateVectorDecoder = require("../services/stateVectorDecoder")
const { stateVectorParser } = require("../parsers")
const { hexToBin } = require("../utils")

module.exports = async(ws, message) =>
{
   console.log('Received ADS-B message:', (message))

   const binMessage = hexToBin(message)

   const messageType = parseInt(binMessage.slice(8, 16), 2)
   const payload = binMessage.slice(32)

   // Only decoding state vectors
   if (messageType != 145)
      return

   const parsedMessage = stateVectorParser(payload)
   const decodedMessage = stateVectorDecoder(parsedMessage)

   console.log(`Decoded Message: ${JSON.stringify(decodedMessage)}`)

   if (!decodedMessage) return

   const hasLanded = await fuzzyLogic(decodedMessage)

   if (!hasLanded) return

   const runway = getRunway(decodedMessage)

   ws.send(JSON.stringify({
      landed: hasLanded,
      runway: runway,
   }))

}
