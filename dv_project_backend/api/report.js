import pool from "../config/db.js"

// Get all reports (admin only)
const getAll = async (req, res) => {
  try {
    // Check if user is authenticated as admin
    // This is a simplified check - you should implement proper admin authentication
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const result = await pool.query(`
      SELECT * FROM reports
      ORDER BY created_at DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching reports:", error)
    res.status(500).json({ error: "Failed to fetch reports", details: error.message })
  }
}

// Get a single report by ID
const getById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `
      SELECT * FROM reports
      WHERE id = $1
    `,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching report:", error)
    res.status(500).json({ error: "Failed to fetch report", details: error.message })
  }
}

// Create a new report
const create = async (req, res) => {
  try {
    console.log("Received report data:", req.body)

    const { name, email, incidentType, description, date, location, severityLevel, policeNotified, isAnonymous } =
      req.body

    // Validate required fields
    if (!incidentType || !description || !date || !location) {
      console.log("Missing required fields:", { incidentType, description, date, location })
      return res.status(400).json({ error: "Required fields missing" })
    }

    // Check if reports table exists, create if not
    try {
      await pool.query(`
        SELECT 1 FROM reports LIMIT 1
      `)
      console.log("Reports table exists")
    } catch (tableError) {
      console.log("Reports table might not exist, creating it...")
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            incident_type VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            incident_date DATE NOT NULL,
            location VARCHAR(255) NOT NULL,
            severity_level INTEGER DEFAULT 3,
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
        console.log("Reports table created successfully")
      } catch (createError) {
        console.error("Error creating reports table:", createError)
        return res.status(500).json({ error: "Failed to create reports table", details: createError.message })
      }
    }

    console.log("Inserting report into database with values:", {
      name: isAnonymous ? null : name,
      email: isAnonymous ? null : email,
      incidentType,
      description,
      date,
      location,
      severityLevel: severityLevel || 3,
      policeNotified: policeNotified || "no",
      isAnonymous: isAnonymous || false,
    })

    // Insert the report into the database
    try {
      const result = await pool.query(
        `
        INSERT INTO reports (
          name, 
          email, 
          incident_type, 
          description, 
          incident_date, 
          location, 
          severity_level, 
          police_notified, 
          is_anonymous,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING *
      `,
        [
          isAnonymous ? null : name,
          isAnonymous ? null : email,
          incidentType,
          description,
          date,
          location,
          severityLevel || 3,
          policeNotified || "no",
          isAnonymous || false,
          "pending",
        ],
      )

      console.log("Report created successfully:", result.rows[0])

      res.status(201).json({
        message: "Report submitted successfully",
        report: result.rows[0],
      })
    } catch (insertError) {
      console.error("Error inserting report:", insertError)
      return res.status(500).json({ error: "Failed to insert report", details: insertError.message })
    }
  } catch (error) {
    console.error("Error creating report:", error)
    res.status(500).json({ error: "Failed to submit report", details: error.message })
  }
}

// Update report status (admin only)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validate status
    const validStatuses = ["pending", "investigating", "resolved", "closed"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    // Update the report
    const result = await pool.query(
      `
      UPDATE reports
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `,
      [status, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json({
      message: "Report status updated",
      report: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating report:", error)
    res.status(500).json({ error: "Failed to update report", details: error.message })
  }
}

// Get reports by user email
const getByUser = async (req, res) => {
  try {
    const { email } = req.params

    const result = await pool.query(
      `
      SELECT * FROM reports
      WHERE email = $1
      ORDER BY created_at DESC
    `,
      [email],
    )

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching user reports:", error)
    res.status(500).json({ error: "Failed to fetch reports", details: error.message })
  }
}

// Get reports by status
const getByStatus = async (req, res) => {
  try {
    const { status } = req.params

    // Validate status
    const validStatuses = ["pending", "investigating", "resolved", "closed"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const result = await pool.query(
      `
      SELECT * FROM reports
      WHERE status = $1
      ORDER BY created_at DESC
    `,
      [status],
    )

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching reports by status:", error)
    res.status(500).json({ error: "Failed to fetch reports", details: error.message })
  }
}

// Get report statistics by type
const getStatsByType = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT incident_type, COUNT(*) as count
      FROM reports
      GROUP BY incident_type
      ORDER BY count DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching report statistics by type:", error)
    res.status(500).json({ error: "Failed to fetch report statistics", details: error.message })
  }
}

// Get report statistics by status
const getStatsByStatus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM reports
      GROUP BY status
      ORDER BY count DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching report statistics by status:", error)
    res.status(500).json({ error: "Failed to fetch report statistics", details: error.message })
  }
}

// Add a comment to a report
const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { comment, userId, userName } = req.body

    if (!comment) {
      return res.status(400).json({ error: "Comment text is required" })
    }

    // Check if report exists
    const reportCheck = await pool.query(
      `
      SELECT id FROM reports WHERE id = $1
    `,
      [id],
    )

    if (reportCheck.rows.length === 0) {
      return res.status(404).json({ error: "Report not found" })
    }

    // Check if report_comments table exists, create if not
    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_comments (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        user_id INTEGER,
        user_name VARCHAR(255),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Insert the comment
    const result = await pool.query(
      `
      INSERT INTO report_comments (report_id, user_id, user_name, comment, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `,
      [id, userId || null, userName || "Anonymous", comment],
    )

    res.status(201).json({
      message: "Comment added successfully",
      comment: result.rows[0],
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).json({ error: "Failed to add comment", details: error.message })
  }
}

// Get all comments for a report
const getComments = async (req, res) => {
  try {
    const { id } = req.params

    // Check if report exists
    const reportCheck = await pool.query(
      `
      SELECT id FROM reports WHERE id = $1
    `,
      [id],
    )

    if (reportCheck.rows.length === 0) {
      return res.status(404).json({ error: "Report not found" })
    }

    // Check if report_comments table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND 
        table_name = 'report_comments'
      );
    `)

    if (!tableCheck.rows[0].exists) {
      return res.json([]) // Return empty array if table doesn't exist yet
    }

    // Get comments
    const result = await pool.query(
      `
      SELECT * FROM report_comments
      WHERE report_id = $1
      ORDER BY created_at ASC
    `,
      [id],
    )

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching comments:", error)
    res.status(500).json({ error: "Failed to fetch comments", details: error.message })
  }
}

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params

    // Check if comment exists and belongs to the report
    const commentCheck = await pool.query(
      `
      SELECT * FROM report_comments
      WHERE id = $1 AND report_id = $2
    `,
      [commentId, id],
    )

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" })
    }

    // Delete the comment
    await pool.query(
      `
      DELETE FROM report_comments
      WHERE id = $1
    `,
      [commentId],
    )

    res.json({
      message: "Comment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting comment:", error)
    res.status(500).json({ error: "Failed to delete comment", details: error.message })
  }
}

