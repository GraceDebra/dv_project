// api/quiz-questions.js
import pool from "../config/db.js"

const quizQuestionsAPI = {
  getAll: async (req, res) => {
    try {
      // Query to get all quiz questions with their options
      const quizQuery = `
        SELECT q.id, q.question_text, o.id as option_id, o.option_text, o.is_correct, o.display_order
        FROM quiz_questions q
        LEFT JOIN quiz_options o ON q.id = o.question_id
        ORDER BY q.id, o.display_order
      `

      const { rows } = await pool.query(quizQuery)

      // Format the data for the frontend
      const formattedQuestions = []
      let currentQuestion = null

      rows.forEach((row) => {
        if (!currentQuestion || currentQuestion.id !== row.id) {
          if (currentQuestion) {
            formattedQuestions.push(currentQuestion)
          }

          currentQuestion = {
            id: row.id,
            question: row.question_text,
            options: [],
            correctAnswer: null,
          }
        }

        if (row.option_id) {
          currentQuestion.options.push(row.option_text)

          if (row.is_correct) {
            currentQuestion.correctAnswer = row.option_text
          }
        }
      })

      if (currentQuestion) {
        formattedQuestions.push(currentQuestion)
      }

      res.status(200).json(formattedQuestions)
    } catch (error) {
      console.error("Database error:", error)
      res.status(500).json({ message: "Error fetching quiz questions" })
    }
  },

  create: async (req, res) => {
    try {
      const { question, options, correctAnswer } = req.body

      // Validate the input
      if (!question || !options || !Array.isArray(options) || !correctAnswer) {
        return res.status(400).json({ message: "Invalid quiz question data" })
      }

      if (!options.includes(correctAnswer)) {
        return res.status(400).json({ message: "Correct answer must be one of the options" })
      }

      // Start a transaction
      const client = await pool.connect()

      try {
        await client.query("BEGIN")

        // Insert the question
        const questionResult = await client.query(
          "INSERT INTO quiz_questions (question_text) VALUES ($1) RETURNING id",
          [question]
        )

        const questionId = questionResult.rows[0].id

        // Insert each option
        for (let i = 0; i < options.length; i++) {
          const isCorrect = options[i] === correctAnswer
          await client.query(
            "INSERT INTO quiz_options (question_id, option_text, is_correct, display_order) VALUES ($1, $2, $3, $4)",
            [questionId, options[i], isCorrect, i]
          )
        }

        await client.query("COMMIT")
        res.status(201).json({ message: "Quiz question created successfully", id: questionId })
      } catch (e) {
        await client.query("ROLLBACK")
        throw e
      } finally {
        client.release()
      }
    } catch (error) {
      console.error("Database error:", error)
      res.status(500).json({ message: "Error creating quiz question" })
    }
  }
}

export default quizQuestionsAPI