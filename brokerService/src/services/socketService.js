const WebSocket = require("ws")
const { adminQueue } = require("./adminQueue")
const { USER_SOCKET_PORT } = require("../config")

const activeUserRequests = new Map()

let stationSocketServ, usersSocketServ

function openSocketConnections(server) 
{
   stationSocketServ = new WebSocket.Server({ server })
   usersSocketServ = new WebSocket.Server({ port: USER_SOCKET_PORT })

   stationSocketServ.on("connection", handleStationConnection)
   usersSocketServ.on("connection", handleUserConection)
}

async function closeWebSocketServer(server, name)
{
   server.clients.forEach((socket) => socket.close())
   await new Promise((resolve) => server.close(resolve))
   console.log(`${name} WebSocket server closed.`)
}

const closeSocketConnections = async () => 
{
   await Promise.all([
      closeWebSocketServer(stationSocketServ, "Groundstation"),
      closeWebSocketServer(usersSocketServ, "User")
   ])
}

function handleStationConnection(ws) 
{
   console.log("Groundstation connection established.")
   ws.on("message", (message) => processStationMessage(ws, message))
   ws.on("close", () => console.log(`Groundstation socket closed for id: ${ws.stationId}`))
}

function handleUserConection(ws) 
{
   console.log("User connection established.")
   ws.on("message", (message) => processUserMessage(ws, message))
   ws.on("close", () => console.log(`User socket closed for id: ${ws.userId}`))
}

function processStationMessage(ws, message)
{
   const data = JSON.parse(message)
   console.log("Received message:", data)

   if (data.type === "init") 
   {
      console.log("Socket init signal received")
      ws.stationId = data.stationId
   }
   else 
   {
      forwardToUsers(data.stationId, data)
      adminQueue.push(data)
      // TODO: insert into database
   }
}

function processUserMessage(ws, message)
{
   const data = JSON.parse(message)
   if (data.type === "init") 
   {
      console.log("Client init signal received")
      ws.userId = data.userId
      if (!ws.userId) 
      {
         console.log("userId is undefined")
         ws.close()
      }
   }
}

function forwardToUsers(stationId, data)
{
   const activeRequests = activeUserRequests.get(stationId) || []
   activeRequests.forEach((userId) => 
   {
      const userSocket = getUserSocket(userId)
      if (userSocket) userSocket.send(JSON.stringify(data))
   })
}

function getGroundStationSocket(deviceId) 
{
   return Array.from(stationSocketServ.clients).find(
      (client) => client.stationId === deviceId,
   )
}

function getUserSocket(userId) 
{
   return Array.from(usersSocketServ.clients).find(
      (client) => client.userId === userId,
   )
}

function setRequest(userId, deviceId) 
{
   if (!activeUserRequests.has(deviceId)) activeUserRequests.set(deviceId, [])
   activeUserRequests.get(deviceId).push(userId)
}

module.exports = {
   openSocketConnections,
   closeSocketConnections,
   getGroundStationSocket,
   getUserSocket,
   setRequest,
}
