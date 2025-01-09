const { connect } = require("mongoose")
const { DB_URI } = require("../config")

const dbConnect = async () =>
{
   try
   {
      await connect(DB_URI)
      console.log("Connected to MongoDB successfully")
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