// Assign a report to a staff member
const assignReport = async (req, res) => {
  try {
    const { id } = req.params
    const { staffId, staffName } = req.body

    if (!staffId || !staffName) {
      return res.status(400).json({ error: "Staff ID and name are required" })
    }

    // Check if assigned_to column exists, add if not
    const columnCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'reports' AND 
        column_name = 'assigned_to_id'
      );
    `)

    if (!columnCheck.rows[0].exists) {
      await pool.query(`
        ALTER TABLE reports 
        ADD COLUMN assigned_to_id INTEGER,
        ADD COLUMN assigned_to_name VARCHAR(255),
        ADD COLUMN assigned_at TIMESTAMP
      `)
    }

    // Update the report
    const result = await pool.query(
      `
      UPDATE reports
      SET assigned_to_id = $1, assigned_to_name = $2, assigned_at = NOW(), updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `,
      [staffId, staffName, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json({
      message: "Report assigned successfully",
      report: result.rows[0],
    })
  } catch (error) {
    console.error("Error assigning report:", error)
    res.status(500).json({ error: "Failed to assign report", details: error.message })
  }
}

// Upload evidence for a report
const uploadEvidence = async (req, res) => {
  try {
    const { id } = req.params
    const { evidencePath, evidenceType, evidenceDescription } = req.body

    if (!evidencePath) {
      return res.status(400).json({ error: "Evidence path is required" })
    }

    // Check if evidence_items table exists, create if not
    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_evidence (
        id SERIAL PRIMARY KEY,
        report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
        evidence_path VARCHAR(255) NOT NULL,
        evidence_type VARCHAR(100),
        evidence_description TEXT,
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Insert the evidence
    const result = await pool.query(
      `
      INSERT INTO report_evidence (report_id, evidence_path, evidence_type, evidence_description, uploaded_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `,
      [id, evidencePath, evidenceType || "file", evidenceDescription || ""],
    )

    // Update the report to indicate it has evidence
    await pool.query(
      `
      UPDATE reports
      SET has_evidence = true, updated_at = NOW()
      WHERE id = $1
    `,
      [id],
    )

    res.status(201).json({
      message: "Evidence uploaded successfully",
      evidence: result.rows[0],
    })
  } catch (error) {
    console.error("Error uploading evidence:", error)
    res.status(500).json({ error: "Failed to upload evidence", details: error.message })
  }
}

export default {
  getAll,
  getById,
  create,
  updateStatus,
  getByUser,
  getByStatus,
  getStatsByType,
  getStatsByStatus,
  addComment,
  getComments,
  deleteComment,
  assignReport,
  uploadEvidence,
}
