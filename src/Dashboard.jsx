"use client"

import { useState, useRef } from "react"
import "./Dashboard.css"
import { useNavigate } from "react-router-dom"
import UserProfile from "./components/UserProfile"
import {
  Shield,
  MapPin,
  Bot,
  BookOpen,
  AlertTriangle,
  Scale,
  Quote,
  Sun,
  Moon,
  Flag,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const Dashboard = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false) // Removed sidebar state

  // Refs for scrolling
  const chatbotRef = useRef(null)
  const resourceRef = useRef(null)
  const riskRef = useRef(null)
  const supportRef = useRef(null)
  const reportRef = useRef(null)
  const testimonialsRef = useRef(null)

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com"
  }

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <div className="dashboard-container">
        {/* Removed Sidebar */}
        {/* <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <Shield size={24} />
              <h1>SafeSpace</h1>
            </div>
          </div>
          <div className="sidebar-content">
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item">
                <button onClick={() => scrollToSection(chatbotRef)}>
                  <Bot size={20} />
                  <span>AI Support</span>
                </button>
              </li>
              <li className="sidebar-menu-item">
                <button onClick={() => scrollToSection(resourceRef)}>
                  <BookOpen size={20} />
                  <span>Resources</span>
                </button>
              </li>
              <li className="sidebar-menu-item">
                <button onClick={() => scrollToSection(riskRef)}>
                  <AlertTriangle size={20} />
                  <span>Risk Assessment</span>
                </button>
              </li>
              <li className="sidebar-menu-item">
                <button onClick={() => scrollToSection(supportRef)}>
                  <Scale size={20} />
                  <span>Support</span>
                </button>
              </li>
              <li className="sidebar-menu-item">
                <button onClick={() => scrollToSection(reportRef)}>
                  <Flag size={20} />
                  <span>Report Incident</span>
                </button>
              </li>
              <li className="sidebar-menu-item">
                <button onClick={() => scrollToSection(testimonialsRef)}>
                  <Quote size={20} />
                  <span>Testimonials</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="sidebar-footer"></div>
        </aside> */}

        {/* Main Content */}
        <div className="main-content">
          {/* Top Navigation Bar */}
          <nav className="navbar">
            <div className="nav-links">
              <button onClick={() => scrollToSection(chatbotRef)} className="nav-link">
                AI Support
              </button>
              <button onClick={() => scrollToSection(resourceRef)} className="nav-link">
                Resources
              </button>
              <button onClick={() => scrollToSection(riskRef)} className="nav-link">
                Risk Assessment
              </button>
              <button onClick={() => scrollToSection(supportRef)} className="nav-link">
                Support
              </button>
              <button onClick={() => scrollToSection(reportRef)} className="nav-link">
                Report Incident
              </button>
              <button onClick={() => scrollToSection(testimonialsRef)} className="nav-link">
                Testimonials
              </button>
            </div>

            {/* Right Section - User Profile, Quick Exit & Theme Toggle */}
            <div className="nav-right">
              <UserProfile onLogout={handleLogout} />
              <button className="quick-exit" onClick={handleQuickExit}>
                Quick Exit
              </button>
              <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu">
              <button onClick={() => scrollToSection(chatbotRef)} className="mobile-menu-item">
                <Bot size={20} /> AI Support
              </button>
              <button onClick={() => scrollToSection(resourceRef)} className="mobile-menu-item">
                <BookOpen size={20} /> Resources
              </button>
              <button onClick={() => scrollToSection(riskRef)} className="mobile-menu-item">
                <AlertTriangle size={20} /> Risk Assessment
              </button>
              <button onClick={() => scrollToSection(supportRef)} className="mobile-menu-item">
                <Scale size={20} /> Support
              </button>
              <button onClick={() => scrollToSection(reportRef)} className="mobile-menu-item">
                <Flag size={20} /> Report Incident
              </button>
              <button onClick={() => scrollToSection(testimonialsRef)} className="mobile-menu-item">
                <Quote size={20} /> Testimonials
              </button>
              <div className="mobile-menu-footer">
                <button className="mobile-quick-exit" onClick={handleQuickExit}>
                  Quick Exit
                </button>
                <button className="mobile-logout" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}

          {/* Quick Access Buttons */}
          <div className="quick-access">
            <button onClick={() => navigate("/safety-plan")}>
              <Shield size={18} /> Safety Plan
            </button>
            <button onClick={() => navigate("/resource-locator")}>
              <MapPin size={18} /> Find Clinics and Shelters
            </button>
          </div>

          {/* Dashboard Features */}
          <div className="grid">
            <div ref={chatbotRef} className="card ai-support">
              <div className="card-icon">
                <Bot size={30} />
              </div>
              <h3>AI Support Chatbot</h3>
              <p>Get immediate support and guidance.</p>
              <button className="card-btn" onClick={() => navigate("/chatbot")}>
                Open Chatbot
              </button>
            </div>

            <div ref={resourceRef} className="card resources">
              <div className="card-icon">
                <BookOpen size={30} />
              </div>
              <h3>Resource Center</h3>
              <p>Learn more about DV, IPV, and related topics.</p>
              <button className="card-btn" onClick={() => navigate("/resources")}>
                Get Informed
              </button>
            </div>

            <div ref={riskRef} className="card risk-assessment">
              <div className="card-icon">
                <AlertTriangle size={30} />
              </div>
              <h3>Risk Assessment</h3>
              <p>Evaluate your current risk level.</p>
              <button onClick={() => navigate("/risk-assessment")} className="card-btn">
                Start Assessment
              </button>
            </div>

            <div ref={supportRef} className="card support">
              <div className="card-icon">
                <Scale size={30} />
              </div>
              <h3>Support</h3>
              <p>Access guided counseling and legal services.</p>
              <button className="card-btn" onClick={() => navigate("/support")}>
                Get Support
              </button>
            </div>

            <div ref={reportRef} className="card report">
              <div className="card-icon">
                <Flag size={30} />
              </div>
              <h3>Report Incident</h3>
              <p>Report cases of domestic violence.</p>
              <button className="card-btn" onClick={() => navigate("/report-incident")}>
                Report
              </button>
            </div>

            <div ref={testimonialsRef} className="card testimonials">
              <div className="card-icon">
                <Quote size={30} />
              </div>
              <h3>Testimonials</h3>
              <p>See other survivors' stories.</p>
              <button className="card-btn" onClick={() => navigate("/testimonials")}>
                See Testimonies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard