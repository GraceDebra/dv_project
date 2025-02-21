import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./config/db.js"; // Import the database connection

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON parsing

// ✅ Test Route: Check DB Connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW();");
    res.json({ message: "Connected to PostgreSQL!", time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed!" });
  }
});

// ✅ User Registration Route
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate email format using regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password length (at least 6 characters)
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    // Check if email already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email", 
      [fullName, email, hashedPassword]
    );

    // Respond with the new user's data (excluding password)
    const newUser = result.rows[0];
    res.json({ 
      message: "Registered successfully!", 
      user: { id: newUser.id, fullName: newUser.full_name, email: newUser.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed!" });
  }
});

// ✅ User Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Both email and password are required" });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
console.log("✅ Server is running!");
