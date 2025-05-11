"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./RiskAssessment.css"
import { FaChevronLeft, FaChevronRight, FaSun, FaMoon } from "react-icons/fa"
// import { predictRisk } from '../api/api';

const RiskAssessment = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [view, setView] = useState("main")
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    education: "",
    employment: "",
    marital_status: "",
    violence: "",
    comments: "",
  })
  const [result, setResult] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Define the steps for progress tracking
  const steps = ["main", "education", "income", "employment", "marital", "abuse", "comments"]
  const currentStep = steps.indexOf(view) + 1
  const totalSteps = steps.length

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log(data)
      setResult(data.risk_level)
      setView("result")
    } catch (error) {
      console.error("Error submitting assessment:", error)
      // Show a mock result for demonstration if the API is not available
      setResult("Medium Risk - This is a sample result as the API connection failed")
      setView("result")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickExit = () => {
    sessionStorage.clear()
    localStorage.clear()
    window.location.href = "https://weather.com"
  }

  const navigateToStep = (step) => {
    setView(step)
  }

  const getStepTitle = () => {
    switch (view) {
      case "main":
        return "Personal Information"
      case "education":
        return "Education Background"
      case "income":
        return "Financial Information"
      case "employment":
        return "Employment Status"
      case "marital":
        return "Relationship Status"
      case "abuse":
        return "Previous Experiences"
      case "comments":
        return "Additional Information"
      case "result":
        return "Assessment Results"
      default:
        return "Risk Assessment"
    }
  }

  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`progress-step ${view === step ? "active" : ""} ${steps.indexOf(view) >= index ? "completed" : ""}`}
              onClick={() => steps.indexOf(view) >= index && navigateToStep(step)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderResultCard = () => {
    // Determine risk level class for styling
    let riskClass = "risk-medium"
    if (result.toLowerCase().includes("high")) {
      riskClass = "risk-high"
    } else if (result.toLowerCase().includes("low")) {
      riskClass = "risk-low"
    }

    return (
      <div className="result-card">
        <h3>Assessment Result</h3>
        <div className={`risk-level ${riskClass}`}>
          <span>{result}</span>
        </div>
        <div className="result-info">
          <p>
            This assessment is based on the information you provided. It's important to remember that this is just a
            tool and not a definitive evaluation.
          </p>
          <p>
            If you feel unsafe or in danger, please contact emergency services or a domestic violence hotline
            immediately.
          </p>
        </div>
        <div className="result-actions">
          <button className="secondary-button" onClick={() => setView("main")}>
            Retake Assessment
          </button>
          <button className="primary-button" onClick={() => navigate("/dashboard")}>
            Return To Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`risk-assessment-page ${darkMode ? "dark-mode" : ""}`}>
      {/* Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-content">
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link">
              AI Support
            </button>
            <button onClick={() => navigate("/resources")} className="nav-link">
              Resources
            </button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link active">
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
          <div className="nav-actions">
            <button onClick={handleQuickExit} className="quick-exit-btn">
              Quick Exit
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
              {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="assessment-container">
        <h2 className="assessment-title">{getStepTitle()}</h2>

        {view !== "result" && renderProgressBar()}

        {view !== "result" ? (
          <form onSubmit={handleSubmit} className="assessment-form">
            {view === "main" && (
              <div className="question-card">
                <div className="question-content">
                  <label htmlFor="age">How old are you?</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    placeholder="Enter your age"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="card-navigation">
                  <div className="spacer"></div>
                  <button
                    type="button"
                    className="nav-button next"
                    onClick={() => navigateToStep("education")}
                    disabled={!formData.age}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {view === "education" && (
              <div className="question-card">
                <div className="question-content">
                  <label htmlFor="education">What is your highest level of education?</label>
                  <select id="education" name="education" value={formData.education} onChange={handleChange} required>
                    <option value="">Select education level</option>
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary School</option>
                    <option value="tertiary">University/College</option>
                  </select>
                </div>
                <div className="card-navigation">
                  <button type="button" className="nav-button prev" onClick={() => navigateToStep("main")}>
                    <FaChevronLeft /> Previous
                  </button>
                  <button
                    type="button"
                    className="nav-button next"
                    onClick={() => navigateToStep("income")}
                    disabled={!formData.education}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {view === "income" && (
              <div className="question-card">
                <div className="question-content">
                  <label htmlFor="income">What is your monthly income?</label>
                  <input
                    type="text"
                    id="income"
                    name="income"
                    value={formData.income}
                    placeholder="Enter amount"
                    onChange={handleChange}
                    required
                  />
                  <small className="input-help">You can enter an approximate amount</small>
                </div>
                <div className="card-navigation">
                  <button type="button" className="nav-button prev" onClick={() => navigateToStep("education")}>
                    <FaChevronLeft /> Previous
                  </button>
                  <button
                    type="button"
                    className="nav-button next"
                    onClick={() => navigateToStep("employment")}
                    disabled={!formData.income}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {view === "employment" && (
              <div className="question-card">
                <div className="question-content">
                  <label htmlFor="employment">What is your current employment status?</label>
                  <select
                    id="employment"
                    name="employment"
                    value={formData.employment}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select employment status</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="semi employed">Part-time/Temporary</option>
                    <option value="employed">Full-time Employed</option>
                  </select>
                </div>
                <div className="card-navigation">
                  <button type="button" className="nav-button prev" onClick={() => navigateToStep("income")}>
                    <FaChevronLeft /> Previous
                  </button>
                  <button
                    type="button"
                    className="nav-button next"
                    onClick={() => navigateToStep("marital")}
                    disabled={!formData.employment}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {view === "marital" && (
              <div className="question-card">
                <div className="question-content">
                  <label htmlFor="marital_status">What is your current relationship status?</label>
                  <select
                    id="marital_status"
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select relationship status</option>
                    <option value="single">Single</option>
                    <option value="married">Married/Partnership</option>
                    <option value="divorced">Divorced/Separated</option>
                  </select>
                </div>
                <div className="card-navigation">
                  <button type="button" className="nav-button prev" onClick={() => navigateToStep("employment")}>
                    <FaChevronLeft /> Previous
                  </button>
                  <button
                    type="button"
                    className="nav-button next"
                    onClick={() => navigateToStep("abuse")}
                    disabled={!formData.marital_status}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {view === "abuse" && (
              <div className="question-card">
                <div className="question-content">
                  <label htmlFor="violence">Have you experienced any form of abuse in the past?</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="violence-yes"
                        name="violence"
                        value="yes"
                        checked={formData.violence === "yes"}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="violence-yes">Yes</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="violence-no"
                        name="violence"
                        value="no"
                        checked={formData.violence === "no"}
                        onChange={handleChange}
                      />
                      <label htmlFor="violence-no">No</label>
                    </div>
                  </div>
                  <small className="input-help">
                    Your answers are confidential and will only be used for this assessment
                  </small>
                </div>
                <div className="card-navigation">
                  <button type="button" className="nav-button prev" onClick={() => navigateToStep("marital")}>
                    <FaChevronLeft /> Previous
                  </button>
                  <button
                    type="button"
                    className="nav-button next"
                    onClick={() => navigateToStep("comments")}
                    disabled={!formData.violence}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {view === "comments" && (
              <div className="question-card">
                <div className="question-content">
                  <label htmlFor="comments">Is there anything else you'd like to share? (Optional)</label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments || ""}
                    placeholder="Your response is completely optional and confidential..."
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </div>
                <div className="card-navigation">
                  <button type="button" className="nav-button prev" onClick={() => navigateToStep("abuse")}>
                    <FaChevronLeft /> Previous
                  </button>
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Submit Assessment"}
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          renderResultCard()
        )}

        <div className="assessment-footer">
          <p>Your privacy and safety are our top priorities. All information is encrypted and confidential.</p>
        </div>
      </div>
    </div>
  )
}

export default RiskAssessment
