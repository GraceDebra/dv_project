// Simple script to check if the server is running
// Run this with: node server-check.js

const checkServer = async () => {
    try {
      console.log("Testing connection to server...")
      const response = await fetch("http://localhost:8081/test-db")
  
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }
  
      const data = await response.json()
      console.log("✅ Server is running!")
      console.log("Server response:", data)
      return true
    } catch (error) {
      console.error("❌ Server connection failed!")
      console.error("Error details:", error.message)
  
      // Check if the error is related to connection refused
      if (error.message.includes("Failed to fetch") || error.message.includes("ECONNREFUSED")) {
        console.log("\nPossible solutions:")
        console.log("1. Make sure the server is running with: node server.js")
        console.log("2. Check if the port 8081 is not being used by another application")
        console.log("3. Verify your firewall settings are not blocking the connection")
        console.log("4. If using Docker, ensure port mapping is correct")
      }
  
      return false
    }
  }
  
  checkServer()
  
  