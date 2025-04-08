"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { getAuthUser, isAuthenticated } from "@/lib/auth"
import { useAuthStore } from "@/store/auth-store"

interface AuthContextType {
  isInitialized: boolean
}

export const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const { setUser } = useAuthStore()

  useEffect(() => {
    // Initialize auth state from localStorage
    if (isAuthenticated()) {
      const user = getAuthUser()
      if (user) {
        setUser(user)
      }
    }

    setIsInitialized(true)
  }, [setUser])

  return <AuthContext.Provider value={{ isInitialized }}>{children}</AuthContext.Provider>
}

