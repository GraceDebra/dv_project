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

