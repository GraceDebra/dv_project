import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import Register from './Register';
import Dashboard from './Dashboard'; 
import ResourceLocator from './ResourceLocator';
import SafetyPlan from './SafetyPlan';
import Resources from './Resources';
import Testimonials from './Testimonials';
import Report from './Report';
import Support from './Support';
import RiskAssessment from './RiskAssessment';

const Home = () => {
  const [showQuickExit, setShowQuickExit] = useState(false);
  const navigate = useNavigate();

  function handleQuickExit() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "https://weather.com";
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div></div>
        <h1>Safe Haven</h1>
        <button 
          className={styles.escapeButton}
          onClick={handleQuickExit}
          onMouseEnter={() => setShowQuickExit(true)}
          onMouseLeave={() => setShowQuickExit(false)}
        >
          {showQuickExit ? 'Quick Exit' : '✕ Quick Exit'}
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.introduction}>
          <h2>Welcome to Safe Haven</h2>
          <p>Our platform supports domestic violence survivors with real-time alerts, access to critical resources, and AI-driven guidance to ensure your safety and well-being.</p>
        </section>

        <section className={styles.features}>
          <h3>Key Features</h3>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔔</span>
              <h4>Real-Time Alerts</h4>
              <p>Receive notifications about nearby shelters and emergency services when you need them.</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🛡️</span>
              <h4>Risk Assessment</h4>
              <p>Get personalized insights into potential risks based on your situation.</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💬</span>
              <h4>AI Chatbot</h4>
              <p>Access instant, anonymous support through our chatbot, offering resources and guidance tailored to your needs.</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🗺️</span>
              <h4>Resource Directory</h4>
              <p>Find local support services, shelters, and helplines.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h3>Take the Next Step</h3>
          <p>When you're ready, sign up to access personalized safety resources and real-time alerts.</p>
          <button className={styles.ctaButton} onClick={() => navigate('/register')}>Register Now</button>
        </section>

        <section className={styles.privacy}>
          <h3>Your Privacy Matters</h3>
          <p>We take your privacy seriously. Your data will always be kept secure and confidential.</p>
          <Link to="#" className={styles.link}>View Privacy Policy</Link>
        </section>

        <section className={styles.faq}>
          <h3>Frequently Asked Questions</h3>
          <div className={styles.faqItem}>
            <h4>How does the AI chatbot work?</h4>
            <p>Our AI chatbot offers anonymous, instant support to help guide you toward the resources and assistance you need.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>What do I do if I need immediate help?</h4>
            <p>You can quickly exit the platform by clicking the Quick Exit button, always visible at the top of the page.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>How is my data kept secure?</h4>
            <p>We prioritize your safety and privacy. Your data is kept secure with stringent protection measures.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Safe Haven. All rights reserved.</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resource-locator" element={<ResourceLocator />} />
        <Route path="/safety-plan" element={<SafetyPlan />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/report" element={<Report />} />
        <Route path="/support" element={<Support />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
      </Routes>
    </Router>
  );
};

export default App;
