"use client"

import { useState, useEffect } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { registerUser, loginUser, testServerConnection } from "./services/api"
import "./Register.css"

export default function Register() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")
  const [serverStatus, setServerStatus] = useState({
    checked: false,
    running: false,
    message: "Checking server connection...",
  })

  // Test server connection on component mount with retry logic
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 3

    const checkServerConnection = async () => {
      try {
        console.log(`Attempting to connect to server (attempt ${retryCount + 1}/${maxRetries + 1})...`)
        await testServerConnection()
        setServerStatus({
          checked: true,
          running: true,
          message: "Connected successfully",
        })
        console.log("Server connection successful!")
      } catch (error) {
        console.error("Server Connection Test Failed:", error)

        if (retryCount < maxRetries) {
          retryCount++
          const retryDelay = 2000 // 2 seconds between retries
          console.log(`Retrying in ${retryDelay / 1000} seconds...`)

          setServerStatus({
            checked: true,
            running: false,
            message: `Connection failed. Retrying (${retryCount}/${maxRetries})...`,
          })

          setTimeout(checkServerConnection, retryDelay)
        } else {
          setServerStatus({
            checked: true,
            running: false,
            message: error.message || "Server connection failed after multiple attempts",
          })

          // Show more detailed error message
          alert(
            `Server is unavailable. Please check:\n1. Backend server running\n2. Network connection\n3. Firewall settings\n\nError details: ${error.message}`,
          )
        }
      }
    }

    checkServerConnection()

    // Optional: Add periodic reconnection attempts if initial connection fails
    const connectionInterval = setInterval(() => {
      if (!serverStatus.running && serverStatus.checked) {
        checkServerConnection()
      }
    }, 30000) // Try every 30 seconds

    return () => clearInterval(connectionInterval)
  }, [])

  const validateForm = (formData) => {
    const newErrors = {}

    if (isSignIn) {
      const email = formData.get("email")
      const password = formData.get("password")

      if (!email) newErrors.email = "Email is required"
      if (!password) newErrors.password = "Password is required"
    } else {
      const fullName = formData.get("fullName")
      const email = formData.get("email")
      const password = formData.get("password")
      const confirmPassword = formData.get("confirmPassword")

      if (!fullName) newErrors.fullName = "Full name is required"
      if (!email) newErrors.email = "Email is required"
      if (!password) newErrors.password = "Password is required"
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
      if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setApiError("")

    // Check server status before attempting submission
    if (!serverStatus.running) {
      const proceed = window.confirm(
        "The server appears to be offline. Your request may fail. Do you want to try anyway?",
      )
      if (!proceed) {
        setIsSubmitting(false)
        return
      }
    }

    const formData = new FormData(e.target)
    if (validateForm(formData)) {
      try {
        if (isSignIn) {
          // Handle sign in
          const credentials = {
            email: formData.get("email"),
            password: formData.get("password"),
          }

          console.log("Submitting login with:", credentials.email)
          const response = await loginUser(credentials)

          // Store the token in localStorage
          localStorage.setItem("authToken", response.token)

          // Store user data if needed
          localStorage.setItem("userData", JSON.stringify(response.user))

          // Redirect to dashboard
          window.location.href = "/dashboard"
        } else {
          // Handle registration
          const userData = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password"),
          }

          const response = await registerUser(userData)

          // Show success message
          alert("Registration successful! Please sign in to continue.")

          // Clear form fields and switch to sign in mode on successful sign up
          e.target.reset()
          setIsSignIn(true)
        }
      } catch (error) {
        setApiError(error.message)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    // Here you would typically send a request to your backend to handle the password reset
    // For this example, we'll just show a success message
    setForgotPasswordMessage("If an account exists for this email, a password reset link will be sent.")
    setTimeout(() => {
      setShowForgotPassword(false)
      setForgotPasswordEmail("")
      setForgotPasswordMessage("")
    }, 3000)
  }

  // Function to manually retry server connection
  const retryConnection = async () => {
    setServerStatus({
      checked: false,
      running: false,
      message: "Retrying connection...",
    })

    try {
      await testServerConnection()
      setServerStatus({
        checked: true,
        running: true,
        message: "Connected successfully",
      })
    } catch (error) {
      setServerStatus({
        checked: true,
        running: false,
        message: error.message || "Server connection failed",
      })
    }
  }

  return (
    <div className="register-page-container">
      <a href="/" className="escape-button" title="Quick Exit">
        <X className="escape-icon" />
        <span className="sr-only">Exit quickly</span>
      </a>

      <div className="left-panel">
        <div className="left-panel-content">
          <h1 className="left-panel-title">Safe Space Support Network</h1>
          <p className="left-panel-description">
            A confidential place where you can find support, resources, and community. Your safety and wellbeing are our
            priority.
          </p>
          <div className="left-panel-services">
            <p className="services-title">We offer:</p>
            <ul className="services-list">
              <li>24/7 Crisis Support</li>
              <li>Confidential Resources</li>
              <li>Safety Planning</li>
              <li>Community Connection</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="right-panel-content">
          <div className="form-header">
            <h2 className="form-title">{isSignIn ? "Welcome Back" : "Join Our Community"}</h2>
            <p className="form-subtitle">
              {isSignIn
                ? "Sign in to access your support resources"
                : "Create an account to connect with support services"}
            </p>
          </div>

          <div className="form-container">
            {serverStatus.checked && !serverStatus.running && (
              <div className="api-error-container">
                <p className="api-error-message">
                  Server Connection Error: Network Error: Unable to connect to server. Please check if the server is
                  running at http://localhost:8081
                </p>
                <button onClick={retryConnection} className="retry-button">
                  Retry Connection
                </button>
              </div>
            )}

            {apiError && (
              <div className="api-error-container">
                <p className="api-error-message">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isSignIn && (
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    className={`form-input ${errors.fullName ? "input-error" : ""}`}
                  />
                  {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  {isSignIn && (
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="forgot-password">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="password-input-container">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="password-toggle">
                    {showPassword ? <EyeOff className="password-icon" /> : <Eye className="password-icon" />}
                  </button>
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>

              {!isSignIn && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="password-input-container">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="password-toggle">
                      {showPassword ? <EyeOff className="password-icon" /> : <Eye className="password-icon" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <div className="error-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="error-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Please correct the errors above to continue.</span>
                </div>
              )}

              <button type="submit" className={`submit-button ${!serverStatus.running ? "submit-button-warning" : ""}`}>
                {isSubmitting ? "Processing..." : isSignIn ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="form-footer">
              <p className="toggle-form-text">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignIn(!isSignIn)
                    setErrors({})
                    setApiError("")
                  }}
                  className="toggle-form-button"
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          <div className="privacy-notice">
            <p>This is a safe and secure platform. Your information is protected and confidential.</p>
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowForgotPassword(false)}>
              <X />
            </button>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label htmlFor="forgotPasswordEmail">Email</label>
                <input
                  id="forgotPasswordEmail"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="submit-button">
                Reset Password
              </button>
            </form>
            {forgotPasswordMessage && <p className="forgot-password-message">{forgotPasswordMessage}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

