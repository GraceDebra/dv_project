"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaWhatsapp } from "react-icons/fa";
import { Shield, Scale, BookOpen, Users, Heart, HelpCircle, UserCheck, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import "./Support.css";

const Support = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("legal");

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com";
    toast.success("Redirecting to safe page...");
  };

  const legalResources = [
    {
      title: "The Constitution of Kenya (2010)",
      description: "Outlines fundamental rights, including protection from violence.",
      icon: <BookOpen className="icon" />,
      link: "https://www.kenyalaw.org/kl/index.php?id=398",
    },
    {
      title: "Protection Against Domestic Violence Act (2015)",
      description: "Defines domestic violence, protection orders, and legal recourse.",
      icon: <Shield className="icon" />,
      link: "https://kenyalaw.org/kl/fileadmin/pdfdownloads/LegalNotices/2020/LN200_2020.pdf",
    },
    {
      title: "Sexual Offences Act (2006)",
      description: "Covers sexual violence, assault, and legal protections for survivors.",
      icon: <Scale className="icon" />,
      link: "https://www.kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/SexualOffencesAct_No3of2006.pdf",
    },
    {
      title: "The Penal Code (Revised 2009)",
      description: "Details criminal offenses, including physical and emotional abuse.",
      icon: <Users className="icon" />,
      link: "https://www.kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/PenalCodeCap63.pdf",
    },
    {
      title: "Children’s Act (2022)",
      description: "Provides protections for children affected by domestic violence.",
      icon: <Heart className="icon" />,
      link: "https://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2022/TheChildrenAct_2022.pdf",
    },
    {
      title: "Witness Protection Act (2006)",
      description: "Ensures safety for survivors and witnesses testifying in court.",
      icon: <HelpCircle className="icon" />,
      link: "https://kenyalaw.org/kl/fileadmin/pdfdownloads/bills/2010/Witness_Protection%20_Amendment_%20Bill_2010.pdf?",
    },
    {
      title: "Legal Aid Act (2016)",
      description: "Governs the provision of free legal assistance to survivors.",
      icon: <UserCheck className="icon" />,
      link: "https://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/LegalAidAct_No._6_of_2016.pdf",
    },
    {
      title: "National Policy on Gender and Development (2019)",
      description: "Framework for preventing and addressing gender-based violence.",
      icon: <PhoneCall className="icon" />,
      link: "https://www.gender.go.ke/",
    },
  ];
  

  const supportPrograms = [
    {
      title: "Know Your Legal Rights",
      description: "Educational workshops on protection orders, custody rights, and legal options for survivors.",
      icon: <Scale className="icon" />,
      link: "/join-legal-rights",
    },
    {
      title: "Understanding Protection Orders",
      description: "Step-by-step guidance on obtaining and enforcing restraining orders.",
      icon: <Shield className="icon" />,
      link: "/join-protection-orders",
    },
    {
      title: "Legal Aid & Court Support",
      description: "Free consultations with lawyers and court advocacy for survivors.",
      icon: <BookOpen className="icon" />,
      link: "/join-legal-aid",
    },
    {
      title: "Trauma-Informed Counseling",
      description: "Therapeutic sessions focused on healing from abuse and PTSD recovery.",
      icon: <Heart className="icon" />,
      link: "/join-trauma-counseling",
    },
    {
      title: "Group Therapy & Peer Support",
      description: "Safe spaces for survivors to share experiences and heal together.",
      icon: <Users className="icon" />,
      link: "/join-group-therapy",
    },
    {
      title: "Financial Independence & Job Training",
      description: "Workshops on budgeting, career building, and financial empowerment.",
      icon: <BookOpen className="icon" />,
      link: "/join-financial-independence",
    },
    {
      title: "DV Awareness & Self-Advocacy Training",
      description: "Programs to help survivors identify abuse and advocate for themselves in legal and social settings.",
      icon: <HelpCircle className="icon" />,
      link: "/join-awareness-training",
    },
    {
      title: "Co-Parenting & Child Custody Rights",
      description: "Legal education and support for survivors navigating child custody cases.",
      icon: <Users className="icon" />,
      link: "/join-co-parenting",
    },
    {
      title: "Self-Defense & Personal Safety",
      description: "Hands-on training for survivors to boost confidence and stay safe.",
      icon: <Shield className="icon" />,
      link: "/join-self-defense",
    },
    {
      title: "Healing Through Art & Expression",
      description: "Creative therapy workshops using art, music, and writing for emotional recovery.",
      icon: <Heart className="icon" />,
      link: "/join-art-therapy",
    },
  ];
  

  const counselors = [
    { name: "Dr. Amina Yusuf", specialty: "Trauma & PTSD Specialist", experience: "10+ years of experience in trauma counseling", phone: "+254700123456", whatsapp: "https://wa.me/254700123456" },
    { name: "John Ochieng", specialty: "Mental Health Expert", experience: "Specializing in domestic abuse recovery", phone: "+254711654321", whatsapp: "https://wa.me/254711654321" },
    { name: "Grace Mwikali", specialty: "Psychologist", experience: "Providing emotional and psychological support", phone: "+254793743772", whatsapp: "https://wa.me/254793743772" },
  ];

  return (
    <div className={`support-container ${darkMode ? "dark" : ""}`}>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
            <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
            <button onClick={() => navigate("/support")} className="nav-link active">Support</button>
            <button onClick={() => navigate("/report-incident")} className="nav-link">Report Incident</button>
            <button onClick={() => navigate("/testimonials")} className="nav-link">Testimonials</button>
            <button onClick={() => navigate("/dashboard")} className="nav-link">Back to Dashboard</button>
          </div>
          <div className="nav-actions">
            <button onClick={handleQuickExit} className="quick-exit">Quick Exit</button>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Legal Aid, Support Programs & Counselors</h1>
        <div className="section-buttons">
          <button onClick={() => setActiveSection("legal")} className={`section-button ${activeSection === "legal" ? "active" : ""}`}>Legal Resources</button>
          <button onClick={() => setActiveSection("support")} className={`section-button ${activeSection === "support" ? "active" : ""}`}>Support Programs</button>
          <button onClick={() => setActiveSection("counselors")} className={`section-button ${activeSection === "counselors" ? "active" : ""}`}>Counselors</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Legal Resources Section */}   
        {activeSection === "legal" && (
  <section className="support-section">
    <h2 className="section-title">Legal Resources in Kenya</h2>
    <div className="support-grid">
      {legalResources.map((item, index) => (
        <div key={index} className="support-card">
          {item.icon}
          <h3 className="support-title">{item.title}</h3>
          <p className="support-description">{item.description}</p>
          <a href={item.link} className="learn-more" target="_blank" rel="noopener noreferrer">
            Learn More →
          </a>
        </div>
      ))}
    </div>
  </section>
)}

        {/* Support Programs Section */}    
        {activeSection === "support" && (
  <section className="support-section">
    <h2 className="section-title">Support Programs</h2>
    <div className="support-grid">
      {supportPrograms.map((program, index) => (
        <div key={index} className="support-card">
          {program.icon}
          <h3 className="support-title">{program.title}</h3>
          <p className="support-description">{program.description}</p>
          <a href={program.link} className="join-button">Join</a>
        </div>
      ))}
    </div>
  </section>
)}


        {/* Counselors Section */}
        {activeSection === "counselors" && (
          <section className="support-section">
            <h2 className="section-title">Counselors</h2>
            <div className="support-grid">
              {counselors.map((counselor, index) => (
                <div key={index} className="counselor-card">
                  <UserCheck className="icon" />
                  <h3 className="counselor-name">{counselor.name}</h3>
                  <p className="counselor-specialty"><strong>Specialty:</strong> {counselor.specialty}</p>
                  <p className="counselor-experience"><strong>Experience:</strong> {counselor.experience}</p>
                  <p className="counselor-phone"><strong>Phone:</strong> {counselor.phone}</p>
                  <div className="contact-buttons">
                    <a href={counselor.whatsapp} className="contact-button whatsapp-button" target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp className="whatsapp-icon" /> WhatsApp
                    </a>
                    <a href={`tel:${counselor.phone}`} className="contact-button call-button">
                      <PhoneCall className="call-icon" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Support;
