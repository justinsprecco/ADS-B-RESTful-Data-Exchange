const WebSocket = require("ws")
const { adminQueue } = require("./adminQueue")
const { USER_SOCKET_PORT, FUZZY_SOCKET_PORT, USER_PROXY, AUTH_PROXY, BROKER_SECRET } = require("../config")
const { ADSMessage } = require("../models/Message")
const axios = require("axios")

const activeUserRequests = new Map()

let stationSocketServ, usersSocketServ, fuzzySocketServ
let fuzzyClient

function openSocketConnections(server)
{
   stationSocketServ = new WebSocket.Server({ server })
   usersSocketServ = new WebSocket.Server({ port: USER_SOCKET_PORT })
   fuzzySocketServ = new WebSocket.Server({ port: FUZZY_SOCKET_PORT })

   stationSocketServ.on("connection", handleStationConnection)
   usersSocketServ.on("connection", handleUserConection)
   fuzzySocketServ.on("connection", handleFuzzyConnection)
}

const closeWebSocketServer = async(server, name) =>
{
   server.clients.forEach((socket) => socket.close())
   await new Promise((resolve) => server.close(resolve))
   console.log(`${name} WebSocket server closed.`)
}

const closeSocketConnections = async() =>
{
   await Promise.all([
      closeWebSocketServer(stationSocketServ, "Groundstation"),
      closeWebSocketServer(usersSocketServ, "User"),
      closeWebSocketServer(fuzzySocketServ, "Fuzzy")
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

function handleFuzzyConnection(ws)
{
   fuzzyClient = ws
   console.log("Fuzzy Service connection established.")
   ws.on("message", (message) => processFuzzyMessage(ws, message))
   ws.on("close", () =>
   {
      fuzzyClient = null
      console.log(`Fuzzy Service connection closed`)
   })
}

const processStationMessage = async(ws, message)  =>
{
   const data = JSON.parse(message)
   console.log("Received message:", data)

   // TODO: Verify device is registered

   if (data.type === "init")
   {
      console.log("Socket init signal received. Sending lat/lon")
      ws.stationId = data.stationId

      try
      {
         const authToken = await getAuthToken()
         const { latitude, longitude } = await fetchDevice(data.stationId, authToken)

         console.log(`Sending lat/lon: ${latitude}/${longitude}`)

         ws.send(JSON.stringify({ latitude, longitude }))
      }

      catch (error)
      {
         if (error.status == 404)
            ws.send("Device not found in the data exchange")
         else
            ws.send(error.message)

         console.log(error.message)
      }
   }
   else
   {
      const buffer = Buffer.from(data.message, "hex")
      if (fuzzyClient) fuzzyClient.send(buffer)
      forwardToUsers(data.stationId, data)
      adminQueue.push(data)
      const timestamp = new Date(data.timestamp)
      await ADSMessage.create(buffer, ws.stationId, timestamp)
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

const processFuzzyMessage = async(ws, message)  =>
{
   const data = JSON.parse(message)
   console.log("Received message:", data)

   if (data.type === "init")
   {
      console.log("Socket init signal received")
   }
   else
   {
      console.log(`Plane landed on runway ${data.runway}`)
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

const fetchDevice = async (deviceId, authToken) =>
{
   const response = await axios.get(`${USER_PROXY}/users/devices/${deviceId}`, {
      headers: {
         'Authorization': `Bearer ${authToken}`
      }
   })

   return response.data.device
}

const getAuthToken = async () =>
{
   const response = await axios.post(`${AUTH_PROXY}/auth/brokerToken`, {
      secret: BROKER_SECRET
   })

   return response.data.accessToken
}

module.exports = {
   openSocketConnections,
   closeSocketConnections,
   getGroundStationSocket,
   getUserSocket,
   setRequest,
}
