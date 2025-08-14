"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Authentication/auth-context"

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed" style={{backgroundImage: "url('/Figma_photoes/travel-background.jpg')"}}>
      <div className="w-full max-w-[28rem] bg-white/95 backdrop-blur-[8px] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 border border-white/20">
        <div className="flex items-center justify-start gap-4 mb-6 pb-4 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-4 cursor-pointer transition-transform duration-200 hover:scale-105 p-2 rounded-lg hover:bg-[rgba(5,150,105,0.1)]" onClick={handleWanderNestClick}>
            <img src="/Figma_photoes/wandernest.svg" alt="WanderNest Logo" className="w-10 h-10 object-contain rounded-lg" />
            <button type="button" className="bg-none border-none text-xl font-bold text-[#1f2937] cursor-pointer py-2 transition-colors duration-150 hover:text-[#059669] focus:outline-none focus:text-[#059669]">
              WanderNest
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[1.875rem] font-bold text-[#111827] m-0 mb-2 leading-[1.2]">Welcome back</h1>
          <p className="text-[#6b7280] text-base m-0 leading-[1.5]">We're so excited to see you again!</p>
        </div>

        {error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] p-3 rounded-md mb-4 text-sm text-center">{error}</div>}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium text-[#374151]">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="h-12 px-3 border border-[#d1d5db] rounded-md text-base transition-all duration-150 bg-white/90 focus:outline-none focus:border-[#059669] focus:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] placeholder:text-[#9ca3af]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-[#374151]">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="h-12 px-3 border border-[#d1d5db] rounded-md text-base transition-all duration-150 bg-white/90 focus:outline-none focus:border-[#059669] focus:shadow-[0_0_0_3px_rgba(5,150,105,0.1)] placeholder:text-[#9ca3af]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="text-left -mt-2">
            <span className="text-sm text-[#059669] no-underline transition-colors duration-150 bg-none border-none cursor-pointer hover:text-[#047857] hover:underline" onClick={() => navigate('/fpass')}>
              Forget your password?
            </span>
          </div>

          <button type="submit" className="w-full h-12 bg-[#059669] text-white border-none rounded-md text-base font-medium cursor-pointer transition-all duration-150 hover:bg-[#047857] hover:-translate-y-px focus:outline-none focus:shadow-[0_0_0_3px_rgba(5,150,105,0.3)] disabled:bg-[#9ca3af] disabled:cursor-not-allowed disabled:transform-none" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <div className="text-center text-sm text-[#6b7280] mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#059669] no-underline font-medium transition-colors duration-150 bg-none border-none cursor-pointer text-sm p-0 m-0 hover:text-[#047857] hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
