"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  username: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (token: string, userData: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("userData")
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        setUser(parsedUserData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error)
        // Clear invalid data
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
      }
    }
    setLoading(false)
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>{children}</AuthContext.Provider>
  )
}
