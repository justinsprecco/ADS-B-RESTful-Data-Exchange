/*
   This file provides middleware that cleanses and verifies user input.

   TODO: Implement clientID and clientSecret for security

*/

const { verify } = require("jsonwebtoken")
const { AUTH_CODE_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, BROKER_SECRET } = require("../config")
const Token = require("../models/Token")

const getScope = async (scope) =>
{
   const scopeInfo = {
      admin: { accessExpiry: '10m', refreshExpiry: '7d' },
      user: { accessExpiry: '10m', refreshExpiry: '1d' }
   }

   if (scopeInfo[scope])
      return scopeInfo[scope]
   else
      throw new Error(`${scope} is an invalid scope!`)
}

/*
  This middleware verifies that the correct userdata exists and the scope is valid
*/
exports.verifyScope = async(req, res, next) =>
{
   const { userId, scope } = req.body
   if (!userId || !scope) return res.status(400).json({ message: "Header is missing user data!" })

   try
   {
      await getScope(scope)

      req.body = { userId, scope }

      next()
   }
   catch (err)
   {
      return res.status(400).json({ message: err.message })
   }
}

/*
  This middleware verifies that the authCode is valid and authentic
*/
exports.verifyAuthCode = async(req, res, next) =>
{
   const { authCode } = req.body
   if (!authCode) return res.status(400).json({ message: "Header is missing authorization code!" })

   try
   {
      const { userId, scope } = verify(authCode, AUTH_CODE_SECRET)
      const { accessExpiry, refreshExpiry } = await getScope(scope)

      req.body = { userId, scope, accessExpiry, refreshExpiry }

      next()
   }
   catch (err)
   {
      return res.status(400).json({ message: 'Invalid or expired authorization code' })
   }
}

/*
  This middleware verifies that the refresh token is valid and authentic
*/
exports.verifyRefreshToken = async (req, res, next) =>
{
   const { userId, refreshToken } = req.body
   if (!refreshToken) return res.status(400).json({ message: "Missing refresh token!" })

   try
   {
      const { scope } = await Token.validate(userId, refreshToken)

      const { accessExpiry } = await getScope(scope)

      req.body = { userId, scope, accessExpiry }

      next()
   }
   catch (err)
   {
      return res.status(401).json({ message: err.message })
   }
}

exports.verifyBrokerSecret = async (req, res, next) =>
{
   try
   {
      const { secret } = req.body

      if (!secret) return res.status(400).json({ message: "Missing secret" })

      if (BROKER_SECRET !== secret)
         return res.status(401).json({ message: "Invalid Secret"})

      const { accessExpiry, refreshExpiry } = await getScope("admin")

      req.body = { scope: "admin", accessExpiry, refreshExpiry }

      req.isBroker = true

      next()
   }
   catch (err)
   {
      return res.status(500).json({ message: err.message })
   }
}
