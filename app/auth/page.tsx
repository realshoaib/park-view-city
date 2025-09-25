"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/app/contexts/auth-context"

// This is like an Angular component
export default function AuthPage() {
  // Component state (like Angular component properties)
  const [mode, setMode] = useState<"login" | "signup">("login")
  const { isAuthenticated, loading, clearAuth } = useAuth()
  const router = useRouter()

  // Additional effect to handle redirect after successful login
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("🚀 Redirecting to dashboard after successful authentication")
      router.replace("/dashboard")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Park View City Billing Portal</h1>
          <p className="text-muted-foreground">Manage your electricity bills and payments with ease</p>
        </div>

        <AuthForm mode={mode} onToggleMode={() => setMode(mode === "login" ? "signup" : "login")} />
      </div>
    </div>
  )
}
