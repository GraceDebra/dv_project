import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import pool from "./config/db.js"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Reduce verbosity in server.js
// Replace the detailed request logging middleware with a simpler version
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// More permissive CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Parse JSON request bodies
app.use(express.json())

// Root Route with more detailed response
app.get("/", (req, res) => {
  try {
    res.send("✅ API is running!")
  } catch (error) {
    console.error("Error in root route:", error)
    res.status(500).json({
      status: "ERROR",
      message: "Server error",
      error: error.message,
    })
  }
})

// Test Database Route with more detailed response
app.get("/test-db", (req, res) => {
  try {
    console.log("Testing database connection...")

    // Test database connection
    pool.query("SELECT NOW()", (err, result) => {
      if (err) {
        console.error("Database connection error:", err)
        return res.status(500).json({
          status: "ERROR",
          message: "Database connection failed",
          error: err.message,
          timestamp: new Date().toISOString(),
        })
      }

      console.log("Database connection successful:", result.rows[0].now)

      res.json({
        status: "OK",
        message: "Server is running and database is connected",
        dbTimestamp: result.rows[0].now,
        serverTimestamp: new Date().toISOString(),
      })
    })
  } catch (error) {
    console.error("Server error in test-db route:", error)
    res.status(500).json({
      status: "ERROR",
      message: "Server error",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// User Registration Route with improved error handling
app.post("/register", async (req, res) => {
  try {
    console.log("Received registration request body:", req.body)

    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      console.log("Missing required fields:", { fullName: !!fullName, email: !!email, password: !!password })
      return res.status(400).json({ error: "All fields are required" })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email)
      return res.status(400).json({ error: "Invalid email format" })
    }

    console.log("Checking if user already exists...")

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

      // Check if user already exists using the correct column name
      const existingUser = await pool.query(`SELECT * FROM users WHERE ${emailColumnName} = $1`, [email])

      if (existingUser.rows.length > 0) {
        console.log("User already exists:", email)
        return res.status(400).json({ error: "User with this email already exists" })
      }
    } catch (dbError) {
      console.error("Database error checking existing user:", dbError)
      return res.status(500).json({
        error: "Database Error",
        details: dbError.message,
        query: "SELECT * FROM users WHERE email = $1",
      })
    }

    console.log("Hashing password...")

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    console.log("Inserting new user into database...")

    try {
      // First, get the column names to use in the INSERT statement
      const tableStructure = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND 
        column_name NOT IN ('id', 'created_at', 'updated_at');
      `)

      // Find the appropriate column names
      const columns = tableStructure.rows
      const fullNameColumn =
        columns.find(
          (col) =>
            col.column_name.toLowerCase().includes("name") ||
            col.column_name.toLowerCase() === "full_name" ||
            col.column_name.toLowerCase() === "username",
        )?.column_name || "full_name"

      const emailColumn =
        columns.find(
          (col) =>
            col.column_name.toLowerCase().includes("email") ||
            col.column_name.toLowerCase() === "email_address" ||
            col.column_name.toLowerCase() === "user_email",
        )?.column_name || "email"

      const passwordColumn =
        columns.find(
          (col) =>
            col.column_name.toLowerCase().includes("password") || col.column_name.toLowerCase() === "user_password",
        )?.column_name || "password"

      const statusColumn = columns.find((col) => col.column_name.toLowerCase().includes("status"))?.column_name

      console.log("Using columns for insert:", {
        fullNameColumn,
        emailColumn,
        passwordColumn,
        statusColumn,
      })

      // Build the INSERT query dynamically based on available columns
      let query = `INSERT INTO users (${fullNameColumn}, ${emailColumn}, ${passwordColumn}`
      const values = [fullName, email, hashedPassword]
      let placeholders = "$1, $2, $3"
      let index = 4

      if (statusColumn) {
        query += `, ${statusColumn}`
        values.push("registered")
        placeholders += `, $${index}`
        index++
      }

      query += `) VALUES (${placeholders}) RETURNING *`

      console.log("Final INSERT query:", query)

      const result = await pool.query(query, values)

      console.log("User registered successfully:", result.rows[0])

      res.status(201).json({
        message: "User registered successfully",
        user: result.rows[0],
      })
    } catch (insertError) {
      console.error("Database error inserting new user:", insertError)
      return res.status(500).json({
        error: "Database Error",
        details: insertError.message,
        query: "INSERT INTO users",
      })
    }
  } catch (error) {
    console.error("Full Registration Error:", error)
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    })
  }
})

// Simplify the login route response
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // First, let's check the actual table structure
    try {
      const tableStructure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
      `)

      // Find the email column (it might have a different name)
      const emailColumn = tableStructure.rows.find(
        (col) =>
          col.column_name.toLowerCase().includes("email") ||
          col.column_name.toLowerCase() === "email_address" ||
          col.column_name.toLowerCase() === "user_email",
      )

      if (!emailColumn) {
        return res.status(500).json({ error: "Database schema error" })
      }

      const emailColumnName = emailColumn.column_name

      // Find user by email using the correct column name
      const result = await pool.query(`SELECT * FROM users WHERE ${emailColumnName} = $1`, [email])

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      const user = result.rows[0]

      // Find the password column name
      const passwordColumn = tableStructure.rows.find(
        (col) =>
          col.column_name.toLowerCase().includes("password") || col.column_name.toLowerCase() === "user_password",
      )

      if (!passwordColumn) {
        return res.status(500).json({ error: "Database schema error" })
      }

      const passwordColumnName = passwordColumn.column_name

      // Compare passwords using the correct column name
      const isMatch = await bcrypt.compare(password, user[passwordColumnName])

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Create JWT token
      const jwtSecret = process.env.JWT_SECRET || "your-default-secret-key"

      const token = jwt.sign({ id: user.id, email: user[emailColumnName] }, jwtSecret, { expiresIn: "1d" })

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
        redirectUrl: "/dashboard", // Add redirect URL to response
      })
    } catch (dbError) {
      console.error("Database error:", dbError.message)
      return res.status(500).json({ error: "Database error" })
    }
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Check database tables route - useful for debugging
app.get("/check-tables", async (req, res) => {
  try {
    console.log("Checking database tables...")

    // Query to list all tables in the database
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    const tablesResult = await pool.query(tablesQuery)

    // If users table exists, get its structure
    let usersStructure = null
    if (tablesResult.rows.some((row) => row.table_name === "users")) {
      const structureQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `

      const structureResult = await pool.query(structureQuery)
      usersStructure = structureResult.rows
    }

    res.json({
      tables: tablesResult.rows,
      usersTable: usersStructure,
    })
  } catch (error) {
    console.error("Error checking tables:", error)
    res.status(500).json({
      error: "Database Error",
      message: error.message,
    })
  }
})

// Add global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err)
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  })
})

// In server.js, add explicit host binding and better logging
const PORT = process.env.PORT || 8081
const HOST = "0.0.0.0" // Bind to all network interfaces

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`)
  console.log(`Test the API with: curl http://localhost:${PORT}/test-db`)
  console.log("Environment:", process.env.NODE_ENV || "development")

  // Log important environment variables (without values for security)
  console.log("Environment variables:")
  console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set")
  console.log("- PORT:", process.env.PORT || "8081 (default)")
  console.log("- DB_USER:", process.env.DB_USER ? "Set" : "Not set")
  console.log("- DB_HOST:", process.env.DB_HOST ? "Set" : "Not set")
  console.log("- DB_NAME:", process.env.DB_NAME ? "Set" : "Not set")
  console.log("- DB_PASSWORD:", process.env.DB_PASSWORD ? "Set" : "Not set (using default)")
  console.log("- DB_PORT:", process.env.DB_PORT || "5432 (default)")
})

// Add proper error handling for the server
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Please try a different port.`)
  } else {
    console.error("Server error:", error)
  }
  process.exit(1)
})

