/*
   This file provides middleware that verifies the access token
*/

const { post } = require("axios")
const { AUTH_URI, AUTH_TOKEN_SECRET } = require("../config")
const { verify } = require("jsonwebtoken")

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
      /*
         NOTE: Possible post to oauthService?

         const response = await post(`${AUTH_URI}/verify`, { accessToken })
      */

      const decoded = verify(accessToken, AUTH_TOKEN_SECRET)

      if (!decoded)
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
