import pool from "../config/db.js"

// Get all testimonials with their comments
const getAll = async (req, res) => {
  try {
    // First, get all testimonials
    const testimonialsResult = await pool.query(`
      SELECT t.*, COUNT(tl.id) AS like_count 
      FROM testimonials t
      LEFT JOIN testimonial_likes tl ON t.id = tl.testimonial_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `)

    const testimonials = testimonialsResult.rows

    // For each testimonial, get its comments
    for (const testimonial of testimonials) {
      const commentsResult = await pool.query(
        `SELECT * FROM testimonial_comments 
         WHERE testimonial_id = $1 
         ORDER BY created_at ASC`,
        [testimonial.id],
      )

      testimonial.comments = commentsResult.rows
    }

    res.json(testimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    res.status(500).json({ error: "Failed to fetch testimonials" })
  }
}

// Create a new testimonial
const create = async (req, res) => {
  try {
    const { content, author } = req.body

    if (!content || !author) {
      return res.status(400).json({ error: "Content and author are required" })
    }

    const result = await pool.query(
      `INSERT INTO testimonials (content, author) 
       VALUES ($1, $2) 
       RETURNING *`,
      [content, author],
    )

    // Initialize empty comments array for the new testimonial
    const newTestimonial = result.rows[0]
    newTestimonial.comments = []
    newTestimonial.like_count = 0

    res.status(201).json(newTestimonial)
  } catch (error) {
    console.error("Error creating testimonial:", error)
    res.status(500).json({ error: "Failed to create testimonial" })
  }
}

// Enhance the remove function with better security checks
const remove = async (req, res) => {
  try {
    const { id } = req.params
    const { author } = req.query // Get the author from query params for verification

    if (!author) {
      return res.status(400).json({ error: "Author is required for verification" })
    }

    // First verify this testimonial belongs to the author
    const testimonialCheck = await pool.query(`SELECT * FROM testimonials WHERE id = $1`, [id])

    if (testimonialCheck.rows.length === 0) {
      return res.status(404).json({ error: "Testimonial not found" })
    }

    // Check if the author matches - strict equality check
    if (testimonialCheck.rows[0].author !== author) {
      return res.status(403).json({
        error: "You can only delete your own testimonials",
        requestedBy: author,
        storyOwner: testimonialCheck.rows[0].author,
      })
    }

    // Delete the testimonial (comments will be deleted automatically due to CASCADE)
    const result = await pool.query(`DELETE FROM testimonials WHERE id = $1 RETURNING *`, [id])

    res.json({
      message: "Testimonial deleted successfully",
      deletedTestimonial: result.rows[0],
    })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    res.status(500).json({ error: "Failed to delete testimonial", details: error.message })
  }
}

// Add a comment to a testimonial
const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { content, author } = req.body

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" })
    }

    // Check if the testimonial exists
    const testimonialCheck = await pool.query(`SELECT * FROM testimonials WHERE id = $1`, [id])

    if (testimonialCheck.rows.length === 0) {
      return res.status(404).json({ error: "Testimonial not found" })
    }

    // Add the comment
    const result = await pool.query(
      `INSERT INTO testimonial_comments (testimonial_id, content, author) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [id, content, author || "Anonymous"],
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).json({ error: "Failed to add comment" })
  }
}

// Enhance the removeComment function with better security checks
const removeComment = async (req, res) => {
  try {
    const { id, commentId } = req.params
    const { author } = req.query // Get the author from query params for verification

    if (!author) {
      return res.status(400).json({ error: "Author is required for verification" })
    }

    // First verify this comment belongs to the author
    const commentCheck = await pool.query(`SELECT * FROM testimonial_comments WHERE id = $1 AND testimonial_id = $2`, [
      commentId,
      id,
    ])

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" })
    }

    // Check if the author matches - strict equality check
    if (commentCheck.rows[0].author !== author) {
      return res.status(403).json({
        error: "You can only delete your own comments",
        requestedBy: author,
        commentOwner: commentCheck.rows[0].author,
      })
    }

    // Delete the comment
    const result = await pool.query(
      `DELETE FROM testimonial_comments 
       WHERE id = $1 AND testimonial_id = $2 
       RETURNING *`,
      [commentId, id],
    )

    res.json({
      message: "Comment deleted successfully",
      deletedComment: result.rows[0],
    })
  } catch (error) {
    console.error("Error deleting comment:", error)
    res.status(500).json({ error: "Failed to delete comment", details: error.message })
  }
}

// Get user history (stories and comments)
const getUserHistory = async (req, res) => {
  try {
    const { username } = req.params

    if (!username) {
      return res.status(400).json({ error: "Username is required" })
    }

    // Get user's stories
    const storiesResult = await pool.query(
      `SELECT t.*, COUNT(tl.id) AS like_count 
       FROM testimonials t
       LEFT JOIN testimonial_likes tl ON t.id = tl.testimonial_id
       WHERE t.author = $1 
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [username],
    )

    // Get user's comments with story context
    const commentsResult = await pool.query(
      `SELECT c.*, t.content as story_content, t.author as story_author, t.id as testimonial_id
       FROM testimonial_comments c
       JOIN testimonials t ON c.testimonial_id = t.id
       WHERE c.author = $1 
       ORDER BY c.created_at DESC`,
      [username],
    )

    res.json({
      stories: storiesResult.rows,
      comments: commentsResult.rows,
    })
  } catch (error) {
    console.error("Error fetching user history:", error)
    res.status(500).json({ error: "Failed to fetch user history" })
  }
}

