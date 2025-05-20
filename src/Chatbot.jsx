import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import { FaSun, FaMoon } from "react-icons/fa";
import "./Dashboard.css";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com";
  };

  // Load chat history from localStorage on mount
  useEffect(() => {
    setTimeout(() => {
      const saved = localStorage.getItem("chatHistory");
      if (saved) {
        console.log("Loaded chat history:", saved);
        setMessages(JSON.parse(saved));
      }
    }, 0);
  }, []);

  // Save chat history only when messages exist
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Saving chat history:", messages);
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: "__typing__" }]);

    try {
      const res = await fetch("https://62ef-102-68-77-141.ngrok-free.app/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: input }),
      });
      const data = await res.json();

      const botMessages = data
        .filter((msg) => msg.text)
        .map((msg) => ({
          sender: "bot",
          text: msg.text,
        }));

      setMessages((prev) => {
        const updated = prev.filter((msg) => msg.text !== "__typing__");
        return [...updated, ...botMessages];
      });
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => {
        const updated = prev.filter((msg) => msg.text !== "__typing__");
        return [...updated, { sender: "bot", text: "Oops! Something went wrong." }];
      });
    }

    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasUserSentMessage = messages.some((msg) => msg.sender === "user");

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      {/* Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-content">
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link active">AI Support</button>
            <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
            <button onClick={() => navigate("/support")} className="nav-link">Support</button>
            <button onClick={() => navigate("/report-incident")} className="nav-link">Report Incident</button>
            <button onClick={() => navigate("/testimonials")} className="nav-link">Testimonials</button>
            <button onClick={() => navigate("/dashboard")} className="nav-link">Back to Dashboard</button>
          </div>
          <div className="nav-actions">
            <button onClick={handleQuickExit} className="quick-exit-btn">Quick Exit</button>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
              {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Chatbot Body */}
      <div style={styles.container}>
        <div style={styles.chatBox}>
          {!hasUserSentMessage && (
            <div style={styles.welcomeMessage}>
              Hello, I’m here to support you. What can I help you with?
            </div>
          )}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
          ))}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>Send</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "calc(100vh - 70px)",
    padding: "40px 16px",
    background:
      "linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.85)), url('https://www.transparenttextures.com/patterns/pw-maze-white.png') center/cover no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  chatBox: {
    width: "100%",
    maxWidth: 1000,
    height: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#111827",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },
  inputArea: {
    display: "flex",
    backgroundColor: "#374151",
    width: "100%",
    maxWidth: 600,
    padding: 18,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    border: "none",
    backgroundColor: "#374151",
    color: "#fff",
    outline: "none",
  },
  sendButton: {
    padding: "10px 16px",
    backgroundColor: "#9333ea",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
   welcomeMessage: {
    width: "100%",
    textAlign: "center",
    padding: 20,
    color: "#ddd",
    fontSize: 20,
    fontWeight: "600",
  },
};

export default Chatbot;