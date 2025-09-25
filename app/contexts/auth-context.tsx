// context/AuthContext.tsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getStoredAuth, setStoredAuth, clearAllAuthData, logout as logoutUser } from "@/lib/auth"
import type { AuthState } from "@/lib/auth"

interface AuthContextProps {
  user: any
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  signup: (user: any) => Promise<any>
  logout: () => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredAuth()
    setAuthState(stored)
    setLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signin", email, password }),
    })
    const response = await res.json()
    if (response.success) {
      setAuthState({ user: response.user, isAuthenticated: true })
      setStoredAuth({ user: response.user, isAuthenticated: true })
    }
    return response
  }

  async function signup(user: any) {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", ...user }),
    })
    return res.json()
  }

  const logout = () => {
    logoutUser()
    setAuthState({ user: null, isAuthenticated: false })
  }

  const clearAuth = () => {
    clearAllAuthData()
    setAuthState({ user: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...authState, loading, login, signup, logout, clearAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}