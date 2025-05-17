import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import pool from "./config/db.js"
import resourcesAPI from "./api/resources.js" // Import the resources API
import quizQuestionsAPI from "./api/quiz-questions.js" // Import the quiz questions API
import testimonialsAPI from "./api/testimonials.js" // Import the testimonials API
import reportsAPI from "./api/report.js"

// Load environment variables
dotenv.config()

/**
 * Database Schema for Users Table:
 *
 * -- CreateTable
 * CREATE TABLE "users" (
 *     "id" SERIAL NOT NULL,
 *     "full_name" VARCHAR(100) NOT NULL,
 *     "email" VARCHAR(100) NOT NULL,
 *     "password" TEXT NOT NULL,
 *     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
 *     "status" VARCHAR(20) DEFAULT 'inactive',
 *     "last_login" TIMESTAMP(6),
 *     "registration_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
 *
 *     CONSTRAINT "users_pkey" PRIMARY KEY ("id")
 * );
 *
 * -- CreateIndex
 * CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
 */

// Create Express app
const app = express()

// Reduce verbosity in server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Replace your current CORS configuration with this to allow DELETE and PUT methods:
app.use(
  cors({
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"], // Added DELETE and PUT methods
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

// Resources API routes
app.get("/services/resources", resourcesAPI.getAll)
app.post("/services/resources", resourcesAPI.create)

// Quiz Questions API routes
app.get("/services/quiz-questions", quizQuestionsAPI.getAll)
app.post("/services/quiz-questions", quizQuestionsAPI.create)

// Testimonials API routes - MOVED HERE after app initialization
app.get("/services/testimonials", testimonialsAPI.getAll)
app.post("/services/testimonials", testimonialsAPI.create)
app.delete("/services/testimonials/:id", testimonialsAPI.remove)
app.post("/services/testimonials/:id/comments", testimonialsAPI.addComment)
app.delete("/services/testimonials/:id/comments/:commentId", testimonialsAPI.removeComment)

// Add this route to your server.js file after the other testimonials routes
app.get("/services/testimonials/user/:username", testimonialsAPI.getUserHistory)

// Reports API routes
app.get("/services/reports", reportsAPI.getAll)
app.get("/services/reports/:id", reportsAPI.getById)
app.post("/services/reports", reportsAPI.create)
app.put("/services/reports/:id/status", reportsAPI.updateStatus)
app.get("/services/reports/user/:email", reportsAPI.getByUser)
app.get("/services/reports/status/:status", reportsAPI.getByStatus)
app.get("/services/reports/stats/type", reportsAPI.getStatsByType)
app.get("/services/reports/stats/status", reportsAPI.getStatsByStatus)
app.post("/services/reports/:id/comments", reportsAPI.addComment)
app.get("/services/reports/:id/comments", reportsAPI.getComments)
app.delete("/services/reports/:id/comments/:commentId", reportsAPI.deleteComment)
app.put("/services/reports/:id/assign", reportsAPI.assignReport)
app.post("/services/reports/:id/evidence", reportsAPI.uploadEvidence)

// Users API routes - these match the schema defined above
app.get("/services/users", async (req, res) => {
  try {
    // Get all users with sensitive information excluded
    const { rows: users } = await pool.query(`
      SELECT id, full_name, email, status, created_at, last_login, registration_time
      FROM users
      ORDER BY id
    `)

    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Delete a user
app.delete("/services/users/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Delete the user
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ message: "User deleted successfully", id })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Update user status
app.put("/services/users/:id/status", async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !["active", "inactive", "admin"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" })
    }

    const result = await pool.query(
      `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, full_name, email, status`,
      [status, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "User status updated successfully",
      user: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating user status:", error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Get user by ID
app.get("/services/users/:id", async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `
      SELECT id, full_name, email, status, created_at, last_login, registration_time
      FROM users 
      WHERE id = $1
    `,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Add a new route to verify user authentication
app.get("/services/auth/verify", (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(401).json({ authenticated: false, message: "No token provided" })
    }

    // Verify the token (this is a simplified example)
    // In a real application, you would verify against your JWT secret
    try {
      const jwtSecret = process.env.JWT_SECRET || "your-default-secret-key"
      const decoded = jwt.verify(token, jwtSecret)

      return res.json({
        authenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
        },
      })
    } catch (tokenError) {
      return res.status(401).json({ authenticated: false, message: "Invalid token" })
    }
  } catch (error) {
    console.error("Error verifying authentication:", error)
    res.status(500).json({ error: "Internal server error", details: error.message })
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

// Add these endpoints to your server.js file before the error handler

// Get all table names in the database
app.get("/services/db/tables", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `)

    res.json(rows)
  } catch (error) {
    console.error("Error fetching tables:", error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Get table structure (columns)
app.get("/services/db/tables/:tableName/structure", async (req, res) => {
  try {
    const { tableName } = req.params

    // Validate table name to prevent SQL injection
    const validTableNameRegex = /^[a-zA-Z0-9_]+$/
    if (!validTableNameRegex.test(tableName)) {
      return res.status(400).json({ error: "Invalid table name" })
    }

    const { rows } = await pool.query(
      `
      SELECT column_name, data_type, is_nullable, 
             column_default, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `,
      [tableName],
    )

    res.json(rows)
  } catch (error) {
    console.error(`Error fetching structure for table ${req.params.tableName}:`, error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Get data from a table
app.get("/services/db/tables/:tableName/data", async (req, res) => {
  try {
    const { tableName } = req.params
    const { limit = 100, offset = 0, orderBy = "id", direction = "ASC" } = req.query

    // Validate table name to prevent SQL injection
    const validTableNameRegex = /^[a-zA-Z0-9_]+$/
    if (!validTableNameRegex.test(tableName)) {
      return res.status(400).json({ error: "Invalid table name" })
    }

    // Validate orderBy column to prevent SQL injection
    const validColumnRegex = /^[a-zA-Z0-9_]+$/
    if (!validColumnRegex.test(orderBy)) {
      return res.status(400).json({ error: "Invalid order by column" })
    }

    // Validate direction
    const validDirection =
      direction.toUpperCase() === "ASC" || direction.toUpperCase() === "DESC" ? direction.toUpperCase() : "ASC"

    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) FROM "${tableName}"`)
    const total = Number.parseInt(countResult.rows[0].count)

    // Get data with pagination and ordering
    const { rows } = await pool.query(
      `
      SELECT * FROM "${tableName}"
      ORDER BY "${orderBy}" ${validDirection}
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    )

    res.json({
      data: rows,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        orderBy,
        direction: validDirection,
      },
    })
  } catch (error) {
    console.error(`Error fetching data for table ${req.params.tableName}:`, error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Get primary key for a table
app.get("/services/db/tables/:tableName/primary-key", async (req, res) => {
  try {
    const { tableName } = req.params

    // Validate table name to prevent SQL injection
    const validTableNameRegex = /^[a-zA-Z0-9_]+$/
    if (!validTableNameRegex.test(tableName)) {
      return res.status(400).json({ error: "Invalid table name" })
    }

    const { rows } = await pool.query(
      `
      SELECT a.attname as column_name
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = $1::regclass
      AND i.indisprimary;
    `,
      [tableName],
    )

    res.json(rows.length > 0 ? rows[0].column_name : "id")
  } catch (error) {
    console.error(`Error fetching primary key for table ${req.params.tableName}:`, error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Add these functions to your server.js file, right before the error handler
// These will ensure the user sessions functionality works properly

// Check if user_sessions table exists
app.get("/check-user-sessions-table", async (req, res) => {
  try {
    const exists = await pool.checkUserSessionsTable()

    if (!exists) {
      await pool.createUserSessionsTable()
      res.json({ message: "User sessions table created successfully" })
    } else {
      res.json({ message: "User sessions table already exists" })
    }
  } catch (error) {
    console.error("Error checking user sessions table:", error)
    res.status(500).json({ error: "Database error", details: error.message })
  }
})

// Get user sessions with improved error handling
app.get("/services/users/:id/sessions", async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id)

    // Check if user exists
    const userResult = await pool.query(
      `
      SELECT id FROM users WHERE id = $1
    `,
      [userId],
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if sessions table exists
    const tableExists = await pool.checkUserSessionsTable()
    if (!tableExists) {
      await pool.createUserSessionsTable()
      return res.json([])
    }

    // Get sessions
    const sessions = await pool.getUserSessions(userId)
    res.json(sessions)
  } catch (error) {
    console.error("Error fetching user sessions:", error)
    res.status(500).json({ error: "Failed to fetch user sessions", details: error.message })
  }
})

// Delete all sessions for a user
app.delete("/services/users/:id/sessions", async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id)

    // Check if user exists
    const userResult = await pool.query(
      `
      SELECT id FROM users WHERE id = $1
    `,
      [userId],
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if sessions table exists
    const tableExists = await pool.checkUserSessionsTable()
    if (!tableExists) {
      return res.status(404).json({ error: "Sessions table does not exist" })
    }

    const success = await pool.deleteAllUserSessions(userId)

    if (!success) {
      return res.status(500).json({ error: "Failed to delete user sessions" })
    }

    res.json({ message: "All sessions deleted successfully" })
  } catch (error) {
    console.error("Error deleting user sessions:", error)
    res.status(500).json({ error: "Failed to delete user sessions", details: error.message })
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
// Add these routes to your Express server

// Get all users
app.get("/services/users", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 100

    const result = await pool.getAllUsers(page, limit)
    res.json(result.users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Get user by ID
app.get("/services/users/:id", async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id)
    const user = await pool.getUserById(userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Update user status (active/inactive)
app.put("/services/users/:id/status", async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id)
    const { status } = req.body

    if (!status || !["active", "inactive", "admin"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" })
    }

    const isActive = status === "active"
    const user = await pool.updateUserStatus(userId, isActive)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error updating user status:", error)
    res.status(500).json({ error: "Failed to update user status", details: error.message })
  }
})

// Update user role (admin/user)
app.put("/services/users/:id/role", async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id)
    const { isAdmin } = req.body

    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({ error: "isAdmin must be a boolean" })
    }

    const user = await pool.updateUserRole(userId, isAdmin)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error updating user role:", error)
    res.status(500).json({ error: "Failed to update user role", details: error.message })
  }
})

// Create a session when a user logs in
// This middleware should be added after your existing login route
app.use((req, res, next) => {
  // Store the original send method
  const originalSend = res.send

  // Override the send method
  res.send = function (body) {
    // Only process for login route
    if (req.path === "/login" && req.method === "POST") {
      try {
        const responseData = JSON.parse(body)

        if (responseData.token && responseData.user && responseData.user.id) {
          // Create a session
          const token = responseData.token
          const userId = responseData.user.id
          const ipAddress = req.ip || req.connection.remoteAddress
          const userAgent = req.headers["user-agent"]

          // Set expiration to 1 day from now
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 1)

          // Create the session asynchronously (don't wait for it)
          pool
            .createUserSession(userId, token, ipAddress, userAgent, expiresAt)
            .then(() => console.log("Session created for user", userId))
            .catch((err) => console.error("Error creating session:", err))
        }
      } catch (error) {
        console.error("Error processing login response:", error)
      }
    }

    // Call the original send
    return originalSend.call(this, body)
  }

  next()
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

export default app
