// api/resources.js
import pool from "../config/db.js"

const resourcesAPI = {
  getAll: async (req, res) => {
    try {
      // Query to get all resources with their items
      const resourceQuery = `
        SELECT r.id, r.category, r.color, ri.id as item_id, ri.item_text, ri.display_order
        FROM resources r
        LEFT JOIN resource_items ri ON r.id = ri.resource_id
        ORDER BY r.id, ri.display_order
      `

      const { rows } = await pool.query(resourceQuery)

      // Format the data for the frontend
      const formattedData = []
      let currentResource = null

      rows.forEach((row) => {
        if (!currentResource || currentResource.id !== row.id) {
          if (currentResource) {
            formattedData.push(currentResource)
          }

          currentResource = {
            id: row.id,
            category: row.category,
            color: row.color,
            items: [],
          }
        }

        if (row.item_id) {
          currentResource.items.push(row.item_text)
        }
      })

      if (currentResource) {
        formattedData.push(currentResource)
      }

      res.status(200).json(formattedData)
    } catch (error) {
      console.error("Database error:", error)
      res.status(500).json({ message: "Error fetching resources" })
    }
  },

  create: async (req, res) => {
    try {
      const { category, color, items } = req.body

      // Validate the input
      if (!category || !color || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Invalid resource data" })
      }

      // Start a transaction
      const client = await pool.connect()

      try {
        await client.query("BEGIN")

        // Insert the resource category
        const resourceResult = await client.query(
          "INSERT INTO resources (category, color) VALUES ($1, $2) RETURNING id",
          [category, color]
        )

        const resourceId = resourceResult.rows[0].id

        // Insert each item
        for (let i = 0; i < items.length; i++) {
          await client.query(
            "INSERT INTO resource_items (resource_id, item_text, display_order) VALUES ($1, $2, $3)", 
            [resourceId, items[i], i]
          )
        }

        await client.query("COMMIT")
        res.status(201).json({ message: "Resource created successfully", id: resourceId })
      } catch (e) {
        await client.query("ROLLBACK")
        throw e
      } finally {
        client.release()
      }
    } catch (error) {
      console.error("Database error:", error)
      res.status(500).json({ message: "Error creating resource" })
    }
  }
}

export default resourcesAPI