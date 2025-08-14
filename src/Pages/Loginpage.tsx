"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Authentication/auth-context"
import styles from "../Styles/Loginpage.module.css"

export default function TravelLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homepage")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("Attempting login with:", { username, password: "***" })

    // Mock authentication for testing
    const mockCredentials = {
      username: "admin",
      password: "password123"
    }

    // Check if using mock credentials
    if (username === mockCredentials.username && password === mockCredentials.password) {
      console.log("Using mock authentication - login successful")
      
      // Create mock user data
      const mockUser = {
        id: "1",
        email: "admin@wandernest.com",
        first_name: "Admin",
        last_name: "User",
        username: "admin"
      }

      // Create mock token
      const mockToken = "mock-jwt-token-" + Date.now()

      // Use the auth context login function
      login(mockToken, mockUser)
      
      console.log("Mock login successful, navigating to homepage")
      navigate("/homepage")
      return
    }

    // Original API authentication logic (as fallback)
    try {
      const requestBody = { username, password }
      console.log("Sending request to:", "https://wander-nest-ad3s.onrender.com/api/auth/login/")
      console.log("Request body:", requestBody)

      const response = await fetch("https://wander-nest-ad3s.onrender.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Try to get response text first
      const responseText = await response.text()
      console.log("Response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.log("Parsed response data:", data)
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError)
        throw new Error(`Server returned invalid JSON: ${responseText}`)
      }

      if (!response.ok) {
        console.error("Login failed with status:", response.status)
        console.error("Error data:", data)
        
        // Handle different types of error responses
        let errorMessage = "Login failed"
        if (data?.message) {
          errorMessage = data.message
        } else if (data?.error) {
          errorMessage = data.error
        } else if (data?.detail) {
          errorMessage = data.detail
        } else if (typeof data === 'string') {
          errorMessage = data
        } else if (response.status === 401) {
          errorMessage = "Invalid username or password"
        } else if (response.status === 400) {
          errorMessage = "Invalid request data"
        } else if (response.status === 500) {
          errorMessage = "Server error - please try again later"
        } else if (response.status === 404) {
          errorMessage = "Login endpoint not found"
        }
        
        throw new Error(errorMessage)
      }

      console.log("Login successful, user data:", data)

      // Use the auth context login function
      login(
        data.token,
        data.user || {
          id: data.user_id || "1",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || username,
        },
      )

      navigate("/homepage")
    } catch (err: any) {
      console.error("Login error:", err)
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      
      let errorMessage = "Login failed"
      if (err.message) {
        errorMessage = err.message
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = "Network error - please check your connection"
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const _handleLogout = () => {
    // This function is no longer needed since we're using auth context
  }

  const handleWanderNestClick = () => {
    navigate("/")
  }

  // Remove the isLoggedIn state and related logic since we're using auth context
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logoContainer} onClick={handleWanderNestClick}>
            <img src="/Figma_photoes/wandernest.svg" alt="WanderNest Logo" className={styles.logo} />
            <button type="button" className={styles.wanderNestButton}>
              WanderNest
            </button>
          </div>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>We're so excited to see you again!</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className={styles.forgotPassword}>
            <span className={styles.link} onClick={() => navigate('/fpass')} style={{ cursor: 'pointer' }}>
              Forget your password?
            </span>
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <div className={styles.footer}>
            Don't have an account?{" "}
            <a href="/signup" className={styles.signupLink}>
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
