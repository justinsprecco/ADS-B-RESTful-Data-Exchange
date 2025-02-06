const WebSocket = require("ws")
const { BROKER_SOCKET_SERV } = require("./config")
const messageController = require("./controllers/messageController")

let ws
let isConnected = false
let messageQueue = []
let reconnectInterval = 5000

const connectWebSocket = () =>
{
   console.log("Connecting to broker...")
   ws = new WebSocket(BROKER_SOCKET_SERV)

   ws.on("open", () =>
   {
      console.log("Broker connection established.")
      isConnected = true

      while (messageQueue.length > 0)
      {
         const message = messageQueue.shift()
         processMessage(message)
      }
   })

   ws.on("message", (message) =>
   {
      if (!isConnected) messageQueue.push(message)
      else processMessage(message)
   })

   ws.on("close", () =>
   {
      console.log("Broker connection closed. Reconnecting in 5 seconds...")
      isConnected = false
      setTimeout(connectWebSocket, reconnectInterval)
   })

   ws.on("error", (err) =>
   {
      console.error(`WebSocket error: ${err.message}`)
      ws.close()
   })
}

const processMessage = (message) => messageController(ws, message)

connectWebSocket()
