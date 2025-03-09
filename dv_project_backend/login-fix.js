const express = require("express")
const { Pool } = require("pg")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.DB_USER || "your_db_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "your_db_name",
  password: process.env.DB_PASSWORD || "your_db_password",
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
})

// Update the login route to handle different column names
app.post("/login", async (req, res) => {
  try {
    console.log("Received login request body:", req.body)

    const { email, password } = req.body

    if (!email || !password) {
      console.log("Missing required fields:", { email: !!email, password: !!password })
      return res.status(400).json({ error: "Email and password are required" })
    }

    console.log("Finding user by email...")

    // First, let's check the actual table structure
    try {
      const tableStructure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
      `)

      console.log("Users table structure:", tableStructure.rows)

      // Find the email column (it might have a different name)
      const emailColumn = tableStructure.rows.find(
        (col) =>
          col.column_name.toLowerCase().includes("email") ||
          col.column_name.toLowerCase() === "email_address" ||
          col.column_name.toLowerCase() === "user_email",
      )

      if (!emailColumn) {
        return res.status(500).json({
          error: "Database Schema Error",
          details: "Could not find email column in users table",
          columns: tableStructure.rows.map((r) => r.column_name),
        })
      }

      const emailColumnName = emailColumn.column_name
      console.log(`Found email column: ${emailColumnName}`)

      // Find user by email using the correct column name
      const result = await pool.query(`SELECT * FROM users WHERE ${emailColumnName} = $1`, [email])

      if (result.rows.length === 0) {
        console.log("User not found:", email)
        return res.status(401).json({ error: "Invalid credentials" })
      }

      const user = result.rows[0]

      // Find the password column name
      const passwordColumn = tableStructure.rows.find(
        (col) =>
          col.column_name.toLowerCase().includes("password") || col.column_name.toLowerCase() === "user_password",
      )

      if (!passwordColumn) {
        return res.status(500).json({
          error: "Database Schema Error",
          details: "Could not find password column in users table",
        })
      }

      const passwordColumnName = passwordColumn.column_name
      console.log(`Found password column: ${passwordColumnName}`)

      console.log("Comparing passwords...")

      // Compare passwords using the correct column name
      const isMatch = await bcrypt.compare(password, user[passwordColumnName])

      if (!isMatch) {
        console.log("Password does not match for user:", email)
        return res.status(401).json({ error: "Invalid credentials" })
      }

      console.log("Creating JWT token...")

      // Find the full_name column name
      const fullNameColumn = tableStructure.rows.find(
        (col) =>
          col.column_name.toLowerCase().includes("name") ||
          col.column_name.toLowerCase() === "full_name" ||
          col.column_name.toLowerCase() === "username",
      )

      const fullNameColumnName = fullNameColumn ? fullNameColumn.column_name : null

      // Find the status column name
      const statusColumn = tableStructure.rows.find((col) => col.column_name.toLowerCase().includes("status"))

      const statusColumnName = statusColumn ? statusColumn.column_name : null

      // Create JWT token
      const jwtSecret = process.env.JWT_SECRET || "your-default-secret-key"
      console.log("Using JWT secret:", jwtSecret ? "Secret is set" : "Using default secret")

      const token = jwt.sign({ id: user.id, email: user[emailColumnName] }, jwtSecret, { expiresIn: "1d" })

      console.log("User logged in successfully:", { id: user.id, email: user[emailColumnName] })

      // Prepare user object with dynamic column names
      const userResponse = {
        id: user.id,
        email: user[emailColumnName],
      }

      if (fullNameColumnName) {
        userResponse.fullName = user[fullNameColumnName]
      }

      if (statusColumnName) {
        userResponse.status = user[statusColumnName]
      }

      res.json({
        message: "Login successful",
        token,
        user: userResponse,
      })
    } catch (dbError) {
      console.error("Database error in login:", dbError)
      return res.status(500).json({
        error: "Database Error",
        details: dbError.message,
        query: "SELECT * FROM users",
      })
    }
  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    })
  }
})

