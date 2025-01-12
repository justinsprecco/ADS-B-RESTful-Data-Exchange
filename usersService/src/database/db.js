const { connect, connection } = require("mongoose")
const { DB_URI } = require("../config")

const dbConnect = async () =>
{
   try
   {
      connection.on("connected", () =>
      {
         console.log("Connected to MongoDB successfully")
      })

      connection.on("error", (err) =>
      {
         console.error("MongoDB connection error:", err)
      })

      connection.on("disconnected", () =>
      {
         console.log("MongoDB connection closed")
      })

      await connect(DB_URI)
   }
   catch (error)
   {
      console.error("MongoDB connection error:", error)
      process.exit(1)
   }
}

const dbDisconnect = async () =>
{
   try
   {
      await mongoose.connection.close()
      console.log("MongoDB connection closed gracefully.")

   }
   catch (error)
   {
      console.error("Error during MongoDB shutdown:", error)
   }
}

module.exports = { dbConnect, dbDisconnect }
