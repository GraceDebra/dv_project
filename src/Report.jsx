"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaUserSecret, FaUpload, FaExclamationTriangle, FaSun, FaMoon, FaShieldAlt } from "react-icons/fa"
import "./Report.css"

const Report = () => {
  const [darkMode, setDarkMode] = useState(false)
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // API base URL - hardcoded instead of using process.env
  const API_BASE_URL = "http://localhost:8081"

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Create the report data object
      const reportData = {
        name: formData.name,
        email: formData.email,
        incidentType: formData.incidentType,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        severityLevel: formData.severityLevel,
        policeNotified: formData.policeNotified,
        isAnonymous: isAnonymous,
      }

      // Log the API URL for debugging
      console.log("API Base URL:", API_BASE_URL)
      console.log("Submitting report to:", `${API_BASE_URL}/services/reports`)
      console.log("Report data:", reportData)

      // Send the report to the API with better error handling
      try {
        // Log the full request details
        console.log("Making fetch request with:", {
          url: `${API_BASE_URL}/services/reports`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reportData),
        })

        const response = await fetch(`${API_BASE_URL}/services/reports`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        })

        // Log response details
        console.log("Response status:", response.status)
        console.log("Response headers:", Object.fromEntries([...response.headers.entries()]))

        // Log the raw response for debugging
        const responseText = await response.text()
        console.log("Raw API response:", responseText)

        // If not OK, throw an error
        if (!response.ok) {
          let errorMessage = "Failed to submit report"
          try {
            // Try to parse the error as JSON
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.error || errorMessage
          } catch (parseError) {
            // If parsing fails, use the raw text or a default message
            errorMessage = responseText || errorMessage
          }
          throw new Error(errorMessage)
        }

        // Parse the response as JSON
        let result
        try {
          result = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError)
          result = { message: "Report submitted but response format was unexpected" }
        }

        console.log("Report submitted successfully:", result)

        // If there's evidence and the report was created successfully, upload it
        if (formData.evidence && result.report && result.report.id) {
          await uploadEvidence(result.report.id, formData.evidence)
        }

        // Show success message
        setSuccess(true)
        alert("Report submitted successfully!")

        // Reset form
        setFormData({
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
        setProgress(0)
      } catch (error) {
        console.error("Fetch error:", error)

        // Check if it's a network error
        if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
          setError("Network Error: Unable to connect to server. Please check if the server is running and accessible.")
        } else {
          setError(error.message)
        }
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const uploadEvidence = async (reportId, evidenceFile) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("evidence", evidenceFile)

      // Upload the evidence
      const response = await fetch(`${API_BASE_URL}/services/reports/${reportId}/evidence`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload evidence")
      }

      console.log("Evidence uploaded successfully")
    } catch (error) {
      console.error("Error uploading evidence:", error)
      // We don't want to fail the whole submission if just the evidence upload fails
      alert("Report submitted.")
    }
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

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try again or contact support if the problem persists.</p>
          </div>
        )}

        {success && (
          <div className="success-message">
            <p>Your report has been submitted successfully!</p>
          </div>
        )}

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
                    <label htmlFor="name" style={{ color: "black" }}>
                      Name:
                    </label>
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
                    <label htmlFor="email" style={{ color: "black" }}>
                      Email:
                    </label>
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
                <label htmlFor="incidentType" style={{ color: "black" }}>
                  Incident Type:
                </label>
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
                <label htmlFor="date" style={{ color: "black" }}>
                  Date of Incident:
                </label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="location" style={{ color: "black" }}>
                  Location:
                </label>
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
                <label htmlFor="policeNotified" style={{ color: "black" }}>
                  Have the police been notified?
                </label>
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
              <label htmlFor="description" style={{ color: "black" }}>
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="evidence" style={{ color: "black" }} className="file-upload">
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

            <button type="submit" className="submit-btn" disabled={submitting}>
              <FaExclamationTriangle /> {submitting ? "Submitting..." : "Submit Report"}
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

export default Report
