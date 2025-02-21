"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Info,
  AlertCircle,
  ShieldAlert,
  Users,
  Phone,
  Heart,
  ChevronDown,
  XCircle,
  Search,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Share2,
  BookOpen,
} from "lucide-react"
import "./Resources.css"

const ResourceCard = ({ card, isExpanded, onToggle }) => (
  <div className={`resource-card ${isExpanded ? "expanded" : ""}`}>
    <div className={`card-header ${card.colorClass}`} onClick={onToggle}>
      <div className="card-header-content">
        <div className="card-icon-title">
          <card.icon className="card-icon" />
          <div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-headline">{card.headline}</p>
          </div>
        </div>
        <ChevronDown className={`chevron-icon ${isExpanded ? "rotated" : ""}`} />
      </div>
      <p className="card-short-desc">{card.shortDesc}</p>
    </div>
    {isExpanded && <div className="card-content">{card.content}</div>}
  </div>
)

// New Quiz component
const Quiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (selectedIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedIndex
    setAnswers(newAnswers)
  }

  const goToPrevious = () => {
    setCurrentQuestion(Math.max(0, currentQuestion - 1))
  }

  const goToNext = () => {
    setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = answers.reduce((total, answer, index) => {
      return total + (questions[index].options[answer]?.isCorrect ? 1 : 0)
    }, 0)
    onComplete(score)
  }

  if (showResults) {
    return (
      <div className="quiz-results">
        <h3>Quiz Complete!</h3>
        <p>
          You scored {answers.filter((answer, index) => questions[index].options[answer]?.isCorrect).length} out of{" "}
          {questions.length}
        </p>
        <button onClick={() => setShowResults(false)} className="quiz-button">
          Review Answers
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="quiz-container">
      <h3>
        Question {currentQuestion + 1} of {questions.length}
      </h3>
      <p>{question.question}</p>
      <div className="quiz-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={answers[currentQuestion] === index ? "selected" : ""}
          >
            {option.text}
          </button>
        ))}
      </div>
      <div className="quiz-navigation">
        <button onClick={goToPrevious} disabled={currentQuestion === 0} className="quiz-button">
          Back
        </button>
        {currentQuestion < questions.length - 1 ? (
          <button onClick={goToNext} className="quiz-button">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="quiz-button submit">
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  )
}

