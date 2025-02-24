"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaSun, FaMoon, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./Resources.css"

const Resources = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate()
  const [openCardIndex, setOpenCardIndex] = useState(null)

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com"
  }

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
          <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
          <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
          <button onClick={() => navigate("/legal")} className="nav-link">Legal Aid</button>
          <button onClick={() => navigate("/report")} className="nav-link">Report</button>
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
        <Quiz />
      </section>
    </div>
  )
}

const resourceData = [
  {
    category: "Understanding DV/IPV",
    color: "#FF6B6B",
    items: [
      "Domestic violence (DV) occurs within a domestic setting",
      "Intimate partner violence (IPV) involves current/former partners",
      "Can include physical, emotional, sexual, and financial abuse",
      "Affects people of all backgrounds, genders, and orientations",
      "Often involves a pattern of power and control",
      "Can escalate over time and have severe consequences",
    ],
  },
  {
    category: "Recognizing Signs",
    color: "#4ECDC4",
    items: [
      "Controlling behavior and excessive jealousy",
      "Isolation from friends and family",
      "Verbal abuse, threats, and intimidation",
      "Physical violence or threats of violence",
      "Financial control or exploitation",
      "Gaslighting and emotional manipulation",
    ],
  },
  {
    category: "Impact on Victims",
    color: "#45B7D1",
    items: [
      "Physical injuries and health problems",
      "Mental health issues like depression and PTSD",
      "Loss of self-esteem and confidence",
      "Economic instability and financial dependence",
      "Social isolation and damaged relationships",
      "Increased risk of substance abuse",
    ],
  },
  {
    category: "Safety Planning",
    color: "#FF9FF3",
    items: [
      "Identify safe places to go in an emergency",
      "Prepare an emergency bag with essentials",
      "Memorize important phone numbers",
      "Establish a code word with trusted friends/family",
      "Plan safe exits from your home",
      "Document incidents of abuse",
    ],
  },
  {
    category: "Support for Survivors",
    color: "#FEC771",
    items: [
      "24/7 National Domestic Violence Hotline",
      "Local women's shelters and safe houses",
      "Counseling and therapy services",
      "Support groups for survivors",
      "Legal aid and advocacy organizations",
      "Online resources and forums",
    ],
  },
  {
    category: "Legal Protections",
    color: "#C5E99B",
    items: [
      "Restraining orders and protective orders",
      "Emergency custody orders for children",
      "Housing rights for survivors",
      "Workplace protections against discrimination",
      "Immigration options for non-citizen survivors",
      "Victim compensation programs",
    ],
  },
  {
    category: "Helping Others",
    color: "#A78BFA",
    items: [
      "Recognize the signs of abuse",
      "Offer support without judgment",
      "Respect the survivor's decisions",
      "Provide resources and information",
      "Help create a safety plan if asked",
      "Report suspected abuse of children or vulnerable adults",
    ],
  },
  {
    category: "Prevention Strategies",
    color: "#84CC16",
    items: [
      "Educate about healthy relationships",
      "Promote gender equality and respect",
      "Teach conflict resolution skills",
      "Address root causes like poverty and substance abuse",
      "Implement bystander intervention programs",
      "Support comprehensive sex education in schools",
    ],
  },
]

const quizQuestions = [
  {
    question: "Which of the following is NOT a type of abuse?",
    options: ["Physical", "Emotional", "Financial", "Recreational"],
    correctAnswer: "Recreational",
  },
  {
    question: "What is a common warning sign of an abusive relationship?",
    options: ["Respect for boundaries", "Extreme jealousy", "Encouraging independence", "Open communication"],
    correctAnswer: "Extreme jealousy",
  },
  {
    question: "What should be included in a safety plan?",
    options: ["A list of favorite movies", "Emergency contact numbers", "Grocery shopping list", "Work schedule"],
    correctAnswer: "Emergency contact numbers",
  },
  {
    question: "Which resource is available 24/7 for DV survivors in the US?",
    options: ["Local library", "National DV Hotline", "Post office", "DMV"],
    correctAnswer: "National DV Hotline",
  },
  {
    question: "What is a potential long-term effect of DV on children?",
    options: [
      "Improved academic performance",
      "Stronger family bonds",
      "Difficulty forming relationships",
      "Increased self-esteem",
    ],
    correctAnswer: "Difficulty forming relationships",
  },
  {
    question: "Which of the following is an example of financial abuse?",
    options: [
      "Sharing a joint bank account",
      "Preventing a partner from working",
      "Discussing monthly budgets",
      "Saving for retirement",
    ],
    correctAnswer: "Preventing a partner from working",
  },
  {
    question: "What is gaslighting in the context of emotional abuse?",
    options: [
      "Using gas-powered appliances",
      "Turning off lights to save energy",
      "Manipulating someone to doubt their own perceptions",
      "A form of fire-starting",
    ],
    correctAnswer: "Manipulating someone to doubt their own perceptions",
  },
]

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

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(new Array(quizQuestions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)

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

