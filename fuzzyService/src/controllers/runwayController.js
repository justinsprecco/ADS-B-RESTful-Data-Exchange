const adsDecoder = require("../services/adsDecoder")
const fuzzyLogic = require("../services/fuzzyLogic")
const getRunway = require("../services/runwayFinder")

module.exports = async(ws, message) =>
{
   console.log('Received ADS-B message:', message)

   const decodedMessage = adsDecoder(message)

   const hasLanded = await fuzzyLogic(decodedMessage)

   if (!hasLanded) return

   const runway = getRunway(decodedMessage)

   ws.send(JSON.stringify({
      landed: hasLanded,
      runway: runway,
   }))
}
