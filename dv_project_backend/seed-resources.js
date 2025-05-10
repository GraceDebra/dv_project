// seed-resources.js
import pool from "./config/db.js";

// Export the seeding function so it can be imported from setup-resources.js
export async function seedResourcesDatabase() {
  try {
    // Sample resource data
    const resources = [
      {
        category: "Domestic Violence",
        color: "#E74C3C",
        items: [
          "Domestic violence can take many forms including physical, emotional, financial and sexual abuse.",
          "On average, a woman will leave an abusive relationship seven times before leaving permanently.",
          "1 in 4 women and 1 in 9 men experience severe intimate partner physical violence.",
          "Abuse often escalates when the victim attempts to leave the relationship."
        ]
      },
      {
        category: "Safety Planning",
        color: "#3498DB",
        items: [
          "Create a code word to alert friends or family when you need emergency help.",
          "Prepare an emergency bag with important documents and necessities.",
          "Memorize important phone numbers in case you don't have access to your phone.",
          "Identify safe places you can go at different times of day or night."
        ]
      },
      {
        category: "Support Resources",
        color: "#2ECC71",
        items: [
          "National Domestic Violence Hotline: 1-800-799-7233",
          "Crisis Text Line: Text HOME to 741741",
          "Contact local shelters for emergency housing options.",
          "Consider joining a support group with others who've had similar experiences."
        ]
      }
    ];

    // Sample quiz questions
    const quizQuestions = [
      {
        question: "What percentage of domestic violence victims are women?",
        options: ["25%", "50%", "75%", "90%"],
        correctAnswer: "75%"
      },
      {
        question: "Which of the following is NOT a form of domestic abuse?",
        options: ["Financial control", "Emotional manipulation", "Occasional disagreements", "Isolation from friends and family"],
        correctAnswer: "Occasional disagreements"
      },
      {
        question: "What is a safety plan?",
        options: [
          "A legal document filed with the court",
          "A personal strategy to stay safe in dangerous situations",
          "A police report about an abuser",
          "A restraining order"
        ],
        correctAnswer: "A personal strategy to stay safe in dangerous situations"
      }
    ];

    // Insert resources
    for (const resource of resources) {
      const { category, color, items } = resource;
      
      // Insert resource
      const resourceResult = await pool.query(
        "INSERT INTO resources (category, color) VALUES ($1, $2) RETURNING id",
        [category, color]
      );
      
      const resourceId = resourceResult.rows[0].id;
      
      // Insert items
      for (let i = 0; i < items.length; i++) {
        await pool.query(
          "INSERT INTO resource_items (resource_id, item_text, display_order) VALUES ($1, $2, $3)",
          [resourceId, items[i], i]
        );
      }
    }
    
    // Insert quiz questions
    for (const quiz of quizQuestions) {
      const { question, options, correctAnswer } = quiz;
      
      // Insert question
      const questionResult = await pool.query(
        "INSERT INTO quiz_questions (question_text) VALUES ($1) RETURNING id",
        [question]
      );
      
      const questionId = questionResult.rows[0].id;
      
      // Insert options
      for (let i = 0; i < options.length; i++) {
        const isCorrect = options[i] === correctAnswer;
        await pool.query(
          "INSERT INTO quiz_options (question_id, option_text, is_correct, display_order) VALUES ($1, $2, $3, $4)",
          [questionId, options[i], isCorrect, i]
        );
      }
    }
    
    console.log("Seed data inserted successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error; // Re-throw so setup-resources.js can catch it
  }
}

// If this script is run directly (not imported), execute the seed function
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await seedResourcesDatabase();
    // Close the pool connection when done if run directly
    await pool.end();
  } catch (error) {
    console.error("Error in seed-resources.js:", error);
    process.exit(1);
  }
}