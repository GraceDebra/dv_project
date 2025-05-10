// config/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'your_database',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected:', res.rows[0].now);
  }
});

// Check if the resources tables exist
pool.checkResourcesTables = async function() {
  try {
    const { rows } = await this.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
      table_name IN ('resources', 'resource_items', 'quiz_questions', 'quiz_options')
    `);
    
    // All tables should exist
    return rows.length === 4;
  } catch (error) {
    console.error('Error checking resource tables:', error);
    return false;
  }
};

// Create resources tables if they don't exist
pool.createResourcesTables = async function() {
  try {
    // Create resources table
    await this.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        color VARCHAR(50) NOT NULL
      )
    `);
    
    // Create resource_items table
    await this.query(`
      CREATE TABLE IF NOT EXISTS resource_items (
        id SERIAL PRIMARY KEY,
        resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
        item_text TEXT NOT NULL,
        display_order INTEGER NOT NULL
      )
    `);
    
    // Create quiz_questions table
    await this.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        question_text TEXT NOT NULL
      )
    `);
    
    // Create quiz_options table
    await this.query(`
      CREATE TABLE IF NOT EXISTS quiz_options (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
        option_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        display_order INTEGER NOT NULL
      )
    `);
    
    console.log("Resource tables created successfully");
    return true;
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

export default pool;
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database:", err)
  } else {
    console.log("Successfully connected to the database")
    done()
  }
})