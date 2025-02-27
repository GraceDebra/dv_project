"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaUserSecret, FaUpload, FaExclamationTriangle, FaSun, FaMoon, FaShieldAlt } from "react-icons/fa"
import "./Report.css"

const Reporting = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate()
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    incidentType: "",
    description: "",
    date: "",
    location: "",
    severityLevel: 3,
    evidence: null,
    policeNotified: "no",
  })
  const [progress, setProgress] = useState(0)

  const incidentTypes = ["Harassment", "Discrimination", "Workplace Safety", "Ethical Concerns", "Other"]

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }))
    updateProgress()
  }

  const updateProgress = () => {
    const filledFields = Object.values(formData).filter((value) => value !== "" && value !== null).length
    const totalFields = Object.keys(formData).length
    setProgress((filledFields / totalFields) * 100)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Report submitted successfully!")
  }

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com"
  }

  return (
    <div className={`reporting-page ${darkMode ? "dark" : ""}`}>
      <nav className="reporting-nav">
        <div className="nav-content">
          <div className="nav-links">
          <div className="nav-links">
          <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
          <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
          <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
          <button onClick={() => navigate("/support")} className="nav-link">Support</button>
          <button onClick={() => navigate("/report")} className="nav-link">Report</button>
          <button onClick={() => navigate("/testimonials")} className="nav-link">Testimonials</button>
          <button onClick={() => navigate("/dashboard")} className="nav-link">Back to Dashboard</button>
        </div>
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
      <div className="background-texture"></div>

      <div className="reporting-container">
        <div className="form-header">
          <div className="decorative-line"></div>
          <h1>Incident Reporting</h1>
          <p>Your voice matters. Report safely and confidentially.</p>
          <div className="decorative-line"></div>
        </div>

        <div className="anonymous-toggle">
          <button className={`toggle-btn ${!isAnonymous ? "active" : ""}`} onClick={() => setIsAnonymous(false)}>
            <FaUser /> Identify Myself
          </button>
          <button className={`toggle-btn ${isAnonymous ? "active" : ""}`} onClick={() => setIsAnonymous(true)}>
            <FaUserSecret /> Stay Anonymous
          </button>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-grid">
              {!isAnonymous && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isAnonymous}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required={!isAnonymous}
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="incidentType">Incident Type:</label>
                <select
                  id="incidentType"
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an incident type</option>
                  {incidentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date of Incident:</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="policeNotified">Have the police been notified?</label>
                <select
                  id="policeNotified"
                  name="policeNotified"
                  value={formData.policeNotified}
                  onChange={handleInputChange}
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="severityLevel">Severity Level:</label>
              <input
                type="range"
                id="severityLevel"
                name="severityLevel"
                min="1"
                max="5"
                value={formData.severityLevel}
                onChange={handleInputChange}
                required
              />
              <div className="severity-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="evidence" className="file-upload">
                <FaUpload /> Upload Evidence
              </label>
              <input
                type="file"
                id="evidence"
                name="evidence"
                onChange={handleInputChange}
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: "none" }}
              />
              {formData.evidence && <p className="file-name">{formData.evidence.name}</p>}
            </div>

            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="progress-text">{Math.round(progress)}% Complete</span>
            </div>

            <button type="submit" className="submit-btn">
              <FaExclamationTriangle /> Submit Report
            </button>
          </form>
        </div>

        <div className="safety-notice">
          <FaShieldAlt className="shield-icon" />
          <p>Your safety is our priority. If you're in immediate danger, please contact emergency services.</p>
        </div>
        <div className="floating-decoration"></div>
      </div>
    </div>
  )
}

export default Reporting

