const fs = require("fs")
const path = require("path")
const { hexToBin } = require("./index")
const { stateVectorParser } = require("../parsers")
const stateVectorDecoder = require("../services/stateVectorDecoder")

const logFile = process.argv[2]

if (!logFile)
{
   console.error("Usage: node readLog.js <logFile>")
   process.exit(1)
}

const readLogFile = (logFile)  =>
{
   const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean)

   console.log(`Reading logfile <${path.basename(logFile)}>`)

   for (const line of lines)
   {
      const message = line.split(" - ")[1].split(" ").join("")
      const binMessage = hexToBin(message)
      const messageType = parseInt(binMessage.slice(8, 16), 2)
      const payload = binMessage.slice(32)

      if (messageType != 145)
         continue

      const parsedMessage = stateVectorParser(payload)
      const decodedMessage = stateVectorDecoder(parsedMessage)

      console.log(`Message: ${JSON.stringify(decodedMessage)}`)
   }
}

readLogFile(logFile)

