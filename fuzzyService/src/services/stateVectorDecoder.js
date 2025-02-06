const { addressDecoder, groundSpeedDecoder, nicDecoder, surveillanceDecoder, reportModeDecoder } = require("../decoders")
const { twosComplement } = require("../utils")

module.exports = (message) =>
{
   const decodedMessage = {}

   // Address, type, and category
   if (message.participantAddress && message.addressQualifier)
      decodedMessage.participantAddress = addressDecoder(message.participantAddress, message.addressQualifier)

   // Time in seconds since gps start of week?
   const timeResolution = 0.0078125
   if (message.estPositionReportTime)
      decodedMessage.estPositionTimestamp = parseInt(message.estPositionReportTime, 2) * timeResolution
   if (message.positionReportTime)
      decodedMessage.positionTimestamp = parseInt(message.positionReportTime, 2) * timeResolution
   if (message.velocityReportTime)
      decodedMessage.velocityTimestamp = parseInt(message.velocityReportTime, 2) * timeResolution

   // Coordinates in degrees -- N, E: positive -- S, W: negative
   const coordResolution = 180 / Math.pow(2, 23)
   if (message.latitude)
      decodedMessage.latitude = twosComplement(message.latitude, coordResolution)
   if (message.estimatedLatitude)
      decodedMessage.estimatedLatitude = twosComplement(message.estimatedLatitude, coordResolution)
   if (message.longitude)
      decodedMessage.longitude = twosComplement(message.longitude, coordResolution)
   if (message.estimatedLongitude)
      decodedMessage.estimatedLongitude = twosComplement(message.estimatedLongitude, coordResolution)

   // Altitude in feet
   const altResolution = 0.015625
   if (message.geometricAltitude)
      decodedMessage.geometricAltitude = twosComplement(message.geometricAltitude, altResolution)
   if (message.barometricAltitude)
      decodedMessage.barometricAltitude = twosComplement(message.barometricAltitude, altResolution)

   // Velocity in knots
   const velResolution = 0.125
   if (message.nsVelocity)
      decodedMessage.nsVelocity = twosComplement(message.nsVelocity, velResolution)
   if (message.ewVelocity)
      decodedMessage.ewVelocity = twosComplement(message.ewVelocity, velResolution)
   if (message.estimatedNsVelocity)
      decodedMessage.estimatedNsVelocity = twosComplement(message.estimatedNsVelocity, velResolution)
   if (message.estimatedEwVelocity)
      decodedMessage.estimatedEwVelocity = twosComplement(message.estimatedEwVelocity, velResolution)

   // Speed in knots
   if (message.groundSpeedOnSurface)
      decodedMessage.groundSpeed = groundSpeedDecoder(message.groundSpeedOnSurface)

   // Heading in degrees
   if (message.headingOnSurface)
      decodedMessage.headingOnSurface = twosComplement(message.headingOnSurface, 1.40625)

   // Rate in ft/min
   if (message.verticalRate)
      decodedMessage.verticalRate = twosComplement(message.verticalRate, 1.0)

   // Radius of containment in meters
   if (message.nic)
      decodedMessage.rc = nicDecoder(message.nic)

   // Status and Intent
   if (message.surveillanceStatus)
      decodedMessage.surveillanceStatus = surveillanceDecoder(message.surveillanceStatus)

   // Report Mode
   if (message.reportMode)
      decodedMessage.reportMode = reportModeDecoder(message.reportMode)

   return decodedMessage
}
