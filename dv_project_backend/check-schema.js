// Script to check database schema
// Run with: node check-db-schema.js

import pool from "./config/db.js"

const checkDatabaseSchema = async () => {
  try {
    console.log("Checking database schema...")

    // Check if users table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `)

    if (!tableExists.rows[0].exists) {
      console.log("Users table does not exist!")
      return
    }

    console.log("Users table exists. Checking columns...")

    // Get current columns
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `)

    console.log("Current columns:")
    columns.rows.forEach((col) => {
      console.log(`- ${col.column_name} (${col.data_type})`)
    })

    // Check for required columns
    const requiredColumns = ["email", "password", "full_name"]
    const missingColumns = []

    for (const required of requiredColumns) {
      const found = columns.rows.some(
        (col) => col.column_name.toLowerCase() === required || col.column_name.toLowerCase().includes(required),
      )

      if (!found) {
        missingColumns.push(required)
      }
    }

    if (missingColumns.length > 0) {
      console.log("Missing required columns:", missingColumns)
      console.log("Please run db-schema-fix.js to fix the schema.")
    } else {
      console.log("All required columns exist.")
    }
  } catch (error) {
    console.error("Error checking database schema:", error)
  } finally {
    // Close the pool
    await pool.end()
    console.log("Database connection closed.")
  }
}

checkDatabaseSchema()
        

