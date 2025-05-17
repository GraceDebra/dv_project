import { FaSun, FaMoon } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "./AISupport.css";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate()

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com"
  }

  return (
    <nav className="navbar">
      {/* Left: Navigation Links */}
      <div className="nav-links">
        <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
        <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
        <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
        <button onClick={() => navigate("/support")} className="nav-link">Support</button>
        <button onClick={() => navigate("/report-incident")} className="nav-link">Report Incident</button>
        <button onClick={() => navigate("/testimonials")} className="nav-link">Testimonials</button>
        <button onClick={() => navigate("/dashboard")} className="nav-link">Back to Dashboard</button>
      </div>

      {/* Right: Quick Exit & Theme Toggle */}
      <div className="nav-right">
        <button className="quick-exit" onClick={handleQuickExit}>Quick Exit</button>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
