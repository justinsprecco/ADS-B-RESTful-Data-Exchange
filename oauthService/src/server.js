const http = require("http")
const app = require("./app")
const { PORT } = require("./config")
const { dbConnect, dbDisconnect } = require("./database/db")

// HTTP Server
const server = http.createServer(app)

// Initialize database
dbConnect()

// Start the server
server.listen(PORT, () => console.log(`Auth service running on port ${PORT}`))

// Clean shutdown logic
const shutdown = async () => 
{
   console.log("\nGracefully shutting down...")

   server.close()
   console.log("HTTP server closed.")

   dbDisconnect()
   process.exit(0)
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)
