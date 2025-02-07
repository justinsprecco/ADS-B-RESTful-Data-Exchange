/**
 * @typedef {Object} participant - Structured participant
 * @prop {string} address - Address of the participant
 * @prop {("ICAO"|"Non-ICAO"|"Obstruction"|"Duplicate")} type - Type of address
 * @prop {("Airfract"|"Surface Vehicle"|"Unknown")} category - Category of vehicle
 */

/**
 * @typedef {Object} timestamps - Structured timestamps
 * @prop {number} [estPosition] - Estimated position report timestamp in seconds
 * @prop {number} [position] - Position report timestamp in seconds
 * @prop {number} [velocity] - Velocity report timestamp in seconds
 */
/**
 * @typedef {Object} estimates - Estimated position and velocity
 * @prop {number} latitude - Estimated latitude in degrees
 * @prop {number} longitude - Estimated longitude in degrees
 * @prop {number} nsVelocity - Estimated North-South velocity in knots
 * @prop {number} ewVelocity - Estimated East-West velocity in knots
 */
/**
 * @typedef {Object} coordinates - Latitude and Longitude in degrees
 * @prop {number} latitude - Latitude in degrees (positive for North, negative for South)
 * @prop {number} longitude - Longitude in degrees (positive for North, negative for South)
 */
/**
 * @typedef {Object} altitude - Geometric/Barometric Altitude in feet
 * @prop {number} [geometric] - Geometric altitude in feet
 * @prop {number} [barometric] - Barometric altitude in feet
 */
/**
 * @typedef {Object} velocity - North-South and East-West velocity in knots
 * @prop {number} northSouth - North-South velocity in knots (positive = North, negative = South)
 * @prop {number} eastWest - East-West velocity in knots (positive = East, negative = West)
 *
 */

/**
 * @typedef {Object} surveillance - Surveillance status and intent
 * @prop {"Emergency"|"Temporary"|"SPI"} status - Surveillance status of adsb participant
 * @prop {boolean} changed - Intent Change flag
 */

/**
 * @typedef {Object} stateVectors - Structured stateVectors decoded from an ADS-B State Vector Report
 * @prop {participant} [participant] - Participant address, type, and category
 * @prop {timestamps} [timestamps] - Estimated position, position, and velocity report timestamps in seconds
 * @prop {estimates} [estimates] - Estimated position, and velocity
 * @prop {coordinates} [coordinates] - Latitude and Longitude in degrees
 * @prop {altitude} [altitude] - Geometric/Barometric altitude in feet
 * @prop {velocity} [velocity] - Velocity in knots
 * @prop {number} [groundSpeed] - Ground speed in knots.
 * @prop {number} [heading] - Heading on surface in degrees.
 * @prop {number} [verticalRate] - Vertical rate in feet per minute.
 * @prop {number} [rc] - Radius of containment in meters.
 * @prop {surveillance} [surveillance] - Surveillance status from ADS-B message.
 * @prop {"Aquisition"|"Track"} [reportMode] - Report mode from ADS-B message.
 */
