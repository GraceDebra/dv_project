"use client"

import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import "./Register.css"

export default function Register() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("")

  const validateForm = (formData) => {
    const newErrors = {}

    if (isSignIn) {
      const username = formData.get("username")
      const password = formData.get("password")

      if (!username) newErrors.username = "Username is required"
      if (!password) newErrors.password = "Password is required"
    } else {
      const username = formData.get("username")
      const email = formData.get("email")
      const password = formData.get("password")
      const confirmPassword = formData.get("confirmPassword")

      if (!username) newErrors.username = "Username is required"
      if (!email) newErrors.email = "Email is required"
      if (!password) newErrors.password = "Password is required"
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if (validateForm(formData)) {
      if (isSignIn) {
        // Redirect to dashboard on successful sign in
        window.location.href = "/dashboard"
      } else {
        // Clear form fields and switch to sign in mode on successful sign up
        e.target.reset()
        setIsSignIn(true)
        alert("Account created successfully. Please sign in.")
      }
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

  return (
    <div className="register-page-container">
      <a href="https://www.google.com" className="escape-button" title="Quick Exit">
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
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className={`form-input ${errors.username ? "input-error" : ""}`}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
              </div>

              {!isSignIn && (
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
              )}

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

              <button type="submit" className="submit-button">
                {isSignIn ? "Sign In" : "Create Account"}
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

