import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"

dotenv.config()

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "your_database",
  password: process.env.DB_PASSWORD || "your_password",
  port: process.env.DB_PORT || 5432,
})

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database:", err)
  } else {
    console.log("Database connected:", res.rows[0].now)
  }
})

// Establish connection
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database:", err)
  } else {
    console.log("Successfully connected to the database")
    done()
  }
})

// Check if the resources tables exist
pool.checkResourcesTables = async function () {
  try {
    const { rows } = await this.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
      table_name IN ('resources', 'resource_items', 'quiz_questions', 'quiz_options')
    `)

    // All tables should exist
    return rows.length === 4
  } catch (error) {
    console.error("Error checking resource tables:", error)
    return false
  }
}

// Create resources tables if they don't exist
pool.createResourcesTables = async function () {
  try {
    // Create resources table
    await this.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        url VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create resource_items table
    await this.query(`
      CREATE TABLE IF NOT EXISTS resource_items (
        id SERIAL PRIMARY KEY,
        resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
        item_text TEXT NOT NULL,
        display_order INTEGER NOT NULL
      )
    `)

    // Create quiz_questions table
    await this.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_answer TEXT NOT NULL,
        category VARCHAR(100),
        difficulty VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create quiz_options table
    await this.query(`
      CREATE TABLE IF NOT EXISTS quiz_options (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
        option_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        display_order INTEGER NOT NULL
      )
    `)

    console.log("Resource tables created successfully")
    return true
  } catch (error) {
    console.error("Error creating resource tables:", error)
    throw error
  }
}

// Check if testimonials tables exist
pool.checkTestimonialsTables = async function () {
  try {
    const { rows } = await this.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
      table_name IN ('testimonials', 'testimonial_comments', 'testimonial_likes')
    `)

    // All tables should exist
    return rows.length === 3
  } catch (error) {
    console.error("Error checking testimonials tables:", error)
    return false
  }
}

// Create testimonials tables if they don't exist
pool.createTestimonialsTables = async function () {
  try {
    // Create testimonials table
    await this.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create testimonial_comments table
    await this.query(`
      CREATE TABLE IF NOT EXISTS testimonial_comments (
        id SERIAL PRIMARY KEY,
        testimonial_id INTEGER REFERENCES testimonials(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create testimonial_likes table
    await this.query(`
      CREATE TABLE IF NOT EXISTS testimonial_likes (
        id SERIAL PRIMARY KEY,
        testimonial_id INTEGER REFERENCES testimonials(id) ON DELETE CASCADE,
        username VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(testimonial_id, username)
      )
    `)

    // Add indexes for better performance
    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_testimonials_author ON testimonials(author);
      CREATE INDEX IF NOT EXISTS idx_testimonial_comments_testimonial_id ON testimonial_comments(testimonial_id);
      CREATE INDEX IF NOT EXISTS idx_testimonial_comments_author ON testimonial_comments(author);
      CREATE INDEX IF NOT EXISTS idx_testimonial_likes_testimonial_id ON testimonial_likes(testimonial_id);
      CREATE INDEX IF NOT EXISTS idx_testimonial_likes_username ON testimonial_likes(username);
    `)

    console.log("Testimonials tables created successfully")
    return true
  } catch (error) {
    console.error("Error creating testimonials tables:", error)
    throw error
  }
}

