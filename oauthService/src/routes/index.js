const express = require('express')
const router = express.Router()

/* retrieve middleware to checks user input at each endpoint */
const {
   verifyScope,
   verifyAuthCode,
   verifyRefreshToken,
   verifyBrokerSecret
} = require('../middleware')

const {
   generateAuthCode,
   generateTokens,
   refreshAccessToken,
   verifyAccessToken
} = require('../controllers')

/* URI to generate an authentication code */
router.post('/authCode', verifyScope, generateAuthCode)

/* URI to generate an access and refresh token */
router.post('/login', verifyAuthCode, generateTokens)

/* URI to refresh tokens */
router.post('/refresh', verifyRefreshToken, refreshAccessToken)

/* URI to verify access */
router.get('/verify', verifyAccessToken)

/* URI to generate broker token */
router.post('/brokerToken', verifyBrokerSecret, generateTokens)

module.exports = router
