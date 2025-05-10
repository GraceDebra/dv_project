import React, { useState, useRef } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import UserProfile from "./components/Userprofile";
import { 
  Bell, Shield, MapPin, Bot, BookOpen, 
  AlertTriangle, Scale, Quote, Sun, Moon, Flag
} from "lucide-react";

const Dashboard = () => { 
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Refs for scrolling
  const chatbotRef = useRef(null);
  const resourceRef = useRef(null);
  const riskRef = useRef(null);
  const supportRef = useRef(null);
  const reportRef = useRef(null);
  const testimonialsRef = useRef(null);

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com";
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={() => scrollToSection(chatbotRef)} className="nav-link">AI Support</button>
          <button onClick={() => scrollToSection(resourceRef)} className="nav-link">Resources</button>
          <button onClick={() => scrollToSection(riskRef)} className="nav-link">Risk Assessment</button>
          <button onClick={() => scrollToSection(supportRef)} className="nav-link">Support</button>
          <button onClick={() => scrollToSection(reportRef)} className="nav-link">Report</button>
          <button onClick={() => scrollToSection(testimonialsRef)} className="nav-link">Testimonials</button>
        </div>

        {/* Right Section - User Profile, Quick Exit & Theme Toggle */}
        <div className="nav-right">
          <UserProfile onLogout={handleLogout} />
          <button className="quick-exit" onClick={handleQuickExit}>Quick Exit</button>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Status Section */}
      <div className="status-box">
        <label>Current Status:</label>
        <select className="status-dropdown">
          <option>Safe</option>
          <option>At Risk</option>
        </select>
      </div>

      {/* Quick Access Buttons */}
      <div className="quick-access">
        <button>
          <Bell size={18} /> Emergency Contacts
        </button>
        <button onClick={() => navigate("/safety-plan")}>
          <Shield size={18} /> Safety Plan
        </button>
        <button onClick={() => navigate("/resource-locator")}>
          <MapPin size={18} /> Find Clinics and Shelters
        </button>
      </div>

      {/* Dashboard Features */}
      <div className="grid">
        <div ref={chatbotRef} className="card" style={{ backgroundColor: "#b8a9c9" }}>
          <Bot size={30} />
          <h3>AI Support Chatbot</h3>
          <p>Get immediate support and guidance.</p>
          <button className="card-btn">Open Chatbot</button>
        </div>

        <div ref={resourceRef} className="card" style={{ backgroundColor: "#96ceb4" }}>
          <BookOpen size={30} />
          <h3>Resource Center</h3>
          <p>Learn more about DV, IPV, and related topics.</p>
          <button className="card-btn" onClick={() => navigate("/resources")}>Get Informed</button>
        </div>

        <div ref={riskRef} className="card" style={{ backgroundColor: "#87bdd8" }}>
          <AlertTriangle size={30} />
          <h3>Risk Assessment</h3>
          <p>Evaluate your current risk level.</p>
          <button className="card-btn">Start Assessment</button>
        </div>

        <div ref={supportRef} className="card" style={{ backgroundColor: "#E5D5C3" }}>
          <Scale size={30} />
          <h3>Support</h3>
          <p>Access guided counseling and legal services.</p>
          <button className="card-btn" onClick={() => navigate("/support")}>Get Support</button>
        </div>

        <div ref={reportRef} className="card" style={{ backgroundColor: "#E7CBCB" }}>
          <Flag size={30} />
          <h3>Report Incident</h3>
          <p>Report cases</p>
          <button className="card-btn" onClick={() => navigate("/report")}>Report</button>
        </div>

        <div ref={testimonialsRef} className="card" style={{ backgroundColor: "pink" }}>
          <Quote size={30} />
          <h3>Testimonials</h3>
          <p>See other survivors' stories</p>
          <button className="card-btn" onClick={() => navigate("/testimonials")}>See Testimonies</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;