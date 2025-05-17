"use client"

import { useState } from "react"
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom"
import styles from "./App.module.css"
import Register from "./Register"
import Dashboard from "./Dashboard"
import ResourceLocator from "./ResourceLocator"
import SafetyPlan from "./SafetyPlan"
import Resources from "./Resources"
import Testimonials from "./Testimonials"
import Report from "./Report"
import Support from "./Support"
import RiskAssessment from "./RiskAssessment"
import Chatbot from "./Chatbot"

const Home = () => {
  const [showQuickExit, setShowQuickExit] = useState(false)
  const navigate = useNavigate()

  function handleQuickExit() {
    sessionStorage.clear()
    localStorage.clear()
    window.location.href = "https://weather.com"
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div></div>
        <h1 className={styles.logo}>Safe Haven</h1>
        <button
          className={styles.escapeButton}
          onClick={handleQuickExit}
          onMouseEnter={() => setShowQuickExit(true)}
          onMouseLeave={() => setShowQuickExit(false)}
        >
          {showQuickExit ? "Quick Exit" : "✕ Quick Exit"}
        </button>
      </header>

      <main className={styles.main}>
        {/* Introduction Section */}
        <section className={styles.introduction}>
          <h2>Welcome to Safe Haven</h2>
          <p>
            Our platform supports domestic violence survivors with real-time alerts, access to critical resources, and
            AI-driven guidance to ensure your safety and well-being.
          </p>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h3>Key Features</h3>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📍</div>
              <h4>Aid Navigator</h4>
              <p>Access a live database of shelters and support services based on your location.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🛡️</div>
              <h4>Risk Assessment</h4>
              <p>Get personalized insights into potential risks based on your situation.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💬</div>
              <h4>AI Chatbot</h4>
              <p>
                Access instant, anonymous support through our chatbot, offering resources and guidance tailored to your
                needs.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🗺️</div>
              <h4>Resource Directory</h4>
              <p>Find local support services, shelters, and helplines.</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className={styles.services}>
          <div className={styles.servicesHeader}>
            <h3>How We Can Help</h3>
            <p>Our comprehensive support system is designed to provide assistance at every step of your journey</p>
          </div>

          <div className={styles.servicesContainer}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🗺️</div>
              <div className={styles.serviceContent}>
                <h4>Resource Locator</h4>
                <p>Find nearby shelters, legal aid, and support groups tailored to your specific needs and location.</p>
                <div className={styles.serviceTagContainer}>
                  <span className={styles.serviceTag}>Shelters</span>
                  <span className={styles.serviceTag}>Legal Aid</span>
                  <span className={styles.serviceTag}>Support Groups</span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📝</div>
              <div className={styles.serviceContent}>
                <h4>Safety Planning</h4>
                <p>
                  Create a personalized safety strategy with practical steps to enhance your security and well-being.
                </p>
                <div className={styles.serviceTagContainer}>
                  <span className={styles.serviceTag}>Personalized</span>
                  <span className={styles.serviceTag}>Practical</span>
                  <span className={styles.serviceTag}>Secure</span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📚</div>
              <div className={styles.serviceContent}>
                <h4>Resources Library</h4>
                <p>
                  Access our extensive collection of articles, guides, and educational materials on domestic violence.
                </p>
                <div className={styles.serviceTagContainer}>
                  <span className={styles.serviceTag}>Educational</span>
                  <span className={styles.serviceTag}>Comprehensive</span>
                  <span className={styles.serviceTag}>Accessible</span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📊</div>
              <div className={styles.serviceContent}>
                <h4>Risk Assessment</h4>
                <p>
                  Evaluate potential risks with our confidential assessment tool to help inform your safety decisions.
                </p>
                <div className={styles.serviceTagContainer}>
                  <span className={styles.serviceTag}>Confidential</span>
                  <span className={styles.serviceTag}>Informative</span>
                  <span className={styles.serviceTag}>Supportive</span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>💬</div>
              <div className={styles.serviceContent}>
                <h4>Survivor Stories</h4>
                <p>Draw strength and inspiration from the experiences of others who have navigated similar journeys.</p>
                <div className={styles.serviceTagContainer}>
                  <span className={styles.serviceTag}>Inspiring</span>
                  <span className={styles.serviceTag}>Community</span>
                  <span className={styles.serviceTag}>Healing</span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📣</div>
              <div className={styles.serviceContent}>
                <h4>Incident Reporting</h4>
                <p>Document incidents in a secure environment with guidance on appropriate next steps and resources.</p>
                <div className={styles.serviceTagContainer}>
                  <span className={styles.serviceTag}>Secure</span>
                  <span className={styles.serviceTag}>Private</span>
                  <span className={styles.serviceTag}>Guided</span>
                </div>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🤝</div>
              <div className={styles.serviceContent}>
                <h4>24/7 Support</h4>
                <p>Connect with trained advocates anytime through our confidential chat, call, or text services.</p>
                <div className={styles.serviceTagContainer}>
                  <span className={styles.serviceTag}>Always Available</span>
                  <span className={styles.serviceTag}>Confidential</span>
                  <span className={styles.serviceTag}>Professional</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.servicesFooter}>
            <div className={styles.servicesQuote}>
              <p>"Every journey begins with a single step. We're here to walk alongside you."</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h3>Take the Next Step</h3>
          <p>When you're ready, sign up to access personalized safety resources and real-time alerts.</p>
          <button className={styles.ctaButton} onClick={() => navigate("/register")}>
            Register Now
          </button>
        </section>

        {/* Privacy Section */}
        <section className={styles.privacy}>
          <h3>Your Privacy Matters</h3>
          <p>We take your privacy seriously. Your data will always be kept secure and confidential.</p>
          <Link to="#" className={styles.link}>
            View Privacy Policy
          </Link>
        </section>

        {/* FAQ Section */}
        <section className={styles.faq}>
          <h3>Frequently Asked Questions</h3>
          <div className={styles.faqItem}>
            <h4>How does the AI chatbot work?</h4>
            <p>
              Our AI chatbot offers anonymous, instant support to help guide you toward the resources and assistance you
              need.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h4>What do I do if I need immediate help?</h4>
            <p>
              You can quickly exit the platform by clicking the Quick Exit button, always visible at the top of the
              page.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h4>How is my data kept secure?</h4>
            <p>We prioritize your safety and privacy. Your data is kept secure with stringent protection measures.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Safe Haven. All rights reserved.</p>
      </footer>
    </div>
  )
}

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
        <Route path="/report-incident" element={<Report/>} />
        <Route path="/support" element={<Support />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
        <Route path="/chatbott" element={<Chatbot />} />
      </Routes>
    </Router>
  )
}

export default App
