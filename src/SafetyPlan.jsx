"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Phone, Map, FileText, Shield, MessageSquare, Calendar, Plus, Trash2, Edit, Eye, EyeOff, Send, Upload, LogOut, Sun, Moon,} from "lucide-react"
import "./SafetyPlan.css"

const SafetyPlan = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [stealthMode, setStealthMode] = useState(false)
  const [stealthTitle, setStealthTitle] = useState("Grocery List")
  const [activeTab, setActiveTab] = useState("checklist")

  // State for safety checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Pack essential medications", completed: false, priority: "high" },
    { id: 2, text: "Gather important identification documents", completed: false, priority: "high" },
    { id: 3, text: "Prepare emergency cash", completed: false, priority: "high" },
    { id: 4, text: "Pack a change of clothes", completed: false, priority: "medium" },
    { id: 5, text: "Notify trusted friend", completed: false, priority: "medium" },
  ])

  // State for emergency contacts
  const [contacts, setContacts] = useState([
    { id: 1, name: "Local Shelter", phone: "0800 720 553", type: "COVAW" },
    { id: 2, name: "Crisis Hotline", phone: "1195", type: "hotline" },
  ])

  // State for safe locations
  const [locations, setLocations] = useState([
    { id: 1, name: "Rescue Dada Centre", address: "Ngara,Nairobi", notes: "Open 24/7" },
    { id: 2, name: "Police Station", address: "Kasarani", notes: "Ask for Officer Johnson" },
  ])

  // State for documents
  const [documents, setDocuments] = useState([
    { id: 1, name: "Restraining Order", type: "legal", date: "2023-10-15" },
    { id: 2, name: "Birth Certificate", type: "identification", date: "2023-09-20" },
  ])

  // State for code words
  const [codeWords, setCodeWords] = useState([
    { id: 1, word: "red roses", meaning: "Send help immediately", contact: "Mom" },
    { id: 2, word: "need groceries", meaning: "Come pick me up", contact: "Sister" },
  ])

  // State for emergency messages
  const [emergencyMessages, setEmergencyMessages] = useState([
    { id: 1, message: "I need help. Please call me.", contact: "Crisis Hotline", phone: "1195" },
    { id: 2, message: "Can you come get me? I'm at our meeting spot.", contact: "Sister", phone: "0798241003" },
  ])

  // State for reminders
  const [reminders, setReminders] = useState([
    { id: 1, task: "Update safety plan", date: "2023-11-01", completed: false },
    { id: 2, task: "Check in with counselor", date: "2023-10-25", completed: false },
  ])

  // State for new item forms
  const [newItem, setNewItem] = useState({
    checklist: { text: "", priority: "medium" },
    contact: { name: "", phone: "", type: "personal" },
    location: { name: "", address: "", notes: "" },
    codeWord: { word: "", meaning: "", contact: "" },
    message: { message: "", contact: "", phone: "" },
    reminder: { task: "", date: "", completed: false },
  })

  // New state for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode)
  }, [darkMode])

  const handleQuickExit = () => {
    window.location.href = "https://weather.com"
  }

  const toggleStealthMode = () => {
    setStealthMode(!stealthMode)
  }

  const addChecklistItem = () => {
    if (newItem.checklist.text.trim() === "") return

    const newChecklistItem = {
      id: Date.now(),
      text: newItem.checklist.text,
      completed: false,
      priority: newItem.checklist.priority,
    }

    setChecklist([...checklist, newChecklistItem])
    setNewItem({ ...newItem, checklist: { text: "", priority: "medium" } })
  }

  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const deleteChecklistItem = (id) => {
    setChecklist(checklist.filter((item) => item.id !== id))
  }

  const addContact = () => {
    if (newItem.contact.name.trim() === "" || newItem.contact.phone.trim() === "") return

    const newContactItem = {
      id: Date.now(),
      name: newItem.contact.name,
      phone: newItem.contact.phone,
      type: newItem.contact.type,
    }

    setContacts([...contacts, newContactItem])
    setNewItem({ ...newItem, contact: { name: "", phone: "", type: "personal" } })
  }

  const deleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  const addLocation = () => {
    if (newItem.location.name.trim() === "" || newItem.location.address.trim() === "") return

    const newLocationItem = {
      id: Date.now(),
      name: newItem.location.name,
      address: newItem.location.address,
      notes: newItem.location.notes,
    }

    setLocations([...locations, newLocationItem])
    setNewItem({ ...newItem, location: { name: "", address: "", notes: "" } })
  }

  const deleteLocation = (id) => {
    setLocations(locations.filter((location) => location.id !== id))
  }

  const addCodeWord = () => {
    if (newItem.codeWord.word.trim() === "" || newItem.codeWord.meaning.trim() === "") return

    const newCodeWordItem = {
      id: Date.now(),
      word: newItem.codeWord.word,
      meaning: newItem.codeWord.meaning,
      contact: newItem.codeWord.contact,
    }

    setCodeWords([...codeWords, newCodeWordItem])
    setNewItem({ ...newItem, codeWord: { word: "", meaning: "", contact: "" } })
  }

  const deleteCodeWord = (id) => {
    setCodeWords(codeWords.filter((codeWord) => codeWord.id !== id))
  }

  const addEmergencyMessage = () => {
    if (
      newItem.message.message.trim() === "" ||
      newItem.message.contact.trim() === "" ||
      newItem.message.phone.trim() === ""
    )
      return

    const newMessageItem = {
      id: Date.now(),
      message: newItem.message.message,
      contact: newItem.message.contact,
      phone: newItem.message.phone,
    }

    setEmergencyMessages([...emergencyMessages, newMessageItem])
    setNewItem({ ...newItem, message: { message: "", contact: "", phone: "" } })
  }

  const deleteEmergencyMessage = (id) => {
    setEmergencyMessages(emergencyMessages.filter((message) => message.id !== id))
  }

  const addReminder = () => {
    if (newItem.reminder.task.trim() === "" || newItem.reminder.date.trim() === "") return

    const newReminderItem = {
      id: Date.now(),
      task: newItem.reminder.task,
      date: newItem.reminder.date,
      completed: false,
    }

    setReminders([...reminders, newReminderItem])
    setNewItem({ ...newItem, reminder: { task: "", date: "", completed: false } })
  }

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder)),
    )
  }

  const deleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  const simulateCall = (phoneNumber) => {
    alert(`Calling ${phoneNumber}...`)
  }

  const simulateMessage = (message, contact) => {
    const whatsappUrl = `https://wa.me/${contact.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const renderPageTitle = () => {
    if (stealthMode) {
      return (
        <div className="stealth-title-container">
          <h1 className="stealth-title">{stealthTitle}</h1>
          <button
            className="stealth-edit-button"
            onClick={() => {
              const newTitle = prompt("Enter a new title:", stealthTitle)
              if (newTitle && newTitle.trim() !== "") {
                setStealthTitle(newTitle.trim())
              }
            }}
          >
            <Edit size={16} />
          </button>
        </div>
      )
    }
    return <h1 className="page-title">My Safety Plan</h1>
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type not allowed: ${file.name}`)
        return false
      }
      if (file.size > maxSize) {
        alert(`File too large (max 5MB): ${file.name}`)
        return false
      }
      return true
    })

    setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const deleteUploadedFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      {/* Navigation bar */}
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
            <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
            <button onClick={() => navigate("/support")} className="nav-link">Support</button>
            <button onClick={() => navigate("/report-incident")} className="nav-link">Report Incident</button>
            <button onClick={() => navigate("/testimonials")} className="nav-link">Testimonials</button>
            <button onClick={() => navigate("/dashboard")} className="nav-link">Back to Dashboard</button>
          </div>
          <div className="nav-actions">
            <button onClick={handleQuickExit} className="quick-exit-btn">
              Quick Exit
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
              {darkMode ? <Sun className="sun-icon" /> : <Moon className="moon-icon" />}
            </button>
          </div>
        </div>
      </nav>

      <header className="header">
        {renderPageTitle()}
        <div className="header-buttons">
          <button
            className="stealth-mode-button"
            onClick={toggleStealthMode}
            aria-label={stealthMode ? "Disable stealth mode" : "Enable stealth mode"}
          >
            {stealthMode ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </div>
      </header>

      <div className="tabs-container">
        <button
          className={`tab ${activeTab === "checklist" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("checklist")}
        >
          <Shield />
          <span>{stealthMode ? "Items" : "Safety Checklist"}</span>
        </button>
        <button
          className={`tab ${activeTab === "contacts" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          <Phone />
          <span>{stealthMode ? "People" : "Emergency Contacts"}</span>
        </button>
        <button
          className={`tab ${activeTab === "locations" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("locations")}
        >
          <Map />
          <span>{stealthMode ? "Places" : "Safe Locations"}</span>
        </button>
        <button
          className={`tab ${activeTab === "documents" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          <FileText />
          <span>{stealthMode ? "Files" : "Documents"}</span>
        </button>
        <button
          className={`tab ${activeTab === "communication" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("communication")}
        >
          <MessageSquare />
          <span>{stealthMode ? "Notes" : "Communication"}</span>
        </button>
        <button
          className={`tab ${activeTab === "reminders" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("reminders")}
        >
          <Calendar />
          <span>{stealthMode ? "Calendar" : "Reminders"}</span>
        </button>
      </div>

      <main className="main-content">
        {activeTab === "checklist" && (
          <div className="tab-content">
            <h2 className="section-title">{stealthMode ? "My List" : "Safety Checklist"}</h2>
            <p className="section-description">
              {stealthMode
                ? "Keep track of important items."
                : "Items to prepare for your safety. Check them off as you complete them."}
            </p>

            <div className="checklist-container">
              {checklist.map((item) => (
                <div key={item.id} className="checklist-item">
                  <div className="checklist-item-main">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="checkbox"
                    />
                    <span className={`checklist-text ${item.completed ? "completed" : ""}`}>{item.text}</span>
                    <span className={`priority-badge ${item.priority}`}>{stealthMode ? "!" : item.priority}</span>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteChecklistItem(item.id)}
                    aria-label="Delete item"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="add-item-form">
              <h3 className="form-title">{stealthMode ? "Add New Item" : "Add to Checklist"}</h3>
              <div className="form-fields">
                <input
                  type="text"
                  value={newItem.checklist.text}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      checklist: { ...newItem.checklist, text: e.target.value },
                    })
                  }
                  placeholder={stealthMode ? "New item" : "What do you need to prepare?"}
                  className="text-input"
                />
                <select
                  value={newItem.checklist.priority}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      checklist: { ...newItem.checklist, priority: e.target.value },
                    })
                  }
                  className="select-input"
                >
                  <option value="high">{stealthMode ? "Important" : "High Priority"}</option>
                  <option value="medium">{stealthMode ? "Moderate" : "Medium Priority"}</option>
                  <option value="low">{stealthMode ? "Optional" : "Low Priority"}</option>
                </select>
                <button className="add-button" onClick={addChecklistItem}>
                  <Plus />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="tab-content">
            <h2 className="section-title">{stealthMode ? "My People" : "Emergency Contacts"}</h2>
            <p className="section-description">
              {stealthMode
                ? "Important people you may need to reach."
                : "People you can call for help in an emergency."}
            </p>

            <div className="contacts-grid">
              {contacts.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-info">
                    <h3 className="contact-name">{contact.name}</h3>
                    <p className="contact-phone">{contact.phone}</p>
                    <span className={`contact-type-badge ${contact.type}`}>{contact.type}</span>
                  </div>
                  <div className="contact-actions">
                    <button
                      className="call-button"
                      onClick={() => simulateCall(contact.phone)}
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone />
                      <span>Call</span>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteContact(contact.id)}
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-item-form">
              <h3 className="form-title">{stealthMode ? "Add New Person" : "Add Contact"}</h3>
              <div className="form-fields">
                <input
                  type="text"
                  value={newItem.contact.name}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      contact: { ...newItem.contact, name: e.target.value },
                    })
                  }
                  placeholder="Name"
                  className="text-input"
                />
                <input
                  type="tel"
                  value={newItem.contact.phone}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      contact: { ...newItem.contact, phone: e.target.value },
                    })
                  }
                  placeholder="Phone number"
                  className="text-input"
                />
                <select
                  value={newItem.contact.type}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      contact: { ...newItem.contact, type: e.target.value },
                    })
                  }
                  className="select-input"
                >
                  <option value="personal">Personal</option>
                  <option value="shelter">Shelter</option>
                  <option value="hotline">Hotline</option>
                  <option value="police">Police</option>
                </select>
                <button className="add-button" onClick={addContact}>
                  <Plus />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "locations" && (
          <div className="tab-content">
            <h2 className="section-title">{stealthMode ? "My Places" : "Safe Locations"}</h2>
            <p className="section-description">
              {stealthMode ? "Places you might want to visit." : "Places you can go to for safety and support."}
            </p>

            <div className="locations-grid">
              {locations.map((location) => (
                <div key={location.id} className="location-card">
                  <div className="location-info">
                    <h3 className="location-name">{location.name}</h3>
                    <p className="location-address">{location.address}</p>
                    {location.notes && <p className="location-notes">{location.notes}</p>}
                  </div>
                  <div className="location-actions">
                    <button
                      className="map-button"
                      onClick={() =>
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(location.address)}`, "_blank")
                      }
                      aria-label={`View ${location.name} on map`}
                    >
                      <Map />
                      <span>Map</span>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteLocation(location.id)}
                      aria-label={`Delete ${location.name}`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-item-form">
              <h3 className="form-title">{stealthMode ? "Add New Place" : "Add Safe Location"}</h3>
              <div className="form-fields">
                <input
                  type="text"
                  value={newItem.location.name}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      location: { ...newItem.location, name: e.target.value },
                    })
                  }
                  placeholder="Location name"
                  className="text-input"
                />
                <input
                  type="text"
                  value={newItem.location.address}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      location: { ...newItem.location, address: e.target.value },
                    })
                  }
                  placeholder="Address"
                  className="text-input"
                />
                <input
                  type="text"
                  value={newItem.location.notes}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      location: { ...newItem.location, notes: e.target.value },
                    })
                  }
                  placeholder="Notes (optional)"
                  className="text-input"
                />
                <button className="add-button" onClick={addLocation}>
                  <Plus />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="tab-content">
            <h2 className="section-title">{stealthMode ? "My Files" : "Important Documents"}</h2>
            <p className="section-description">
              {stealthMode ? "Store and access your files securely." : "Store and access important documents securely."}
            </p>

            <div className="documents-container">
              {documents.map((document) => (
                <div key={document.id} className="document-item">
                  <div className="document-info">
                    <FileText className="document-icon" />
                    <div>
                      <h3 className="document-name">{document.name}</h3>
                      <p className="document-date">Added: {document.date}</p>
                    </div>
                  </div>
                  <div className="document-actions">
                    <button
                      className="view-button"
                      onClick={() => alert(`Viewing ${document.name}`)}
                      aria-label={`View ${document.name}`}
                    >
                      <Eye />
                      <span>View</span>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => setDocuments(documents.filter((doc) => doc.id !== document.id))}
                      aria-label={`Delete ${document.name}`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}

              {uploadedFiles.map((file, index) => (
                <div key={index} className="document-item">
                  <div className="document-info">
                    <FileText className="document-icon" />
                    <div>
                      <h3 className="document-name">{file.name}</h3>
                      <p className="document-date">Size: {(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <div className="document-actions">
                    <button
                      className="view-button"
                      onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                      aria-label={`View ${file.name}`}
                    >
                      <Eye />
                      <span>View</span>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteUploadedFile(index)}
                      aria-label={`Delete ${file.name}`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="upload-document-container">
              <h3 className="form-title">{stealthMode ? "Upload New File" : "Upload Document"}</h3>
              <div className="upload-area">
                <Upload className="upload-icon" />
                <p className="upload-text">
                  {stealthMode ? "Click to select a file to upload" : "Click to upload an important document"}
                </p>
                <input
                  type="file"
                  className="file-input"
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                />
              </div>
              <p className="security-note">
                <Shield className="security-icon" />
                {stealthMode ? "Your files are stored securely" : "Documents are encrypted and stored securely"}
              </p>
              <p className="file-restrictions">Allowed file types: PDF, JPEG, PNG, GIF. Maximum file size: 5MB.</p>
            </div>
          </div>
        )}

        {activeTab === "communication" && (
          <div className="tab-content">
            <h2 className="section-title">{stealthMode ? "My Notes" : "Safe Communication"}</h2>

            {/* Code Words Section */}
            <div className="communication-section">
              <h3 className="subsection-title">{stealthMode ? "Special Terms" : "Code Words"}</h3>
              <p className="section-description">
                {stealthMode ? "Terms with special meanings." : "Words you can use to secretly communicate distress."}
              </p>

              <div className="code-words-container">
                {codeWords.map((codeWord) => (
                  <div key={codeWord.id} className="code-word-item">
                    <div className="code-word-info">
                      <h4 className="code-word-text">"{codeWord.word}"</h4>
                      <p className="code-word-meaning">
                        Means: <span className="code-word-meaning-text">{codeWord.meaning}</span>
                      </p>
                      {codeWord.contact && (
                        <p className="code-word-contact">
                          For: <span className="code-word-contact-name">{codeWord.contact}</span>
                        </p>
                      )}
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => deleteCodeWord(codeWord.id)}
                      aria-label="Delete code word"
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-item-form">
                <h4 className="form-title">{stealthMode ? "Add New Term" : "Add Code Word"}</h4>
                <div className="form-fields">
                  <input
                    type="text"
                    value={newItem.codeWord.word}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        codeWord: { ...newItem.codeWord, word: e.target.value },
                      })
                    }
                    placeholder={stealthMode ? "Term" : "Code word or phrase"}
                    className="text-input"
                  />
                  <input
                    type="text"
                    value={newItem.codeWord.meaning}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        codeWord: { ...newItem.codeWord, meaning: e.target.value },
                      })
                    }
                    placeholder={stealthMode ? "What it means" : "What this code means"}
                    className="text-input"
                  />
                  <input
                    type="text"
                    value={newItem.codeWord.contact}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        codeWord: { ...newItem.codeWord, contact: e.target.value },
                      })
                    }
                    placeholder={stealthMode ? "Who it's for" : "Who should understand this code"}
                    className="text-input"
                  />
                  <button className="add-button" onClick={addCodeWord}>
                    <Plus />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Messages Section */}
            <div className="communication-section">
              <h3 className="subsection-title">{stealthMode ? "Quick Messages" : "Emergency Messages"}</h3>
              <p className="section-description">
                {stealthMode
                  ? "Pre-written messages you can send quickly."
                  : "Pre-written emergency messages you can send with one tap."}
              </p>

              <div className="emergency-messages-container">
                {emergencyMessages.map((message) => (
                  <div key={message.id} className="emergency-message-item">
                    <div className="emergency-message-info">
                      <p className="emergency-message-text">"{message.message}"</p>
                      <p className="emergency-message-contact">
                        To: <span className="emergency-message-contact-name">{message.contact}</span>
                      </p>
                      <p className="emergency-message-phone">{message.phone}</p>
                    </div>
                    <div className="emergency-message-actions">
                      <button
                        className="send-button"
                        onClick={() => simulateMessage(message.message, message.phone)}
                        aria-label="Send message via WhatsApp"
                      >
                        <Send />
                        <span>Send via WhatsApp</span>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteEmergencyMessage(message.id)}
                        aria-label="Delete message"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-item-form">
                <h4 className="form-title">{stealthMode ? "Add New Message" : "Add Emergency Message"}</h4>
                <div className="form-fields">
                  <textarea
                    value={newItem.message.message}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        message: { ...newItem.message, message: e.target.value },
                      })
                    }
                    placeholder={stealthMode ? "Message text" : "Emergency message text"}
                    className="textarea-input"
                  />
                  <input
                    type="text"
                    value={newItem.message.contact}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        message: { ...newItem.message, contact: e.target.value },
                      })
                    }
                    placeholder="Recipient name"
                    className="text-input"
                  />
                  <input
                    type="tel"
                    value={newItem.message.phone}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        message: { ...newItem.message, phone: e.target.value },
                      })
                    }
                    placeholder="Recipient phone number"
                    className="text-input"
                  />
                  <button className="add-button" onClick={addEmergencyMessage}>
                    <Plus />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reminders" && (
          <div className="tab-content">
            <h2 className="section-title">{stealthMode ? "My Calendar" : "Safety Plan Reminders"}</h2>
            <p className="section-description">
              {stealthMode ? "Important dates and tasks to remember." : "Set reminders for important safety tasks."}
            </p>

            <div className="reminders-container">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="reminder-item">
                  <div className="reminder-item-main">
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => toggleReminder(reminder.id)}
                      className="checkbox"
                    />
                    <div className="reminder-info">
                      <span className={`reminder-text ${reminder.completed ? "completed" : ""}`}>{reminder.task}</span>
                      <span className="reminder-date">{new Date(reminder.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteReminder(reminder.id)}
                    aria-label="Delete reminder"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="add-item-form">
              <h3 className="form-title">{stealthMode ? "Add New Task" : "Add Reminder"}</h3>
              <div className="form-fields">
                <input
                  type="text"
                  value={newItem.reminder.task}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      reminder: { ...newItem.reminder, task: e.target.value },
                    })
                  }
                  placeholder={stealthMode ? "Task description" : "What do you need to remember?"}
                  className="text-input"
                />
                <input
                  type="date"
                  value={newItem.reminder.date}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      reminder: { ...newItem.reminder, date: e.target.value },
                    })
                  }
                  className="date-input"
                />
                <button className="add-button" onClick={addReminder}>
                  <Plus />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        {!stealthMode && (
          <>
            <p className="footer-text">
              <AlertTriangle className="footer-icon" />
              If you are in immediate danger, call emergency services 911.
            </p>
            <p className="footer-text">National Domestic Violence Hotline: 1195</p>
          </>
        )}
        {stealthMode && (
          <p className="footer-text">
            <LogOut className="footer-icon" />
            <button onClick={toggleStealthMode} className="footer-link">
              Exit {stealthTitle} Mode
            </button>
          </p>
        )}
      </footer>
    </div>
  )
}

export default SafetyPlan

