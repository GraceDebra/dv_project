import pkg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

pool
  .connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL")
    console.log("Database connection parameters:")
    console.log("- DB_USER:", process.env.DB_USER || "not set")
    console.log("- DB_HOST:", process.env.DB_HOST || "not set")
    console.log("- DB_NAME:", process.env.DB_NAME || "not set")
    console.log("- DB_PORT:", process.env.DB_PORT || "not set")
    console.log("- DB_PASSWORD:", process.env.DB_PASSWORD ? "Set" : "Not set")
  })
  .catch((err) => {
    console.error("❌ Connection error", err.message)

    // Check for common error codes
    if (err.code === "ECONNREFUSED") {
      console.error("Could not connect to PostgreSQL server. Please check if the server is running.")
    } else if (err.code === "28P01") {
      console.error("Invalid PostgreSQL username or password.")
    } else if (err.code === "3D000") {
      console.error("Database does not exist. Please create it first.")
    }
  })

// Add a method to check if the users table exists
pool.checkUsersTable = async () => {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `)

    return result.rows[0].exists
  } catch (error) {
    console.error("Error checking users table:", error)
    return false
  }
}

// Add a method to create the users table if it doesn't exist
pool.createUsersTable = async () => {
  try {
    const tableExists = await pool.checkUsersTable()

    if (!tableExists) {
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
      return true
    } else {
      console.log("Users table already exists.")
      return false
    }
  } catch (error) {
    console.error("Error creating users table:", error)
    return false
  }
}

export default pool

