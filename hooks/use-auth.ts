// "use client"

// import { useState, useEffect } from "react"
// import {
//   type AuthState,
//   getStoredAuth,
//   logout as logoutUser,
//   clearAllAuthData,
// } from "@/lib/auth"

// // This is like an Angular Service - it manages authentication state
// export function useAuth() {
//   // Think of this as Angular component state
//   const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })
//   const [loading, setLoading] = useState(true)

//   // This is like Angular's ngOnInit - runs when component mounts
//   useEffect(() => {
//     const stored = getStoredAuth()
//     setAuthState(stored)
//     setLoading(false)
//   }, [])

//   async function signup(user: {
//     full_name: string
//     email: string
//     password: string
//     phone_number?: string
//     address?: string
//     customer_id: string
//     contract_number: string
//   }) {
//     const res = await fetch('/api/auth', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ action: 'signup', ...user }),
//     })
//     return res.json()
//   }
  
//   async function login(email: string, password: string) {//
//     const res = await fetch('/api/auth', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ action: 'signin', email, password }),
//     })
//     const response = await res.json()
//     setAuthState({ user: response.user, isAuthenticated: true })
//     return response
//   }

//   const logout = () => {
//     logoutUser()
//     setAuthState({ user: null, isAuthenticated: false })
//   }

//   // Clear all auth data (useful for debugging)
//   const clearAuth = () => {
//     clearAllAuthData()
//     setAuthState({ user: null, isAuthenticated: false })
//   }

//   // This is like Angular service - returns methods and state
//   return {
//     // State (like Angular component properties)
//     user: authState.user,
//     isAuthenticated: authState.isAuthenticated,
//     loading,
    
//     // Methods (like Angular service methods)
//     login,
//     signup,
//     logout,
//     clearAuth, // New method for debugging
//   }
// }