// Check if the reports table exists
pool.checkReportsTable = async function () {
  try {
    const { rows } = await this.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND 
        table_name = 'reports'
      );
    `)

    return rows[0].exists
  } catch (error) {
    console.error("Error checking reports table:", error)
    return false
  }
}

// Create reports tables if they don't exist
pool.createReportsTable = async function () {
  try {
    // Create reports table with enhanced fields
    await this.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        incident_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        incident_date DATE NOT NULL,
        location VARCHAR(255) NOT NULL,
        severity_level INTEGER DEFAULT 3,
        evidence_path VARCHAR(255),
        police_notified VARCHAR(10) DEFAULT 'no',
        is_anonymous BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'pending',
        has_evidence BOOLEAN DEFAULT false,
        assigned_to_id INTEGER,
        assigned_to_name VARCHAR(255),
        assigned_at TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create report_comments table if it doesn't exist
    await this.query(`
      CREATE TABLE IF NOT EXISTS report_comments (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        user_id INTEGER,
        user_name VARCHAR(255),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create report_evidence table if it doesn't exist
    await this.query(`
      CREATE TABLE IF NOT EXISTS report_evidence (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        evidence_path VARCHAR(255) NOT NULL,
        evidence_type VARCHAR(100),
        evidence_description TEXT,
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Add indexes for better performance
    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_incident_type ON reports(incident_type);
      CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
      CREATE INDEX IF NOT EXISTS idx_reports_email ON reports(email);
      CREATE INDEX IF NOT EXISTS idx_report_evidence_report_id ON report_evidence(report_id);
      CREATE INDEX IF NOT EXISTS idx_report_comments_report_id ON report_comments(report_id);
    `)

    console.log("Reports tables created successfully")
    return true
  } catch (error) {
    console.error("Error creating reports tables:", error)
    throw error
  }
}

// Check if a report exists by ID
pool.checkReportExists = async function (reportId) {
  try {
    const { rows } = await this.query(
      `
      SELECT EXISTS (
        SELECT FROM reports 
        WHERE id = $1
      );
    `,
      [reportId],
    )

    return rows[0].exists
  } catch (error) {
    console.error("Error checking if report exists:", error)
    return false
  }
}

// Initialize all tables on startup
pool.initializeTables = async function () {
  try {
    // Check and create resources tables
    const resourcesExist = await this.checkResourcesTables()
    if (!resourcesExist) {
      await this.createResourcesTables()
    }

    // Check and create testimonials tables
    const testimonialsExist = await this.checkTestimonialsTables()
    if (!testimonialsExist) {
      await this.createTestimonialsTables()
    }

    // Check and create reports tables
    const reportsExist = await this.checkReportsTable()
    if (!reportsExist) {
      await this.createReportsTable()
    }

    console.log("All tables initialized successfully")
  } catch (error) {
    console.error("Error initializing tables:", error)
  }
}

// Initialize tables when the application starts
pool.initializeTables().catch((err) => {
  console.error("Failed to initialize tables:", err)
})
// Add these functions to your existing db.js file

// Assuming 'pool' is defined elsewhere in your db.js file
// For example: const pool = require('./db'); 

// Check if the users tables exist
pool.checkUsersTables = async function () {
  try {
    const { rows } = await this.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
      table_name IN ('users', 'user_sessions')
    `)

    // Both tables should exist
    return rows.length === 2
  } catch (error) {
    console.error("Error checking users tables:", error)
    return false
  }
}

// Create users tables if they don't exist
pool.createUsersTables = async function () {
  try {
    // Create users table
    await this.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create user_sessions table
    await this.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Add indexes for better performance
    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
    `)

    console.log("Users tables created successfully")
    return true
  } catch (error) {
    console.error("Error creating users tables:", error)
    throw error
  }
}

// Add these functions to your database utility file (db.js)

// Check if user_sessions table exists
pool.checkUserSessionsTable = async function() {
  try {
    const result = await this.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_sessions'
      );
    `);
    
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking user_sessions table:', error);
    return false;
  }
};

// Create user_sessions table if it doesn't exist
pool.createUserSessionsTable = async function() {
  try {
    await this.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    console.log('user_sessions table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating user_sessions table:', error);
    return false;
  }
};

// Get all users with pagination
pool.getAllUsers = async function(page = 1, limit = 100) {
  try {
    const offset = (page - 1) * limit;
    
    const result = await this.query(`
      SELECT 
        id, 
        full_name, 
        email, 
        status, 
        created_at, 
        last_login, 
        registration_time
      FROM users
      ORDER BY id
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    // Get total count for pagination
    const countResult = await this.query(`SELECT COUNT(*) FROM users`);
    const totalCount = parseInt(countResult.rows[0].count);
    
    return {
      users: result.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error getting all users:', error);
    return { users: [], pagination: { total: 0, page, limit, pages: 0 } };
  }
};

