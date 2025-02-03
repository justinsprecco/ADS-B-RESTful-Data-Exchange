const WebSocket = require("ws")
const { BROKER_SOCKET_SERV } = require("./config")
const runwayController = require("./controllers/runwayController")

const ws = new WebSocket(BROKER_SOCKET_SERV)

ws.on("open", () =>
{
   console.log("Broker connection established.")
})

ws.on("message", (message) =>
{
   const data = JSON.parse(message)
   runwayController(ws, data.message)
})

ws.on("close", () =>
{
   console.log("Broker connection closed")
})
