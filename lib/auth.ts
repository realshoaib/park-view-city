// import { supabase } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string
  consumerIds: string[]
  createdAt: string
  phone: string
  address: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const AUTH_STORAGE_KEY = "bill_app_auth"

export function getStoredAuth(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const auth = JSON.parse(stored)
      console.log("🔍 Found stored auth:", auth)
      return auth
    }
  } catch (error) {
    console.error("❌ Error reading auth from localStorage:", error)
  }

  console.log("🔍 No stored auth found, returning default")
  return { user: null, isAuthenticated: false }
}

export function setStoredAuth(auth: AuthState): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  } catch (error) {
    console.error("Error storing auth to localStorage:", error)
  }
}

export function logout(): void {
  console.log("🚪 Logging out user")
  setStoredAuth({ user: null, isAuthenticated: false })
}

// Clear all authentication data (useful for debugging)
export function clearAllAuthData(): void {
  console.log("🧹 Clearing all authentication data")
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}


// TODO: Move this supabase stuff to API

// export async function updateUser(updatedUser: User): Promise<{ success: boolean; error?: string }> {
//   try {
//     // 1. Update Supabase users table
//     const { error } = await supabase
//       .from('users')
//       .update({
//         full_name: updatedUser.name,
//         email: updatedUser.email,
//         phone_number: updatedUser.phone,
//         address: updatedUser.address,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', updatedUser.id)

//     if (error) {
//       console.error('Supabase update error:', error)
//       return { success: false, error: error.message }
//     }

//     // 2. If this is the logged-in user, sync local auth
//     const currentAuth = getStoredAuth()
//     if (currentAuth.user?.id === updatedUser.id) {
//       setStoredAuth({ user: { ...currentAuth.user, ...updatedUser }, isAuthenticated: true })
//     }

//     return { success: true }
//   } catch (err: any) {
//     console.error('Unexpected error:', err)
//     return { success: false, error: err.message }
//   }
// }
