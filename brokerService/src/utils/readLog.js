const fs = require("fs")
const path = require("path")
const { dbConnect, dbDisconnect } = require("../database/db")
const { ADSMessage } = require("../models/Message")

const logFile = process.argv[2]
const macAddress = process.argv[3]

if (!logFile || !macAddress)
{
   console.error("Usage: node readLog.js <logFile> <macAddress>")
   process.exit(1)
}

const readLogFile = async (logFile, macAddress)  =>
{
   await dbConnect()
   const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean)

   console.log(`Reading logfile <${path.basename(logFile)}> from device: ${macAddress}`)

   try
   {
      for (const line of lines)
      {
         const parts = line.split(" - ")
         const timestamp = new Date(parts[0])
         const message = parts[1].split(" ").join("")
         const buffer = Buffer.from(message, "hex")

         console.log(`Message: ${message}`)

         await ADSMessage.create(buffer, macAddress, timestamp)
      }

      console.log("Logfile ingested successfully.")
   }
   catch(err)
   {
      console.log(err.message)
   }
   finally
   {
      await dbDisconnect
      process.exit(0)
   }
}

readLogFile(logFile, macAddress)