// Like or unlike a story
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username) {
      return res.status(400).json({ error: "Username is required" })
    }

    // Check if the testimonial exists
    const testimonialCheck = await pool.query(`SELECT * FROM testimonials WHERE id = $1`, [id])

    if (testimonialCheck.rows.length === 0) {
      return res.status(404).json({ error: "Testimonial not found" })
    }

    // Check if the user already liked this testimonial
    const likeCheck = await pool.query(`SELECT * FROM testimonial_likes WHERE testimonial_id = $1 AND username = $2`, [
      id,
      username,
    ])

    let action
    if (likeCheck.rows.length > 0) {
      // User already liked this testimonial, so unlike it
      await pool.query(`DELETE FROM testimonial_likes WHERE testimonial_id = $1 AND username = $2`, [id, username])
      action = "unliked"
    } else {
      // User hasn't liked this testimonial yet, so like it
      await pool.query(`INSERT INTO testimonial_likes (testimonial_id, username) VALUES ($1, $2)`, [id, username])
      action = "liked"
    }

    // Get the updated like count
    const likeCountResult = await pool.query(
      `SELECT COUNT(*) as like_count FROM testimonial_likes WHERE testimonial_id = $1`,
      [id],
    )
    const likeCount = Number.parseInt(likeCountResult.rows[0].like_count)

    res.json({
      message: `Testimonial ${action} successfully`,
      action,
      likeCount,
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    res.status(500).json({ error: "Failed to toggle like" })
  }
}

// Get likes for a user
const getUserLikes = async (req, res) => {
  try {
    const { username } = req.params

    if (!username) {
      return res.status(400).json({ error: "Username is required" })
    }

    // Get all testimonials liked by the user
    const likesResult = await pool.query(`SELECT testimonial_id FROM testimonial_likes WHERE username = $1`, [username])

    // Transform the result into a simple array of testimonial IDs
    const likedTestimonialIds = likesResult.rows.map((row) => row.testimonial_id)

    res.json(likedTestimonialIds)
  } catch (error) {
    console.error("Error fetching user likes:", error)
    res.status(500).json({ error: "Failed to fetch user likes" })
  }
}

export default {
  getAll,
  create,
  remove,
  addComment,
  removeComment,
  getUserHistory,
  toggleLike,
  getUserLikes,
}
