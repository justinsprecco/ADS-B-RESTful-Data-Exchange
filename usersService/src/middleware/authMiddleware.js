/*
   This file provides middleware that verifies the access token
*/

const { post } = require('axios')
const { AUTH_URI } = require('../config')

exports.verifyAccessToken = async (req, res, next) => 
{
   const authHeader = req.headers["authorization"]
   if (!authHeader)
   {
      return res.status(401).json({ message: "Authorization header is missing" })
   }

   const accessToken = authHeader.split(" ")[1]
   if (!accessToken)
   {
      return res.status(401).json({ message: "Access token is missing" })
   }

   try
   {
      const response = await post(`${AUTH_URI}/verify`, { accessToken })

      if (response.data.message !== "Access token is valid")
      {
         return res.status(403).json({ message: "Invalid or expired access token" })
      }

      next()
   }
   catch (err)
   {
      return res.status(500).json({ message: "Failed to verify token" })
   }
}
