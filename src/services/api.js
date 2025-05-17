const API_BASE_URL = "http://localhost:8081"

// Helper function to handle fetch errors with more detailed logging
const handleResponse = async (response) => {
  try {
    const contentType = response.headers.get("content-type")

    // Check if response is JSON
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || data.message || `Server responded with status: ${response.status}`
        console.error("API Error:", errorMessage, data)
        throw new Error(errorMessage)
      }

      return data
    } else {
      // Handle non-JSON responses
      const text = await response.text()
      console.error("Non-JSON response:", text)

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status} and non-JSON content`)
      }

      return { message: text }
    }
  } catch (error) {
    console.error("Response parsing error:", error)
    throw error
  }
}

// Test connection to server with more detailed error handling
export const testServerConnection = async () => {
  try {
    console.log("Testing connection to:", `${API_BASE_URL}/test-db`)

    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${API_BASE_URL}/test-db`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("Server Response Not OK:", {
        status: response.status,
        statusText: response.statusText,
      })
      throw new Error(`Server responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Server Connection Success:", data)
    return data
  } catch (error) {
    console.error("Detailed Connection Error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })

    // More specific error messages based on error type
    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      throw new Error(
        "Network Error: Unable to connect to server. Please check if the server is running at http://localhost:8081",
      )
    }
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Server might be running but responding slowly.")
    }

    throw error // Re-throw for component to handle
  }
}

// Check database tables - useful for debugging
export const checkDatabaseTables = async () => {
  try {
    console.log("Checking database tables at:", `${API_BASE_URL}/check-tables`)

    const response = await fetch(`${API_BASE_URL}/check-tables`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Error checking database tables:", error)
    throw error
  }
}

// Register a new user with more detailed logging
export const registerUser = async (userData) => {
  try {
    console.log("Attempting to register user at:", `${API_BASE_URL}/register`)
    console.log("User data:", { ...userData, password: "[REDACTED]" })

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Full Registration Error:", error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Login a user with more detailed logging
export const loginUser = async (credentials) => {
  try {
    console.log("Attempting to login user at:", `${API_BASE_URL}/login`)
    console.log("Login credentials:", { email: credentials.email, password: "[REDACTED]" })

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Login error:", error.message)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server")
    }
    throw error
  }
}

// Get all users with pagination - matches the /services/users endpoint in Admin.jsx
export const getAllUsers = async (page = 1, limit = 100) => {
  try {
    console.log("Fetching all users from:", `${API_BASE_URL}/services/users`)
    console.log("Pagination:", { page, limit })

    const response = await fetch(`${API_BASE_URL}/services/users?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Error fetching users:", error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Get user by ID
export const getUserById = async (userId) => {
  try {
    console.log("Fetching user by ID from:", `${API_BASE_URL}/services/users/${userId}`)

    const response = await fetch(`${API_BASE_URL}/services/users/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    console.log("Fetching user by email from:", `${API_BASE_URL}/services/users/email/${email}`)

    const response = await fetch(`${API_BASE_URL}/services/users/email/${email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Update user status (active/inactive)
export const updateUserStatus = async (userId, status) => {
  try {
    console.log("Updating user status at:", `${API_BASE_URL}/services/users/${userId}/status`)
    console.log("Status data:", { status })

    const response = await fetch(`${API_BASE_URL}/services/users/${userId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
      body: JSON.stringify({ status }),
    })

    return await handleResponse(response)
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Delete a user
export const deleteUser = async (userId) => {
  try {
    console.log("Deleting user at:", `${API_BASE_URL}/services/users/${userId}`)

    const response = await fetch(`${API_BASE_URL}/services/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Get user sessions
export const getUserSessions = async (userId) => {
  try {
    console.log("Fetching user sessions from:", `${API_BASE_URL}/services/users/${userId}/sessions`)

    const response = await fetch(`${API_BASE_URL}/services/users/${userId}/sessions`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error(`Error fetching sessions for user ${userId}:`, error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Delete user session
export const deleteSession = async (sessionId) => {
  try {
    console.log("Deleting user session at:", `${API_BASE_URL}/services/sessions/${sessionId}`)

    const response = await fetch(`${API_BASE_URL}/services/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error(`Error deleting session ${sessionId}:`, error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Delete all sessions for a user
export const deleteAllUserSessions = async (userId) => {
  try {
    console.log("Deleting all user sessions at:", `${API_BASE_URL}/services/users/${userId}/sessions`)

    const response = await fetch(`${API_BASE_URL}/services/users/${userId}/sessions`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error(`Error deleting all sessions for user ${userId}:`, error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Get all resources
export const getResources = async () => {
  try {
    console.log("Fetching resources from:", `${API_BASE_URL}/services/resources`)

    const response = await fetch(`${API_BASE_URL}/services/resources`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Error fetching resources:", error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Get all quiz questions
export const getQuizQuestions = async () => {
  try {
    console.log("Fetching quiz questions from:", `${API_BASE_URL}/services/quiz-questions`)

    const response = await fetch(`${API_BASE_URL}/services/quiz-questions`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Get all testimonials
export const getTestimonials = async () => {
  try {
    console.log("Fetching testimonials from:", `${API_BASE_URL}/services/testimonials`)

    const response = await fetch(`${API_BASE_URL}/services/testimonials`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}

// Get all reports
export const getReports = async () => {
  try {
    console.log("Fetching reports from:", `${API_BASE_URL}/services/reports`)

    const response = await fetch(`${API_BASE_URL}/services/reports`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("authToken") ? `Bearer ${localStorage.getItem("authToken")}` : "",
      },
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("Error fetching reports:", error)
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.")
    }
    throw error
  }
}
