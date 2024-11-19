var mongoose = require('mongoose')
var Schema = mongoose.Schema


/*
The user schema contains the id of a user and the number of 
landings/touchandgo during its entire lifetime for all of its groundstations.

numLandings contain the total number of landings (not including touch and go)
for a user.

touchAndGo specifically contain the total number of "touch and go" for a
user.
*/
const userSchema = new Schema(
{
	_id: {type: Number, uniquer: true},
	numLandings: Number,
	touchAndGo: Number
}
)

/*
The message schema stores the message contents along with the groundstation
ID that corresponds to the message.

A timestamp is given to the message so that it can be determined if the
message is over a week old and needs to be purged.
*/ 
const messageADSBSchema = new Schema(
{
	_id: {type: Number, unique: true},
	data: String,
	timestamp: { type: Date, default: Date.now },
	groundstationID: Number
})

/*
The message Radar schema stores the message contents along with the 
groundstation ID that corresponds to the message.

A timestamp is given to the message so that it can be determined if the
message is over a week old and needs to be purged.
*/ 
const messageRadarSchema = new Schema(
{
	_id: {type: Number, unique: true},
	data: String,
	timestamp: { type: Date, default: Date.now },
	groundstationID: Number
})

/*
Groundstation schema relies on the client to have its _id field match up
with the groundstationID key from the messageADBSSchema and 
messageRadarSchema.

Groundstation schema also relies on the client to have its userID field
match up with userSchema's _id field.

A user can have many groundstations but a groundstation can only have one
user.
*/
const groundstationSchema = new Schema(
{
	_id: {type: Number, unique: true},
	macAddress: {type: String, unique: true},
	latitude: Number,
	longitude: Number,
	userID: Number
})