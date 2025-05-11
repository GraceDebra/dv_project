"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaSun, FaMoon, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./Resources.css"

const Resources = () => {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()
  const [openCardIndex, setOpenCardIndex] = useState(null)
  const [resourceData, setResourceData] = useState([])
  const [quizQuestions, setQuizQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch resource data from the API
    const fetchResources = async () => {
      try {
        setLoading(true)
        // Updated endpoints to match your server.js routes
        const resourceResponse = await fetch("http://localhost:8081/services/resources")
        const quizResponse = await fetch("http://localhost:8081/services/quiz-questions")

        if (!resourceResponse.ok || !quizResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const resourceData = await resourceResponse.json()
        const quizData = await quizResponse.json()

        // Transform the data if needed to match your component's expected format
        const formattedResourceData = formatResourceData(resourceData)

        setResourceData(formattedResourceData)
        setQuizQuestions(quizData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load resources. Please try again later.")
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  // Helper function to format resource data if needed
  const formatResourceData = (data) => {
    // If your API returns data in a different format than what your component expects,
    // transform it here. This is just an example - adjust based on your actual API response.

    // If the data is already in the right format, just return it
    if (data.length > 0 && data[0].category && data[0].items) {
      return data
    }

    // Otherwise, transform it to match your component's expected format
    // This assumes your API returns an array of resources with title, description, etc.
    const categories = {}

    data.forEach((resource) => {
      const category = resource.category || "Uncategorized"

      if (!categories[category]) {
        categories[category] = {
          category,
          color: getColorForCategory(category),
          items: [],
        }
      }

      // Add the resource as an item in the category
      categories[category].items.push(
        `${resource.title}: ${resource.description} ${resource.url ? `- ${resource.url}` : ""}`,
      )
    })

    return Object.values(categories)
  }

  // Helper function to assign colors to categories
  const getColorForCategory = (category) => {
    const colors = {
      Legal: "#4f46e5",
      Health: "#10b981",
      Safety: "#ef4444",
      Support: "#f59e0b",
      Education: "#6366f1",
      Uncategorized: "#6b7280",
    }

    return colors[category] || colors["Uncategorized"]
  }

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com"
  }

  if (loading) {
    return (
      <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
        <nav className="navbar">
          {/* Navigation Bar */}
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
            <button onClick={() => navigate("/resources")} className="nav-link"> Resources</button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
            <button onClick={() => navigate("/support")} className="nav-link">support</button>
            <button onClick={() => navigate("/report-incident")} className="nav-link">Report Incident</button>
            <button onClick={() => navigate("/testimonials")} className="nav-link">Testimonials</button>
            <button onClick={() => navigate("/dashboard")} className="nav-link">Back to Dashboard</button>
          </div>

          {/* Right Section - Quick Exit & Theme Toggle */}
          <div className="nav-right">
            <button className="quick-exit" onClick={handleQuickExit}>
              Quick Exit
            </button>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </nav>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading resources...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
        <nav className="navbar">
          {/* Navigation Bar */}
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link">
              AI Support
            </button>
            <button onClick={() => navigate("/resources")} className="nav-link">
              Resources
            </button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link">
              Risk Assessment
            </button>
            <button onClick={() => navigate("/support")} className="nav-link">
              Support
            </button>
            <button onClick={() => navigate("/report-incident")} className="nav-link">
              Report Incident
            </button>
            <button onClick={() => navigate("/testimonials")} className="nav-link">
              Testimonials
            </button>
            <button onClick={() => navigate("/dashboard")} className="nav-link">
              Back to Dashboard
            </button>
          </div>

          {/* Right Section - Quick Exit & Theme Toggle */}
          <div className="nav-right">
            <button className="quick-exit" onClick={handleQuickExit}>
              Quick Exit
            </button>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </nav>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={() => navigate("/chatbot")} className="nav-link">
            AI Support
          </button>
          <button onClick={() => navigate("/resources")} className="nav-link">
            Resources
          </button>
          <button onClick={() => navigate("/risk-assessment")} className="nav-link">
            Risk Assessment
          </button>
          <button onClick={() => navigate("/support")} className="nav-link">
            Support
          </button>
          <button onClick={() => navigate("/report-incident")} className="nav-link">
            Report Incident
          </button>
          <button onClick={() => navigate("/testimonials")} className="nav-link">
            Testimonials
          </button>
          <button onClick={() => navigate("/dashboard")} className="nav-link">
            Back to Dashboard
          </button>
        </div>

        {/* Right Section - Quick Exit & Theme Toggle */}
        <div className="nav-right">
          <button className="quick-exit" onClick={handleQuickExit}>
            Quick Exit
          </button>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>

      <section className="resources-section">
        <h2>Knowledge Hub</h2>
        <div className="resource-grid">
          {resourceData.map((resource, index) => (
            <ResourceCard
              key={index}
              {...resource}
              isOpen={openCardIndex === index}
              onToggle={() => setOpenCardIndex(openCardIndex === index ? null : index)}
            />
          ))}
        </div>
        <Quiz quizQuestions={quizQuestions} />
      </section>
    </div>
  )
}

const ResourceCard = ({ category, color, items, isOpen, onToggle }) => {
  return (
    <motion.div
      className="resource-card"
      style={{ borderColor: color }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 style={{ backgroundColor: color }}>{category}</h3>
      <button onClick={onToggle} aria-expanded={isOpen} aria-controls={`content-${category}`}>
        {isOpen ? "Hide" : "Show"} Information
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={`content-${category}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const Quiz = ({ quizQuestions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)

  // Initialize answers array when quizQuestions change
  useEffect(() => {
    if (quizQuestions && quizQuestions.length > 0) {
      setAnswers(new Array(quizQuestions.length).fill(null))
    }
  }, [quizQuestions])

  const handleAnswer = (answer) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const navigateQuestion = (direction) => {
    const nextQuestion = currentQuestion + direction
    if (nextQuestion >= 0 && nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion)
    }
  }

  const submitQuiz = () => {
    setShowResults(true)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(quizQuestions.length).fill(null))
    setShowResults(false)
    setIsReviewing(false)
  }

  const startReview = () => {
    setIsReviewing(true)
    setCurrentQuestion(0)
  }

  const score = answers.reduce(
    (total, answer, index) => (answer === quizQuestions[index].correctAnswer ? total + 1 : total),
    0,
  )

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="quiz-section">
        <p>No quiz questions available</p>
      </div>
    )
  }

  return (
    <div className="quiz-section">
      <h3>Test Your Knowledge</h3>
      {!showResults ? (
        <div className="quiz-question">
          <p>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
          <p>{quizQuestions[currentQuestion].question}</p>
          <div className="quiz-options">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={answers[currentQuestion] === option ? "selected" : ""}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="quiz-navigation">
            <button onClick={() => navigateQuestion(-1)} disabled={currentQuestion === 0}>
              <FaArrowLeft /> Previous
            </button>
            <button onClick={() => navigateQuestion(1)} disabled={currentQuestion === quizQuestions.length - 1}>
              Next <FaArrowRight />
            </button>
          </div>
          {currentQuestion === quizQuestions.length - 1 && (
            <button className="submit-quiz" onClick={submitQuiz}>
              Submit Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="quiz-results">
          <h4>Quiz Complete!</h4>
          <p>
            You scored {score} out of {quizQuestions.length}
          </p>
          <button onClick={startReview}>Review Answers</button>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      )}
      {isReviewing && (
        <div className="quiz-review">
          <p>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
          <p>{quizQuestions[currentQuestion].question}</p>
          <div className="quiz-options">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`
                  ${option === quizQuestions[currentQuestion].correctAnswer ? "correct" : ""}
                  ${answers[currentQuestion] === option && option !== quizQuestions[currentQuestion].correctAnswer ? "incorrect" : ""}
                `}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="quiz-navigation">
            <button onClick={() => navigateQuestion(-1)} disabled={currentQuestion === 0}>
              <FaArrowLeft /> Previous
            </button>
            <button onClick={() => navigateQuestion(1)} disabled={currentQuestion === quizQuestions.length - 1}>
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Resources
