const http = require("http")
const app = require("./app")
const { PORT } = require("./config")
const { dbConnect } = require("./database/db")
const { openSocketConnections, closeSocketConnections } = require("./services/socketService")

// HTTP Server
const server = http.createServer(app)

// Initialize database and WebSocket
dbConnect()
openSocketConnections(server)

// Start the server
server.listen(PORT, () => console.log(`Broker service running on port ${PORT}`))

// Clean shutdown logic
const shutdown = async () =>
{
   console.log("\nGracefully shutting down...")

   await closeSocketConnections()

   server.close()
   console.log("HTTP server closed.")

   process.exit(0)
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)
