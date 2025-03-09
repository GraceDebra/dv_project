// Script to fix database schema issues
// Run with: node db-schema-fix.js

import pool from "./config/db.js"

const fixDatabaseSchema = async () => {
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
      console.log("Users table does not exist. Creating it...")

      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'registered',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX idx_users_email ON users(email);
      `)

      console.log("Users table created successfully.")
    } else {
      console.log("Users table exists. Checking columns...")

      // Get current columns
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
      `)

      console.log("Current columns:", columns.rows)

      // Check if email column exists
      const hasEmailColumn = columns.rows.some(
        (col) => col.column_name.toLowerCase() === "email" || col.column_name.toLowerCase().includes("email"),
      )

      if (!hasEmailColumn) {
        console.log("Email column does not exist. Adding it...")

        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN email VARCHAR(255) UNIQUE;
        `)

        console.log("Email column added successfully.")
      }

      // Check if full_name column exists
      const hasFullNameColumn = columns.rows.some(
        (col) => col.column_name.toLowerCase() === "full_name" || col.column_name.toLowerCase().includes("name"),
      )

      if (!hasFullNameColumn) {
        console.log("Full name column does not exist. Adding it...")

        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN full_name VARCHAR(255);
        `)

        console.log("Full name column added successfully.")
      }

      // Check if password column exists
      const hasPasswordColumn = columns.rows.some(
        (col) => col.column_name.toLowerCase() === "password" || col.column_name.toLowerCase().includes("password"),
      )

      if (!hasPasswordColumn) {
        console.log("Password column does not exist. Adding it...")

        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN password VARCHAR(255);
        `)

        console.log("Password column added successfully.")
      }

      // Check if status column exists
      const hasStatusColumn = columns.rows.some(
        (col) => col.column_name.toLowerCase() === "status" || col.column_name.toLowerCase().includes("status"),
      )

      if (!hasStatusColumn) {
        console.log("Status column does not exist. Adding it...")

        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN status VARCHAR(50) DEFAULT 'registered';
        `)

        console.log("Status column added successfully.")
      }
    }

    console.log("Database schema check completed.")
  } catch (error) {
    console.error("Error fixing database schema:", error)
  } finally {
    // Close the pool
    await pool.end()
    console.log("Database connection closed.")
  }
}

fixDatabaseSchema()

