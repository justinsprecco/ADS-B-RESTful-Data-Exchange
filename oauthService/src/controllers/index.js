/*
   This file provide the oauth URI endpoints that help generate tokens and
   verify each token.
*/

const { sign, decode, verify } = require("jsonwebtoken")
const { AUTH_CODE_SECRET, AUTH_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config")
const Token = require("../models/Token")

/*
  This function generates the authentication code
*/

exports.generateAuthCode = async (req, res) =>
{
   const payload = req.body

   try
   {
      const authCode = await sign(payload, AUTH_CODE_SECRET, { expiresIn: "5m" })

      return res.status(200).json({ authCode })
   }
   catch (err)
   {
      return res.status(500).json({ message: err.message })
   }
}

/*
  This function generates the access and refresh tokens.
*/

exports.generateTokens = async (req, res) =>
{
   const { userId, scope, accessExpiry, refreshExpiry } = req.body

   const payload = { userId, scope }
   const accessOptions = { expiresIn: accessExpiry }
   const refreshOptions = { expiresIn: refreshExpiry }

   try
   {
      const accessToken = await sign(payload, AUTH_TOKEN_SECRET, accessOptions)
      const refreshToken = await sign(payload, REFRESH_TOKEN_SECRET, refreshOptions)

      const { iat, exp } = await decode(refreshToken, REFRESH_TOKEN_SECRET)
      const issuedAt = new Date(iat * 1000)
      const expiresAt = new Date(exp * 1000)

      await Token.create(userId, refreshToken, issuedAt, expiresAt)

      return res.status(200).json({ accessToken, refreshToken })
   }
   catch (err)
   {
      return res.status(500).json({ message: err.message })
   }
}

/*
  This function refreshes the access token

  TODO: invalidate old access token if needed

*/
exports.refreshAccessToken = async (req, res) =>
{
   const { userId, scope, accessExpiry } = req.body

   const payload = { userId, scope }
   const accessOptions = { expiresIn: accessExpiry }

   try
   {
      const accessToken = await sign(payload, AUTH_TOKEN_SECRET, accessOptions)

      return res.status(200).json({ accessToken })
   }
   catch (err)
   {
      return res.status(500).json({ message: err.message })
   }
}

/*
  TODO: Check scope to verify what permissions are available
*/
exports.verifyAccessToken = async (req, res) =>
{
   const authHeader = req.headers['authorization']
   if (!authHeader) return res.status(400).json({ message: "Authorization header is missing" })

   const token = authHeader.split(' ')[1] // Assuming 'Bearer <token>'
   if (!token) return res.status(400).json({ message: "Access token is missing" })

   try
   {
      await verify(token, AUTH_TOKEN_SECRET)

      return res.status(200).json({ message: "Access token is valid" })
   }
   catch (err)
   {
      return res.status(401).json({ message: "Invalid or expired access token" })
   }
}
