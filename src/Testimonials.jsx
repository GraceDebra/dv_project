"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaSun, FaMoon,  FaTrash,  FaQuoteLeft,  FaQuoteRight,  FaHeart,  FaUser,  FaHistory,  FaSmile,  FaSignInAlt,  FaSignOutAlt,} from "react-icons/fa"
import EmojiPicker from "emoji-picker-react"
import "./Testimonials.css"

const Testimonials = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })
  const [stories, setStories] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [newStory, setNewStory] = useState({ content: "", author: "" })
  const [newComment, setNewComment] = useState({ storyId: 0, content: "", author: "" })
  const [currentUser, setCurrentUser] = useState(() => {
    // Try to get the user from localStorage when component mounts
    return localStorage.getItem("currentUser") || ""
  })
  const [loginInput, setLoginInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [likedStories, setLikedStories] = useState(() => {
    const saved = localStorage.getItem("likedStories")
    return saved ? JSON.parse(saved) : {}
  })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeCommentId, setActiveCommentId] = useState(null)
  const [showUserHistory, setShowUserHistory] = useState(false)
  const [userHistory, setUserHistory] = useState({ stories: [], comments: [] })
  const [historyLoading, setHistoryLoading] = useState(false)
  // Add a new state for the welcome screen
  // Add a new state for the change username dialog
  const [isChangeUsernameDialogOpen, setIsChangeUsernameDialogOpen] = useState(false)
  const [newUsername, setNewUsername] = useState("")

  const emojiPickerRef = useRef(null)

  // Function to update current user in both state and localStorage
  const updateCurrentUser = (username) => {
    if (username && username.trim() !== "") {
      setCurrentUser(username.trim())
      localStorage.setItem("currentUser", username.trim())

      // Store login time
      localStorage.setItem("lastLoginTime", new Date().getTime().toString())

      // Reset liked stories when changing users
      setLikedStories({})
      localStorage.setItem("likedStories", JSON.stringify({}))

      // Close any open dialogs
      setIsLoginDialogOpen(false)

      // Show a welcome message
      alert(`Welcome, ${username.trim()}! You are now logged in.`)

      // Fetch user's liked stories
      fetchUserLikes(username.trim())
    }
  }

  // Function to log out the current user
  const handleLogout = () => {
    setCurrentUser("")
    localStorage.removeItem("currentUser")
    setLikedStories({})
    localStorage.removeItem("likedStories")
    setShowUserHistory(false)
    alert("You have been logged out.")
  }

  // Update darkMode in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch testimonials from the API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8081/services/testimonials")

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setStories(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching testimonials:", err)
        setError("Failed to load testimonials. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Save liked stories to localStorage when they change
  useEffect(() => {
    localStorage.setItem("likedStories", JSON.stringify(likedStories))
  }, [likedStories])

  // Fetch user history when requested
  useEffect(() => {
    if (showUserHistory && currentUser) {
      fetchUserHistory()
    }
  }, [showUserHistory, currentUser])

  const fetchUserHistory = async () => {
    if (!currentUser) return

    try {
      setHistoryLoading(true)
      const response = await fetch(
        `http://localhost:8081/services/testimonials/user/${encodeURIComponent(currentUser)}`,
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setUserHistory(data)
    } catch (err) {
      console.error("Error fetching user history:", err)
      alert("Failed to load your history. Please try again.")
    } finally {
      setHistoryLoading(false)
    }
  }

  const fetchUserLikes = async (username) => {
    if (!username) return

    try {
      const response = await fetch(`http://localhost:8081/services/testimonials/likes/${encodeURIComponent(username)}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const likedIds = await response.json()

      // Convert array of IDs to object format used by the component
      const likedStoriesObj = {}
      likedIds.forEach((id) => {
        likedStoriesObj[id] = true
      })

      setLikedStories(likedStoriesObj)
      localStorage.setItem("likedStories", JSON.stringify(likedStoriesObj))
    } catch (err) {
      console.error("Error fetching user likes:", err)
    }
  }

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com"
  }

  const handleAddStory = async () => {
    if (!newStory.content) {
      alert("Please enter your story content")
      return
    }

    // Use current user if logged in, otherwise use the author from the form
    const author = currentUser || newStory.author

    if (!author) {
      alert("Please enter your name or log in")
      return
    }

    // If not logged in, update the current user
    if (!currentUser) {
      updateCurrentUser(author)
    }

    try {
      const response = await fetch("http://localhost:8081/services/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newStory.content,
          author: author,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const newStoryFromServer = await response.json()

      // Add animation class to new story
      newStoryFromServer.isNew = true

      setStories([newStoryFromServer, ...stories])
      setNewStory({ content: "", author: "" })
      setIsDialogOpen(false)

      // Create confetti effect
      createConfetti()
    } catch (err) {
      console.error("Error adding testimonial:", err)
      alert("Failed to add your story. Please try again.")
    }
  }

  const createConfetti = () => {
    const confettiCount = 100
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b"]

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = Math.random() * 100 + "vw"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.width = Math.random() * 10 + 5 + "px"
      confetti.style.height = confetti.style.width
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s"
      confetti.style.animationDelay = Math.random() * 2 + "s"

      document.body.appendChild(confetti)

      setTimeout(() => {
        confetti.remove()
      }, 5000)
    }
  }

  const handleDeleteStory = async (id, author) => {
    // Strict equality check to ensure only the author can delete their stories
    if (author === currentUser) {
      // Add confirmation dialog
      if (
        !window.confirm(
          "Are you sure you want to delete this story? All comments will also be deleted. This action cannot be undone.",
        )
      ) {
        return
      }

      try {
        // Pass the author as a query parameter for server-side verification
        const response = await fetch(
          `http://localhost:8081/services/testimonials/${id}?author=${encodeURIComponent(author)}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API error: ${response.status}`)
        }

        setStories(stories.filter((story) => story.id !== id))

        // If in history view, update the history too
        if (showUserHistory) {
          setUserHistory({
            ...userHistory,
            stories: userHistory.stories.filter((story) => story.id !== id),
          })
        }
      } catch (err) {
        console.error("Error deleting testimonial:", err)
        alert(err.message || "Failed to delete the story. Please try again.")
      }
    } else {
      alert("You can only delete your own stories")
    }
  }

  const handleAddComment = async (storyId) => {
    if (!newComment.content) {
      alert("Please enter a comment")
      return
    }

    // Use current user if logged in, otherwise use the author from the form
    const commentAuthor = currentUser || newComment.author

    if (!commentAuthor) {
      alert("Please log in to add comments. You can do this from the main login page.")
      return
    }

    // If not logged in, update the current user
    if (!currentUser) {
      updateCurrentUser(commentAuthor)
    }

    try {
      const response = await fetch(`http://localhost:8081/services/testimonials/${storyId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.content,
          author: commentAuthor,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const newCommentFromServer = await response.json()

      const updatedStories = stories.map((story) => {
        if (story.id === storyId) {
          return {
            ...story,
            comments: [...story.comments, newCommentFromServer],
          }
        }
        return story
      })

      setStories(updatedStories)
      setNewComment({ storyId: 0, content: "", author: "" })
      setShowEmojiPicker(false)
    } catch (err) {
      console.error("Error adding comment:", err)
      alert("Failed to add your comment. Please try again.")
    }
  }

  const handleDeleteComment = async (storyId, commentId, commentAuthor) => {
    // Strict equality check to ensure only the author can delete their comments
    if (commentAuthor === currentUser) {
      // Add confirmation dialog
      if (!window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
        return
      }

      try {
        // Pass the author as a query parameter for server-side verification
        const response = await fetch(
          `http://localhost:8081/services/testimonials/${storyId}/comments/${commentId}?author=${encodeURIComponent(commentAuthor)}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API error: ${response.status}`)
        }

        const updatedStories = stories.map((story) => {
          if (story.id === storyId) {
            return {
              ...story,
              comments: story.comments.filter((comment) => comment.id !== commentId),
            }
          }
          return story
        })

        setStories(updatedStories)

        // If in history view, update the history too
        if (showUserHistory) {
          setUserHistory({
            ...userHistory,
            comments: userHistory.comments.filter((comment) => comment.id !== commentId),
          })
        }
      } catch (err) {
        console.error("Error deleting comment:", err)
        alert(err.message || "Failed to delete the comment. Please try again.")
      }
    } else {
      alert("You can only delete your own comments")
    }
  }

  const handleLikeStory = async (storyId) => {
    if (!currentUser) {
      alert("Please log in to like stories. You can do this from the main login page.")
      return
    }

    try {
      const response = await fetch(`http://localhost:8081/services/testimonials/${storyId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Update local state
      const newLikedStories = {
        ...likedStories,
        [storyId]: data.action === "liked",
      }

      setLikedStories(newLikedStories)
      localStorage.setItem("likedStories", JSON.stringify(newLikedStories))

      // Update the like count in the stories array
      setStories(
        stories.map((story) => {
          if (story.id === storyId) {
            return {
              ...story,
              like_count: data.likeCount,
            }
          }
          return story
        }),
      )
    } catch (err) {
      console.error("Error liking story:", err)
      alert("Failed to like the story. Please try again.")
    }
  }

  const handleLogin = () => {
    if (!loginInput.trim()) {
      alert("Please enter a username")
      return
    }
    updateCurrentUser(loginInput)
  }

  const handleEmojiClick = (emojiData) => {
    setNewComment({
      ...newComment,
      content: newComment.content + emojiData.emoji,
    })
  }

  const toggleEmojiPicker = (storyId) => {
    setActiveCommentId(storyId)
    setShowEmojiPicker(!showEmojiPicker)
    setNewComment({
      ...newComment,
      storyId,
    })
  }

  const toggleUserHistory = () => {
    if (!currentUser) {
      alert("Please log in to view your activity. You can do this from the main login page.")
      return
    }
    setShowUserHistory(!showUserHistory)
  }

  // Initial fetch of user likes when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchUserLikes(currentUser)
    }
  }, [currentUser])

  // Modify the useEffect that runs on component mount to check if the user is already logged in
  useEffect(() => {
    // Check if session is still valid
    checkSession()

    // If user is already logged in, skip the welcome screen
  }, [])

  // Add this function to handle the welcome screen login

  // Add this function to handle continuing as a guest

  // Add a function to handle session expiration or logout
  const checkSession = () => {
    // Check if the session has expired (e.g., after 24 hours)
    const lastLogin = localStorage.getItem("lastLoginTime")
    if (lastLogin) {
      const now = new Date().getTime()
      const loginTime = Number.parseInt(lastLogin, 10)

      // If more than 24 hours have passed, log the user out
      if (now - loginTime > 24 * 60 * 60 * 1000) {
        handleLogout()
      }
    }
  }

  // Add a function to handle changing the username
  const handleChangeUsername = () => {
    if (!newUsername.trim()) {
      alert("Please enter a username")
      return
    }

    // Update the current user
    updateCurrentUser(newUsername)

    // Close the dialog
    setIsChangeUsernameDialogOpen(false)
    setNewUsername("")
  }

  if (loading) {
    return (
      <div className={`testimonials-container ${darkMode ? "dark" : ""}`}>
        <nav className="main-nav">
          <div className="nav-content">
            <div className="nav-links">
              <button onClick={() => navigate("/chatbot")} className="nav-link">
                AI Support
              </button>
              <button onClick={() => navigate("/resources")} className="nav-link">
                Resources
              </button>
              <button onClick={() => navigate("/risk-assessment")} className="nav-link">
                Risk Assessment
              </button>
              <button onClick={() => navigate("/support")} className="nav-link">
                Support
              </button>
              <button onClick={() => navigate("/report-incident")} className="nav-link">
                Report Incident
              </button>
              <button onClick={() => navigate("/testimonials")} className="nav-link active">
                Testimonials
              </button>
              <button onClick={() => navigate("/dashboard")} className="nav-link">
                Back to Dashboard
              </button>
            </div>
            <div className="nav-actions">
              <button onClick={handleQuickExit} className="quick-exit-btn">
                Quick Exit
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
                {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
              </button>
            </div>
          </div>
        </nav>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading stories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`testimonials-container ${darkMode ? "dark" : ""}`}>
        <nav className="main-nav">
          <div className="nav-content">
            <div className="nav-links">
              <button onClick={() => navigate("/chatbot")} className="nav-link">
                AI Support
              </button>
              <button onClick={() => navigate("/resources")} className="nav-link">
                Resources
              </button>
              <button onClick={() => navigate("/risk-assessment")} className="nav-link">
                Risk Assessment
              </button>
              <button onClick={() => navigate("/support")} className="nav-link">
                Support
              </button>
              <button onClick={() => navigate("/report-incident")} className="nav-link">
                Report Incident
              </button>
              <button onClick={() => navigate("/testimonials")} className="nav-link active">
                Testimonials
              </button>
              <button onClick={() => navigate("/dashboard")} className="nav-link">
                Back to Dashboard
              </button>
            </div>
            <div className="nav-actions">
              <button onClick={handleQuickExit} className="quick-exit-btn">
                Quick Exit
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
                {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
              </button>
            </div>
          </div>
        </nav>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`testimonials-container ${darkMode ? "dark" : ""}`}>
      <nav className="main-nav">
        <div className="nav-content">
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
            <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
            <button onClick={() => navigate("/support")} className="nav-link">Support</button>
            <button onClick={() => navigate("/report-incident")} className="nav-link">Report Incident</button>
            <button onClick={() => navigate("/testimonials")} className="nav-link active">Testimonials</button>
            <button onClick={() => navigate("/dashboard")} className="nav-link">Back to Dashboard</button>
          </div>
          <div className="nav-actions">
            <button onClick={handleQuickExit} className="quick-exit-btn">
              Quick Exit
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
              {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
            </button>
          </div>
        </div>
      </nav>

      {/* User controls in top right corner below navbar */}
      <div className="corner-controls-container">
        {currentUser ? (
          <>
            <div className="user-corner-info">
              <span className="user-corner-name">
                <FaUser className="user-corner-icon" /> {currentUser}
              </span>
              <button
                onClick={() => setIsChangeUsernameDialogOpen(true)}
                className="change-username-corner-btn"
                title="Change username"
              >
                <FaSignInAlt />
              </button>
              <button onClick={handleLogout} className="logout-btn" title="Log out">
                <FaSignOutAlt />
              </button>
            </div>
            <div className="corner-buttons-row">
              <button onClick={toggleUserHistory} className="corner-activity-btn">
                <FaHistory className="history-icon" />
                {showUserHistory ? "View All Stories" : "My Activity"}
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => setIsLoginDialogOpen(true)} className="corner-login-btn">
            <FaSignInAlt className="login-icon" /> Log In
          </button>
        )}
      </div>

      {/* Login Dialog */}
      {isLoginDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsLoginDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h2>Log In</h2>
            <p className="dialog-description">Enter your username to log in and manage your stories and comments.</p>
            <input
              type="text"
              placeholder="Your username"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="dialog-input"
            />
            <div className="dialog-actions">
              <button onClick={handleLogin} className="dialog-submit-btn">
                <FaSignInAlt className="btn-icon" /> Log In
              </button>
              <button onClick={() => setIsLoginDialogOpen(false)} className="dialog-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isChangeUsernameDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsChangeUsernameDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Username</h2>
            <p className="dialog-description">
              Enter your new username. This will be used to identify your stories and comments.
            </p>
            <input
              type="text"
              placeholder="New username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="dialog-input"
            />
            <div className="dialog-actions">
              <button onClick={handleChangeUsername} className="dialog-submit-btn">
                <FaSignInAlt className="btn-icon" /> Update Username
              </button>
              <button onClick={() => setIsChangeUsernameDialogOpen(false)} className="dialog-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="testimonials-main">
        <div className="testimonials-header">
          <h1>Survivor Stories</h1>
          <p>A safe space to share your journey and find support in others' experiences.</p>

          <button onClick={() => setIsDialogOpen(true)} className="share-story-btn">
            Share Your Story
          </button>
        </div>

        {isDialogOpen && (
          <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <h2>Share Your Story</h2>
              {!currentUser && (
                <input
                  type="text"
                  placeholder="Your name (or anonymous)"
                  value={newStory.author}
                  onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                  className="dialog-input"
                />
              )}
              {currentUser && (
                <p className="dialog-user-info">
                  Posting as: <strong>{currentUser}</strong>
                </p>
              )}
              <textarea
                placeholder="Share your story here..."
                value={newStory.content}
                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                className="dialog-textarea"
              />
              <div className="dialog-actions">
                <button onClick={handleAddStory} className="dialog-submit-btn">
                  Share Story
                </button>
                <button onClick={() => setIsDialogOpen(false)} className="dialog-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showUserHistory ? (
          <div className="user-history-section">
            <h2>My Activity</h2>

            {historyLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your activity...</p>
              </div>
            ) : (
              <>
                <div className="history-tabs">
                  <button className="history-tab active">All Activity</button>
                </div>

                {userHistory.stories.length === 0 && userHistory.comments.length === 0 ? (
                  <div className="empty-history">
                    <p>You haven't shared any stories or comments yet.</p>
                  </div>
                ) : (
                  <div className="history-content">
                    {userHistory.stories.length > 0 && (
                      <div className="history-section">
                        <h3>My Stories ({userHistory.stories.length})</h3>
                        <div className="history-items">
                          {userHistory.stories.map((story) => (
                            <div key={story.id} className="history-item">
                              <div className="history-item-content">
                                <p className="history-item-text">{story.content}</p>
                                <p className="history-item-date">{new Date(story.created_at).toLocaleDateString()}</p>
                              </div>
                              <button onClick={() => handleDeleteStory(story.id, story.author)} className="delete-btn">
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userHistory.comments.length > 0 && (
                      <div className="history-section">
                        <h3>My Comments ({userHistory.comments.length})</h3>
                        <div className="history-items">
                          {userHistory.comments.map((comment) => (
                            <div key={comment.id} className="history-item">
                              <div className="history-item-content">
                                <p className="history-item-text">{comment.content}</p>
                                <p className="history-item-context">
                                  On {comment.story_author}'s story: {comment.story_content.substring(0, 50)}...
                                </p>
                                <p className="history-item-date">{new Date(comment.created_at).toLocaleDateString()}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteComment(comment.testimonial_id, comment.id, comment.author)}
                                className="delete-btn"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="stories-container">
            {stories.map((story) => (
              <div
                key={story.id}
                className={`story-card ${story.isNew ? "new" : ""} ${story.author === currentUser ? "my-story" : ""}`}
              >
                <div className="story-header">
                  <div>
                    <h3>{story.author}</h3>
                    <p>{new Date(story.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleLikeStory(story.id)}
                      className={`like-btn ${likedStories[story.id] ? "liked" : ""}`}
                      aria-label={likedStories[story.id] ? "Unlike this story" : "Like this story"}
                    >
                      <FaHeart />
                      {story.like_count > 0 && <span className="like-count">{story.like_count}</span>}
                    </button>
                    {/* Only show delete button if the current user is the author */}
                    {story.author === currentUser && (
                      <button
                        onClick={() => handleDeleteStory(story.id, story.author)}
                        className="delete-btn"
                        aria-label="Delete this story"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>

                <div className="story-content-wrapper">
                  <FaQuoteLeft className="quote-icon quote-left" />
                  <p className="story-content">{story.content}</p>
                  <FaQuoteRight className="quote-icon quote-right" />
                </div>

                <div className="story-decoration"></div>

                <div className="comments-section">
                  <div className="add-comment">
                    {!currentUser && (
                      <input
                        type="text"
                        placeholder="Your name"
                        value={newComment.author}
                        onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                        className="comment-input"
                      />
                    )}
                    <div className="comment-input-group">
                      <input
                        type="text"
                        placeholder="Add a supportive comment..."
                        value={newComment.storyId === story.id ? newComment.content : ""}
                        onChange={(e) => setNewComment({ storyId: story.id, content: e.target.value })}
                        className="comment-input"
                      />
                      <button className="emoji-btn" onClick={() => toggleEmojiPicker(story.id)} aria-label="Add emoji">
                        <FaSmile />
                      </button>
                      <button onClick={() => handleAddComment(story.id)} className="post-comment-btn">
                        Post
                      </button>
                    </div>
                    {showEmojiPicker && activeCommentId === story.id && (
                      <div className="emoji-picker-container" ref={emojiPickerRef}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>

                  {story.comments && story.comments.length > 0 && (
                    <div className="comments-list">
                      {story.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`comment-card ${comment.author === currentUser ? "my-comment" : ""}`}
                        >
                          <div>
                            <p className="comment-content">{comment.content}</p>
                            <p className="comment-meta">
                              {comment.author} • {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {/* Only show delete button if the current user is the comment author */}
                          {comment.author === currentUser && (
                            <button
                              onClick={() => handleDeleteComment(story.id, comment.id, comment.author)}
                              className="delete-btn"
                              aria-label="Delete this comment"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Testimonials
