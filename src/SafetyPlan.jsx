"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react";
import { X, Shield, Phone, MapPin, FileText, HeartPulse, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import "./SafetyPlan.css"

const SafetyPlan = () => {
  const [showDiscreteMode, setShowDiscreteMode] = useState(false)

  const handleQuickExit = () => {
    window.location.href = "https://weather.com"
  }

  const sections = [
    {
      title: "Emergency Contacts",
      icon: <Phone className="icon" />,
      content: (
        <div className="content-wrapper">
          <div className="content-item">
            <h4>National Domestic Violence Hotline</h4>
            <p>1195</p>
          </div>
          <div className="content-item">
            <h4>Emergency Services</h4>
            <p>911</p>
          </div>
        </div>
      ),
    },
    {
      title: "Safe Locations",
      icon: <MapPin className="icon" />,
      content: (
        <div className="content-wrapper">
          <div className="content-item">
            <h4>Add Safe Places</h4>
            <p>Local police stations, trusted friends' homes, domestic violence shelters</p>
          </div>
        </div>
      ),
    },
    {
      title: "Important Documents",
      icon: <FileText className="icon" />,
      content: (
        <div className="content-wrapper">
          <div className="content-item">
            <h4>Document Checklist</h4>
            <ul>
              <li>Identification</li>
              <li>Birth certificates</li>
              <li>Social security cards</li>
              <li>Insurance information</li>
              <li>Bank statements</li>
              <li>Medical records</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Safety Checklist",
      icon: <Shield className="icon" />,
      content: (
        <div className="content-wrapper">
          <div className="content-item">
            <h4>Daily Safety Steps</h4>
            <ul>
              <li>Keep your phone charged and nearby</li>
              <li>Have a code word with trusted friends</li>
              <li>Know your exits</li>
              <li>Keep emergency cash hidden</li>
              <li>Pack an emergency bag</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="safety-plan">
      <div className="top-buttons">
        <button
          onClick={() => {
            setShowDiscreteMode(!showDiscreteMode)
            toast.success(showDiscreteMode ? "Safety mode activated" : "Notes mode activated")
          }}
          className="mode-toggle-button"
        >
          {showDiscreteMode ? <Shield className="icon" /> : <ShieldAlert className="icon" />}
        </button>
        <button onClick={handleQuickExit} className="quick-exit-button">
          Quick Exit
        </button>
      </div>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="header">
          <h1>{showDiscreteMode ? "My Notes" : "Safety Planning"}</h1>
          <p>
            {showDiscreteMode
              ? "Keep your personal notes organized and accessible."
              : "Your comprehensive guide to staying safe and prepared."}
          </p>
        </motion.div>
        <div className="sections-grid">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="section-card"
            >
              <div className="section-header">
                <div className="icon-wrapper">{section.icon}</div>
                <h2>{showDiscreteMode ? `Section ${index + 1}` : section.title}</h2>
              </div>
              <div className="section-content">{section.content}</div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="footer">
          <div className="footer-content">
            <HeartPulse className="icon" />
            <span>
              {showDiscreteMode ? "Your notes are private and secure" : "You are not alone. Help is available 24/7"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SafetyPlan

