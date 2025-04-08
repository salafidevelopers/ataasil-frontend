import type { User } from "@/types/api"

// Helper functions for auth management

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export const setAuthData = (token: string, user: User): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_token", token)
  localStorage.setItem("auth_user", JSON.stringify(user))
}

export const clearAuthData = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
  localStorage.removeItem("auth_user")
}

export const getAuthUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userJson = localStorage.getItem("auth_user")
  if (!userJson) return null
  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

