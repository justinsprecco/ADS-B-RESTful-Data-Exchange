const adsDecoder = require("../services/adsDecoder")
const fuzzyLogic = require("../services/fuzzyLogic")
const getRunway = require("../services/runwayFinder")
const { hexToBin } = require("../utils")

module.exports = async(ws, message) =>
{
   console.log('Received ADS-B message:', (message))

   const binMessage = hexToBin(message)

   const decodedMessage = adsDecoder(binMessage.slice(32))

   if (!decodedMessage) return

   const hasLanded = await fuzzyLogic(decodedMessage)

   if (!hasLanded) return

   const runway = getRunway(decodedMessage)

   ws.send(JSON.stringify({
      landed: hasLanded,
      runway: runway,
   }))

}
