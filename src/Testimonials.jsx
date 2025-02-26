"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSun, FaMoon, FaTrash } from "react-icons/fa"
import "./Testimonials.css"

const initialStories = [
  {
    id: 1,
    content:
      "After years of silence, I found the strength to leave. Today, I'm rebuilding my life one day at a time. To anyone still in that situation: you deserve better, and there is hope.",
    author: "Sarah",
    date: "2024-02-15",
    comments: [],
  },
  {
    id: 2,
    content: "The hardest step was reaching out for help. Once I did, I discovered a community of survivors who understood and supported me. You're not alone in this journey.",
    author: "Michael",
    date: "2024-02-14",
    comments: []
  },
  {
    id: 3,
    content: "Recovery isn't linear. Some days are harder than others, but each day I'm stronger than before. Finding my voice again has been the most empowering part of my healing journey.",
    author: "Emily",
    date: "2024-02-13",
    comments: []
  },
  {
    id: 4,
    content: "Through therapy and support groups, I learned that what happened wasn't my fault. Now I help others recognize the signs I missed. Your past doesn't define your future.",
    author: "David",
    date: "2024-02-12",
    comments: []
  },
  {
    id: 5,
    content: "Breaking free seemed impossible, but with help from a domestic violence organization, I found safety. There are people who want to help - you just need to take that first step.",
    author: "Jessica",
    date: "2024-02-11",
    comments: []
  },
  {
    id: 6,
    content: "Looking back, I'm proud of how far I've come. To anyone reading this who's afraid: your safety matters. Your feelings are valid. And you have more strength than you know.",
    author: "Alex",
    date: "2024-02-10",
    comments: []
  }
]

const Testimonials = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [stories, setStories] = useState(initialStories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStory, setNewStory] = useState({ content: "", author: "" })
  const [newComment, setNewComment] = useState({ storyId: 0, content: "", author: "" })
  const [currentUser, setCurrentUser] = useState("")

  const handleQuickExit = () => {
    window.location.href = "https://www.weather.com"
  }

  const handleAddStory = () => {
    if (!newStory.content || !newStory.author) {
      alert("Please fill in all fields")
      return
    }

    setCurrentUser(newStory.author)

    const story = {
      id: Date.now(),
      content: newStory.content,
      author: newStory.author,
      date: new Date().toISOString().split("T")[0],
      comments: [],
    }

    setStories([story, ...stories])
    setNewStory({ content: "", author: "" })
    setIsDialogOpen(false)
  }

  const handleDeleteStory = (id, author) => {
    if (author === currentUser) {
      setStories(stories.filter((story) => story.id !== id))
    } else {
      alert("You can only delete your own stories")
    }
  }

  const handleAddComment = (storyId) => {
    if (!newComment.content) {
      alert("Please enter a comment")
      return
    }

    if (!currentUser) {
      setCurrentUser(newComment.author || "Anonymous")
    }

    const updatedStories = stories.map((story) => {
      if (story.id === storyId) {
        return {
          ...story,
          comments: [
            ...story.comments,
            {
              id: Date.now(),
              content: newComment.content,
              author: currentUser || newComment.author || "Anonymous",
              date: new Date().toISOString().split("T")[0],
            },
          ],
        }
      }
      return story
    })

    setStories(updatedStories)
    setNewComment({ storyId: 0, content: "", author: "" })
  }

  const handleDeleteComment = (storyId, commentId, commentAuthor) => {
    if (commentAuthor === currentUser) {
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
    } else {
      alert("You can only delete your own comments")
    }
  }

  return (
    <div className={`testimonials-container ${darkMode ? "dark" : ""}`}>
      <nav className="testimonials-nav">
        <div className="nav-content">
          <div className="nav-links">
            <button onClick={() => navigate("/chatbot")} className="nav-link">AI Support</button>
            <button onClick={() => navigate("/resources")} className="nav-link">Resources</button>
            <button onClick={() => navigate("/risk-assessment")} className="nav-link">Risk Assessment</button>
            <button onClick={() => navigate("/support")} className="nav-link">support</button>
            <button onClick={() => navigate("/report")} className="nav-link">Report</button>
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

      <main className="testimonials-main">
        <div className="testimonials-header">
          <h1>Survivor Stories</h1>
          <p>A safe space to share your journey and find support in others' experiences.</p>
          {currentUser && <p className="current-user">Posting as: {currentUser}</p>}
          <button onClick={() => setIsDialogOpen(true)} className="share-story-btn">
            Share Your Story
          </button>
        </div>

        {isDialogOpen && (
          <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <h2>Share Your Story</h2>
              <input
                type="text"
                placeholder="Your name (or anonymous)"
                value={newStory.author}
                onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                className="dialog-input"
              />
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

        <div className="stories-container">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <div className="story-header">
                <div>
                  <h3>{story.author}</h3>
                  <p>{story.date}</p>
                </div>
                {story.author === currentUser && (
                  <button onClick={() => handleDeleteStory(story.id, story.author)} className="delete-btn">
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="story-content">{story.content}</p>
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
                    <button onClick={() => handleAddComment(story.id)} className="post-comment-btn">
                      Post
                    </button>
                  </div>
                </div>

                {story.comments.length > 0 && (
                  <div className="comments-list">
                    {story.comments.map((comment) => (
                      <div key={comment.id} className="comment-card">
                        <div>
                          <p className="comment-content">{comment.content}</p>
                          <p className="comment-meta">
                            {comment.author} • {comment.date}
                          </p>
                        </div>
                        {comment.author === currentUser && (
                          <button
                            onClick={() => handleDeleteComment(story.id, comment.id, comment.author)}
                            className="delete-btn"
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
      </main>
    </div>
  )
}

export default Testimonials

