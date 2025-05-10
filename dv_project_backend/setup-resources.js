// setup-resources.js
import dotenv from "dotenv"
import pool from "./config/db.js"


dotenv.config()

async function setupResources() {
  try {
    console.log("Setting up resources tables...")

    // Create tables if they don't exist
    const tablesExist = await pool.checkResourcesTables()
    
    if (!tablesExist) {
      console.log("Resources tables do not exist. Creating them...")
      await pool.createResourcesTables()
      
      console.log("Resources tables created. Now seeding data...")
      // Import and run the seed script
      const { seedResourcesDatabase } = await import("./seed-resources.js")
      await seedResourcesDatabase()
    } else {
      console.log("Resources tables already exist. If you want to seed data, run 'node db/seed-resources.js'")
    }
  } catch (error) {
    console.error("Error setting up resources:", error)
  }
}

// Run the setup function
setupResources()