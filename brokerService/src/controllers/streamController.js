const {
   getGroundStationSocket,
   getUserSocket,
   setRequest,
} = require("../services/socketService")

exports.handleStream = (req, res) =>
{
   const { id: userId, deviceid: deviceId } = req.params

   const groundStationSocket = getGroundStationSocket(deviceId)
   const userSocket = getUserSocket(userId)

   if (!groundStationSocket)
   {
      console.log("groundStation Socket Not Found")
      return res
         .status(500)
         .send(
            `Broker does not have an active connection with groundStation with ID ${deviceId}`,
         )
   }

   if (!userSocket)
   {
      console.log("Client WebSocket not found")
      return res
         .status(400)
         .send(
            "WebSocket has not been created yet. Please make WebSocket request",
         )
   }

   setRequest(userId, deviceId)
   res.status(200).send("User added to stream.")
}
