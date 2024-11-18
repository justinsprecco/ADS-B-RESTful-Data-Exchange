const pgp = require("pg-promise")()
const { DB_URI } = require("../config")

const db = pgp(DB_URI)

const dbConnect = async () => 
{
   try 
   {
      const connection = await db.connect()
      console.log("Connected to the database:", db.$config.options)
      connection.done() // release the connection
   }
   catch (error) 
   {
      console.error("Error connecting to the database:", error)
   }
}

const dbDisconnect = () => 
{
   pgp.end()
   console.log("Database connections closed.")
}

module.exports = { db, dbConnect, dbDisconnect }
