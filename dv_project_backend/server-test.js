import express from "express"
import cors from "cors"

const app = express()

// Enable CORS
app.use(cors())

// Basic test route
app.get("/test", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  })
})

// Start server with detailed logging
const PORT = process.env.PORT || 8081
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(50))
  console.log(`Server started successfully!`)
  console.log(`Test the server at: http://localhost:${PORT}/test`)
  console.log("=".repeat(50))
})

// Add error handling
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use!`)
    console.log("Try these solutions:")
    console.log("1. Stop any other servers running on this port")
    console.log("2. Choose a different port by setting the PORT environment variable")
  } else {
    console.error("Server error:", error)
  }
  process.exit(1)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Performing graceful shutdown...")
  server.close(() => {
    console.log("Server closed.")
    process.exit(0)
  })
})

