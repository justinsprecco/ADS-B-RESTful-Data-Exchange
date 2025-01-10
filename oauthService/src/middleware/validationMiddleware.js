/*
   This file provides middleware that cleanses and verifies user input.

   TODO: Implement clientID and clientSecret for security

*/

const { verify } = require("jsonwebtoken")
const { AUTH_CODE_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config")

const getScope = (scope) =>
{
   const scopeInfo = {
      admin: { accessExpiry: '30m', refreshExpiry: '60m' },
      user: { accessExpiry: '20m', refreshExpiry: '60m' }
   }

   if (scopeInfo[scope])
   {
      return scopeInfo[scope]
   }
   else
   {
      throw new Error(`${scope} is an invalid scope!`)
   }
}

/*
  This middleware verifies that the correct userdata exists and the scope is valid
*/
exports.verifyScope = async(req, res, next) =>
{
   const { username, scope } = req.body
   if (!username || !scope) return res.status(400).json({ message: "Header is missing user data!" })

   try
   {
      getScope(scope)

      req.body = { username, scope }

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
      const { username, scope } = verify(authCode, AUTH_CODE_SECRET)
      const { accessExpiry, refreshExpiry } = getScope(scope)

      req.body = { username, scope, accessExpiry, refreshExpiry }

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
   const { refreshToken } = req.body
   if (!refreshToken) return res.status(400).json({ message: "Missing refresh token!" })

   try
   {
      const {username, scope } = verify(refreshToken, REFRESH_TOKEN_SECRET)
      const { accessExpiry } = getScope(scope)

      req.body = { username, scope, accessExpiry }

      next()
   }
   catch (err)
   {
      return res.status(401).json({ message: "Invalid or expired refresh token" })
   }
}