// Get user by ID
pool.getUserById = async function(userId) {
  try {
    const result = await this.query(`
      SELECT 
        id, 
        full_name, 
        email, 
        status, 
        created_at, 
        last_login, 
        registration_time
      FROM users
      WHERE id = $1
    `, [userId]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error getting user by ID ${userId}:`, error);
    return null;
  }
};

// Get user by email
pool.getUserByEmail = async function(email) {
  try {
    const { rows } = await this.query(`
      SELECT * FROM users WHERE email = $1
    `, [email])
    
    return rows[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Get user by username
pool.getUserByUsername = async function(username) {
  try {
    const { rows } = await this.query(`
      SELECT * FROM users WHERE username = $1
    `, [username])
    
    return rows[0] || null
  } catch (error) {
    console.error("Error getting user by username:", error)
    return null
  }
}

// Get user sessions
pool.getUserSessions = async function(userId) {
  try {
    // Check if table exists
    const tableExists = await this.checkUserSessionsTable();
    if (!tableExists) {
      await this.createUserSessionsTable();
      return [];
    }
    
    const result = await this.query(`
      SELECT 
        id, 
        user_id, 
        token, 
        ip_address, 
        user_agent, 
        created_at, 
        expires_at
      FROM user_sessions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);
    
    return result.rows;
  } catch (error) {
    console.error(`Error getting sessions for user ${userId}:`, error);
    return [];
  }
};

// Create a user session
pool.createUserSession = async function(userId, token, ipAddress, userAgent, expiresAt) {
  try {
    // Check if table exists
    const tableExists = await this.checkUserSessionsTable();
    if (!tableExists) {
      await this.createUserSessionsTable();
    }
    
    const result = await this.query(`
      INSERT INTO user_sessions (
        user_id, 
        token, 
        ip_address, 
        user_agent, 
        expires_at
      ) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [userId, token, ipAddress, userAgent, expiresAt]);
    
    return result.rows[0].id;
  } catch (error) {
    console.error(`Error creating session for user ${userId}:`, error);
    return null;
  }
};

// Delete a user session
pool.deleteUserSession = async function(sessionId) {
  try {
    const result = await this.query(`
      DELETE FROM user_sessions
      WHERE id = $1
      RETURNING id
    `, [sessionId]);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error(`Error deleting session ${sessionId}:`, error);
    return false;
  }
};

// Delete all sessions for a user
pool.deleteAllUserSessions = async function(userId) {
  try {
    await this.query(`
      DELETE FROM user_sessions WHERE user_id = $1
    `, [userId])
    
    return true
  } catch (error) {
    console.error("Error deleting all user sessions:", error)
    return false
  }
}

// Update user status
pool.updateUserStatus = async function(userId, isActive) {
  try {
    const status = isActive ? 'active' : 'inactive';
    
    const result = await this.query(`
      UPDATE users
      SET status = $1
      WHERE id = $2
      RETURNING id, full_name, email, status
    `, [status, userId]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error);
    return null;
  }
};

// Update user role
pool.updateUserRole = async function(userId, isAdmin) {
  try {
    const status = isAdmin ? 'admin' : 'active';
    
    const result = await this.query(`
      UPDATE users
      SET status = $1
      WHERE id = $2
      RETURNING id, full_name, email, status
    `, [status, userId]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    return null;
  }
};

// Update the initializeTables function to include users tables
const originalInitializeTables = pool.initializeTables
pool.initializeTables = async function() {
  // Call the original function first
  await originalInitializeTables.call(this)
  
  // Check and create users tables
  const usersExist = await this.checkUsersTables()
  if (!usersExist) {
    await this.createUsersTables()
  }
  
  console.log("All tables including users tables initialized successfully")
}

console.log("Users tables functions added to pool")
export default pool
