var mongoose = require('mongoose')
var Schema = mongoose.Schema

/*
The message schema stores the message contents along with the groundstation
ID that corresponds to the message.

A timestamp is given to the message so that it can be determined if the
message is over a week old and needs to be purged.
*/ 
const messageSchema = new Schema(
{
	_id: {type: Number, unique: true},
	data: String,
	timestamp: { type: Date, default: Date.now },
	groundstationID: Number
})

/*
Groundstation schema relies on the client to have its _id field match up
with the groundstationID key from the messageSchema.

numLandings contain the total number of landings (including touch and go)
for a groundstation for the entire lifetime.

touchAndGo specifically contain the total number of "touch and go" for a
groundstation for the entire lifetime.
*/
const groundstationSchema = new Schema(
{
	_id: {type: Number, unique: true},
	macAddress: {type: String, unique: true},
	latitude: Number,
	longitude: Number,
	numLandings: Number,
	touchAndGo: Number
})