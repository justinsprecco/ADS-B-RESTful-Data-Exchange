const { addressDecoder, groundSpeedDecoder, nicDecoder, surveillanceDecoder, reportModeDecoder } = require("../decoders")
const { twosComplement } = require("../utils")

/**
 * Decodes a parsed ADS-B message into a structured object.
 *
 * @param {Object} message The parsed ADS-B message object with binary fields.
 * @return {stateVectors} The structured, decoded data.
 */
const stateVectorDecoder = (message) =>
{
   const timeResolution = 0.0078125
   const coordResolution = 180 / Math.pow(2, 23)
   const altResolution = 0.015625
   const velResolution = 0.125
   const headingResolution = 1.40625
   const verticalResolution = 1.0

   const stateVectors = { timestamps: {}, estimates: {}, coordinates: {}, altitude: {}, velocity: {} }

   // Populate participant
   if (message.participantAddress && message.addressQualifier)
      stateVectors.participant = addressDecoder(message.participantAddress, message.addressQualifier)

   // Populate timestamps
   if (message.estPositionReportTime)
      stateVectors.timestamps.estPosition = parseInt(message.estPositionReportTime, 2) * timeResolution
   if (message.positionReportTime)
      stateVectors.timestamps.position = parseInt(message.positionReportTime, 2) * timeResolution
   if (message.velocityReportTime)
      stateVectors.timestamps.velocity = parseInt(message.velocityReportTime, 2) * timeResolution

   // Populate estimates
   if (message.estimatedLatitude)
      stateVectors.estimates.latitude = twosComplement(message.estimatedLatitude, coordResolution)
   if (message.estimatedLongitude)
      stateVectors.estimates.longitude = twosComplement(message.estimatedLongitude, coordResolution)
   if (message.estimatedNsVelocity)
      stateVectors.estimates.nsVelocity = twosComplement(message.estimatedNsVelocity, velResolution)
   if (message.estimatedEwVelocity)
      stateVectors.estimates.ewVelocity = twosComplement(message.estimatedEwVelocity, velResolution)

   // Populate coordinates
   if (message.latitude)
      stateVectors.coordinates.latitude = twosComplement(message.latitude, coordResolution)
   if (message.longitude)
      stateVectors.coordinates.longitude = twosComplement(message.longitude, coordResolution)

   // Populate altitude
   if (message.geometricAltitude)
      stateVectors.altitude.geometric = twosComplement(message.geometricAltitude, altResolution)
   if (message.barometricAltitude)
      stateVectors.altitude.barometric = twosComplement(message.barometricAltitude, altResolution)

   // Populate velocity
   if (message.nsVelocity)
      stateVectors.velocity.northSouth = twosComplement(message.nsVelocity, velResolution)
   if (message.ewVelocity)
      stateVectors.velocity.eastWest = twosComplement(message.ewVelocity, velResolution)

   // Populate ground speed
   if (message.groundSpeedOnSurface)
      stateVectors.groundSpeed = groundSpeedDecoder(message.groundSpeedOnSurface)

   // Populate heading
   if (message.headingOnSurface)
      stateVectors.heading = twosComplement(message.headingOnSurface, headingResolution)

   // Populate vertical rate
   if (message.verticalRate)
      stateVectors.verticalRate = twosComplement(message.verticalRate, verticalResolution)

   // Populate radius of containment
   if (message.nic)
      stateVectors.rc = nicDecoder(message.nic)

   // Populate status/intent
   if (message.surveillanceStatus)
      stateVectors.surveillance = surveillanceDecoder(message.surveillanceStatus)

   // Populate report mode
   if (message.reportMode)
      stateVectors.reportMode = reportModeDecoder(message.reportMode)

   return stateVectors
}

module.exports = stateVectorDecoder
