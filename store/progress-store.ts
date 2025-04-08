import { create } from "zustand"
import { progressApi } from "@/lib/api"
import type { Progress, ApiResponse } from "@/types/api"

interface ProgressState {
  progress: Progress | null
  isLoading: boolean
  error: string | null
  fetchProgress: () => Promise<ApiResponse<Progress>>
  markVideoCompleted: (courseId: string, videoId: string) => Promise<ApiResponse<Progress>>
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: null,
  isLoading: false,
  error: null,

  fetchProgress: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressApi.getMyProgress()
      const progress = response.data
      set({ progress: progress.data, isLoading: false })
      return progress
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  markVideoCompleted: async (courseId, videoId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await progressApi.markVideoCompleted(courseId, videoId)
      const progress = response.data
      set({ progress: progress.data, isLoading: false })
      return progress
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))

