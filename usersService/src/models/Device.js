const { db } = require("../database/db")

exports.postDevice = async (userId, macAddress, latitude, longitude) =>
{
   const query = {
      text: "INSERT INTO groundstations (userId, macAddress, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [id, macAddress, latitude, longitude]
   }

   const results = await db.query(query)
   return results[0]
}

exports.getDevices = async (userId) =>
{
   const query = {
      text: 'SELECT macAddress, latitude, longitude FROM groundstations WHERE userId = $1',
      values: [userId]
   }

   const results = await db.query(query)
   return results
}

exports.getDevice = async (userId, deviceId) =>
{
   const query = {
      text: 'SELECT macAddress, latitude, longitude FROM groundstations WHERE userId = $1 AND id = $2',
      values: [userId, deviceid]
   }

   const results = await db.query(query)
   return results[0]
}

exports.deleteDevice = async (deviceId) =>
{
   const query = {
      text: 'DELETE FROM groundstations WHERE userId = $1 AND id = $2',
      values: [userId, deviceid]
   }

   const results = await db.query(query)

   // TODO: check results
}

exports.updateDevice = async (userId, deviceId, latitude, longitude) =>
{
   const queries = [
      {
         text: 'UPDATE groundstations SET latitude = $3, longitude = $4 WHERE userId = $1 AND id = $2',
         values: [userId, deviceid, latitude, longitude]
      }, {
         text: 'UPDATE groundstations SET latitude = $3 WHERE userId = $1 AND id = $2',
         values: [userId, deviceid, latitude]
      }, {
         text: 'UPDATE groundstations SET longitude = $3 WHERE userId = $1 AND id = $2',
         values: [userId, deviceid, longitude]
      }
   ]

   let results = null
   if (latitude && longitude)
   {
      results = await db.query(queries[0])
   }
   else if (latitude)
   {
      results = await db.query(queries[1])
   }
   else if (longitude)
   {
      results = await db.query(queries[2])
   }

   return results
}
