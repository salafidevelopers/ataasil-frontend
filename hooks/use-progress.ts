"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgressStore } from "@/store/progress-store";
import { progressApi } from "@/lib/api";
import type { Progress, ApiResponse, ApiListResponse } from "@/types/api";

// Get user progress
export function useProgress() {
  const { fetchProgress } = useProgressStore();

  return useQuery<ApiListResponse<Progress>>({
    queryKey: ["progress"],
    queryFn: async () => {
      // Call fetchProgress which returns ApiResponse<Progress>
      const result = await fetchProgress();

      // Transform to match expected ApiListResponse<Progress> format
      return {
        success: result.success,
        data: Array.isArray(result.data)
          ? result.data
          : [result.data].filter(Boolean),
      } as ApiListResponse<Progress>;
    },
    select: (data) => {
      // Ensure we have a valid data structure even if the API returns unexpected format
      if (!data || !data.data) {
        console.log({ progress: data });
        return data;
      }

      // Ensure each progress item has completedVideos as an array
      data.data = data.data.map((progress) => {
        if (!progress.completedVideos) {
          progress.completedVideos = [];
        }
        return progress;
      });

      return data;
    },
  });
}

// Mark a video as completed
export function useMarkVideoCompleted() {
  const { markVideoCompleted } = useProgressStore();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Progress>,
    Error,
    { courseId: string; videoId: string }
  >({
    mutationFn: ({ courseId, videoId }) =>
      markVideoCompleted(courseId, videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

// Admin: Get all progress records
export function useAllProgress() {
  return useQuery<ApiListResponse<Progress>>({
    queryKey: ["admin", "progress"],
    queryFn: async () => {
      const response = await progressApi.getAllProgress();
      return response.data;
    },
  });
}

// Admin: Get progress for a specific course
export function useCourseProgress(courseId: string) {
  return useQuery<ApiListResponse<Progress>>({
    queryKey: ["admin", "progress", courseId],
    queryFn: async () => {
      const response = await progressApi.getCourseProgress(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
}