const Resources = () => {
  const [expandedCard, setExpandedCard] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSections, setFilteredSections] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [textToSpeech, setTextToSpeech] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [language, setLanguage] = useState("en")
  const [quizScore, setQuizScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const resourceSections = useMemo(
    () => [
      {
        title: "Knowledge Hub",
        cards: [
          {
            id: "dv-ipv-definition",
            title: "What is DV/IPV?",
            headline: "Understanding Domestic & Intimate Partner Violence",
            icon: Info,
            colorClass: "blue-bg",
            shortDesc: "Learn about the fundamentals of domestic and intimate partner violence",
            content: (
              <div className="content-wrapper">
                <p className="content-text">
                  Domestic violence and intimate partner violence are patterns of behavior used to gain or maintain
                  power and control over an intimate partner or family member.
                </p>
                <div className="key-understanding">
                  <h4>Key Understanding:</h4>
                  <ul>
                    <li>It's about power and control</li>
                    <li>Affects people of all backgrounds</li>
                    <li>Takes many forms beyond physical abuse</li>
                    <li>Never the victim's fault</li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            id: "dv-myths-facts",
            title: "Myths vs. Facts",
            headline: "Separating Fact from Fiction",
            icon: AlertCircle,
            colorClass: "amber-bg",
            shortDesc: "Common misconceptions about domestic violence debunked",
            content: (
              <div className="content-wrapper">
                {[
                  {
                    myth: "DV only happens in certain communities",
                    fact: "DV affects people of all backgrounds, regardless of race, religion, income, or education",
                  },
                  {
                    myth: "Victims can easily leave if they want to",
                    fact: "Leaving is often the most dangerous time for victims and requires careful planning",
                  },
                  {
                    myth: "Abuse is caused by alcohol or stress",
                    fact: "Abuse is a choice. While these factors may escalate violence, they don't cause it",
                  },
                ].map((item, index) => (
                  <div key={index} className="myth-fact">
                    <p className="myth">Myth: {item.myth}</p>
                    <p className="fact">Fact: {item.fact}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            id: "educational-quiz",
            title: "Test Your Knowledge",
            headline: "Interactive DV/IPV Quiz",
            icon: BookOpen,
            colorClass: "green-bg",
            shortDesc: "Take a quiz to reinforce your understanding of DV/IPV",
            content: (
              <Quiz
                questions={[
                  {
                    question: "What is the primary motivation behind domestic violence?",
                    options: [
                      { text: "Anger management issues", isCorrect: false },
                      { text: "Power and control", isCorrect: true },
                      { text: "Substance abuse", isCorrect: false },
                      { text: "Mental illness", isCorrect: false },
                    ],
                  },
                  {
                    question: "Which of the following is NOT a form of domestic violence?",
                    options: [
                      { text: "Physical abuse", isCorrect: false },
                      { text: "Emotional manipulation", isCorrect: false },
                      { text: "Financial control", isCorrect: false },
                      { text: "Disagreements in a relationship", isCorrect: true },
                    ],
                  },
                  {
                    question:
                      "True or False: Domestic violence only affects certain communities or socioeconomic groups.",
                    options: [
                      { text: "True", isCorrect: false },
                      { text: "False", isCorrect: true },
                    ],
                  },
                  {
                    question: "What is often the most dangerous time for a victim of domestic violence?",
                    options: [
                      { text: "When they first meet their partner", isCorrect: false },
                      { text: "During an argument", isCorrect: false },
                      { text: "When they attempt to leave the abusive relationship", isCorrect: true },
                      { text: "During the holidays", isCorrect: false },
                    ],
                  },
                  {
                    question: "Which of the following is a common barrier to leaving an abusive relationship?",
                    options: [
                      { text: "Financial dependence", isCorrect: true },
                      { text: "Lack of cooking skills", isCorrect: false },
                      { text: "Different taste in movies", isCorrect: false },
                      { text: "Political disagreements", isCorrect: false },
                    ],
                  },
                ]}
                onComplete={(score) => {
                  setQuizScore(score)
                  setQuizCompleted(true)
                }}
              />
            ),
          },
        ],
      },
      {
        title: "Recognizing the Signs",
        cards: [
          {
            id: "abuse-warning-signs",
            title: "Signs of an Abusive Relationship",
            headline: "Are You Experiencing Abuse?",
            icon: ShieldAlert,
            colorClass: "teal-bg",
            shortDesc: "Recognize the warning signs of abuse in your relationship",
            content: (
              <div className="content-wrapper">
                <p className="content-text">Ask yourself if your partner:</p>
                <ul className="warning-signs-list">
                  {[
                    "Controls who you see, where you go, or how you spend money",
                    "Puts you down or makes you feel worthless",
                    "Threatens to hurt you, your children, or pets",
                    "Forces you to do things you don't want to do",
                    "Monitors your phone, email, or social media",
                    "Makes all the decisions without your input",
                    "Gets extremely jealous or possessive",
                  ].map((sign, index) => (
                    <li key={index}>{sign}</li>
                  ))}
                </ul>
              </div>
            ),
          },
          {
            id: "signs-others",
            title: "Signs Someone You Know Might Be Abused",
            headline: "Is Someone You Know in Danger?",
            icon: Users,
            colorClass: "indigo-bg",
            shortDesc: "How to recognize if someone you care about might be experiencing abuse",
            content: (
              <div className="content-wrapper">
                <p className="content-text">Watch for these warning signs:</p>
                <ul className="warning-signs-list">
                  {[
                    "Frequent injuries with unlikely explanations",
                    "Personality changes or increased anxiety",
                    "Frequent absences from work or social events",
                    "Wearing concealing clothing even in warm weather",
                    "Partner is extremely controlling or always present",
                    "Seems afraid or anxious to please their partner",
                    "Limited access to money or transportation",
                  ].map((sign, index) => (
                    <li key={index}>{sign}</li>
                  ))}
                </ul>
              </div>
            ),
          },
        ],
      },
      {
        title: "Getting Help",
        cards: [
          {
            id: "emergency-resources",
            title: "Resources & Hotlines",
            headline: "Where to Get Help",
            icon: Phone,
            colorClass: "rose-bg",
            shortDesc: "24/7 helplines and emergency resources",
            content: (
              <div className="content-wrapper">
                <div className="emergency-info">
                  <h4>Emergency:</h4>
                  <p className="emergency-number">Call 911 if you're in immediate danger</p>
                </div>
                <div className="hotline-info">
                  <h4>National DV Hotline:</h4>
                  <p className="hotline-number">1-800-799-SAFE (7233)</p>
                  <p>Available 24/7 - All calls are confidential</p>
                </div>
                <div className="online-support">
                  <h4>Online Support:</h4>
                  <p>Visit thehotline.org for secure web chat</p>
                </div>
              </div>
            ),
          },
          {
            id: "help-survivor",
            title: "How to Help a Survivor",
            headline: "Supporting a Loved One",
            icon: Heart,
            colorClass: "pink-bg",
            shortDesc: "Learn how to support someone experiencing abuse",
            content: (
              <div className="content-wrapper">
                {[
                  {
                    tip: "Listen Without Judgment",
                    desc: "Believe them and take their fears seriously",
                  },
                  {
                    tip: "Offer Specific Support",
                    desc: "Instead of 'Let me know if you need anything,' offer specific help",
                  },
                  {
                    tip: "Respect Their Choices",
                    desc: "Don't pressure them to take actions they're not ready for",
                  },
                  {
                    tip: "Stay Connected",
                    desc: "Abusers often isolate victims; maintain regular contact",
                  },
                  {
                    tip: "Share Resources",
                    desc: "Provide information about local services and support",
                  },
                ].map((item, index) => (
                  <div key={index} className="help-tip">
                    <h4>{item.tip}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            ),
          },
        ],
      },
    ],
    [],
  )

  useEffect(() => {
    const filtered = resourceSections
      .map((section) => ({
        ...section,
        cards: section.cards.filter(
          (card) =>
            card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }))
      .filter((section) => section.cards.length > 0)

    setFilteredSections(filtered)
  }, [searchTerm, resourceSections])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark-mode")
  }

  const toggleTextToSpeech = () => {
    setTextToSpeech(!textToSpeech)
    if (!textToSpeech) {
      // Implement text-to-speech functionality here
      // For example, using the Web Speech API
      const speech = new SpeechSynthesisUtterance("Text-to-speech enabled")
      window.speechSynthesis.speak(speech)
    } else {
      window.speechSynthesis.cancel()
    }
  }

  const changeFontSize = (increment) => {
    setFontSize((prevSize) => {
      const newSize = prevSize + increment
      document.documentElement.style.fontSize = `${newSize}px`
      return newSize
    })
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    // Implement language change logic here
    // This would typically involve fetching translated content
  }

  const shareResource = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "DV & IPV Resources",
          text: "Check out these important resources on Domestic Violence and Intimate Partner Violence",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error))
    } else {
      alert("Share feature is not supported on this browser")
    }
  }

  return (
    <div className={`resources-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="resources-wrapper">
        <div className="top-bar">
          <button onClick={() => (window.location.href = "https://weather.com")} className="quick-exit-button">
            <XCircle className="exit-icon" />
            Quick Exit
          </button>
          <div className="accessibility-controls">
            <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {darkMode ? <Sun /> : <Moon />}
            </button>
            <button onClick={toggleTextToSpeech} aria-label="Toggle text-to-speech">
              {textToSpeech ? <VolumeX /> : <Volume2 />}
            </button>
            <button onClick={() => changeFontSize(1)} aria-label="Increase font size">
              A+
            </button>
            <button onClick={() => changeFontSize(-1)} aria-label="Decrease font size">
              A-
            </button>
            <select onChange={(e) => changeLanguage(e.target.value)} value={language}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <button onClick={shareResource} aria-label="Share these resources">
              <Share2 />
            </button>
          </div>
        </div>

        <h1 className="resources-title">DV & IPV Resources</h1>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {filteredSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section-wrapper">
            <h2 className="section-title">{section.title}</h2>
            <div className="cards-grid">
              {section.cards.map((card) => (
                <ResourceCard
                  key={card.id}
                  card={card}
                  isExpanded={expandedCard === card.id}
                  onToggle={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="community-support">
          <h2>Community Support</h2>
          <p>Connect with others in a safe, moderated environment.</p>
          <button onClick={() => alert("Community Forum - Coming Soon!")}>Join the Community</button>
        </div>
      </div>
      {quizCompleted && (
        <div className="quiz-feedback">
          <h3>Quiz Completed!</h3>
          <p>You scored {quizScore} out of 5.</p>
          <p>
            {quizScore === 5
              ? "Excellent! You have a strong understanding of DV/IPV issues."
              : quizScore >= 3
                ? "Good job! You have a solid grasp of DV/IPV concepts, but there's still room to learn more."
                : "It looks like you could benefit from reviewing the DV/IPV information. Don't worry, learning about these issues is an ongoing process!"}
          </p>
        </div>
      )}
    </div>
  )
}

export default Resources

