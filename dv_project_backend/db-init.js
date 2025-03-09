// Script to initialize the database
// Run with: node db-init.js

import pool from "./config/db.js"

const initDatabase = async () => {
  try {
    console.log("Initializing database...")

    // Check if users table exists
    const tableExists = await pool.checkUsersTable()

    if (!tableExists) {
      // Create users table
      await pool.createUsersTable()
      console.log("Database initialized successfully.")
    } else {
      console.log("Database already initialized.")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    // Close the pool
    await pool.end()
    console.log("Database connection closed.")
  }
}

initDatabase()

