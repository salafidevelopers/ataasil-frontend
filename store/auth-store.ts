import { create } from "zustand"
import { authApi } from "@/lib/api"
import { setAuthData, clearAuthData } from "@/lib/auth"
import type { User, RegisterInput } from "@/types/api"

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (params: RegisterInput) => Promise<void>
  logout: () => void
  fetchCurrentUser: () => Promise<User>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.login({ email, password })
      const { token, user } = response.data
      setAuthData(token, user)
      set({ user, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  register: async (params) => {
    set({ isLoading: true, error: null })
    try {
      await authApi.register(params)
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    clearAuthData()
    set({ user: null })
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.getCurrentUser()
      const { data } = response.data
      set({ user: data, isLoading: false })
      return data
    } catch (error: any) {
      set({ error: error.message, isLoading: false, user: null })
      clearAuthData()
      throw error
    }
  },
}))

