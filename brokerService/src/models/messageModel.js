const { db } = require("../database/db")

exports.getMessages = async () => 
{
   return await db.any("SELECT * FROM adsb_messages")
}

exports.fetchLatestAdsbMessages = async () => 
{
   return await db.any(
      "SELECT * FROM adsb_messages ORDER BY timestamp DESC LIMIT 10",
      [],
   )
}

// Function to retrieve and display ADS-B messages within a specific time range
exports.fetchAdsbMessagesByTime = async (start, end) => 
{
   return await db.any(
      "SELECT * FROM adsb_messages WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp DESC",
      [start, end],
   )
}
