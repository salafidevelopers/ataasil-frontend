"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { coursesApi } from "@/lib/api"
import type { Course, CourseInput, ApiResponse, ApiListResponse } from "@/types/api"

// Get all courses
export function useCourses() {
  return useQuery<ApiListResponse<Course>>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await coursesApi.getAllCourses()
      return response.data
    },
  })
}

// Get a single course by ID
export function useCourse(courseId: string) {
  return useQuery<ApiResponse<Course>>({
    queryKey: ["courses", courseId],
    queryFn: async () => {
      const response = await coursesApi.getCourse(courseId)
      return response.data
    },
    enabled: !!courseId,
  })
}

// Admin: Create a new course
export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<Course>, Error, CourseInput>({
    mutationFn: async (courseData) => {
      const response = await coursesApi.createCourse(courseData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}

// Admin: Update a course
export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<Course>, Error, CourseInput>({
    mutationFn: async (courseData) => {
      const response = await coursesApi.updateCourse(courseId, courseData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] })
    },
  })
}

// Admin: Delete a course
export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<{}>, Error, string>({
    mutationFn: async (courseId) => {
      const response = await coursesApi.deleteCourse(courseId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}

