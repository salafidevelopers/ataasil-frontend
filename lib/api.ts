import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { getAuthToken } from "@/lib/auth";
import type {
  ApiResponse,
  ApiListResponse,
  AuthResponse,
  Course,
  Certificate,
  Progress,
  CertificateResponse,
  CertificateVerifyResponse,
  LoginInput,
  RegisterInput,
  CourseInput,
  User,
} from "@/types/api";

const API_BASE_URL = "https://ataasil-backend-production.up.railway.app/api/v1";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle specific error cases
    if (response?.status === 401) {
      // Handle unauthorized (could redirect to login or refresh token)
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }

    // Extract error message from API response if available
    const errorMessage =
      response?.data?.error || "An unexpected error occurred";

    // Create a custom error with the message
    const customError = new Error(errorMessage);
    return Promise.reject(customError);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginInput): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", data),

  register: (data: RegisterInput): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),

  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get("/auth/me"),
};

// Courses API
export const coursesApi = {
  getAllCourses: (): Promise<AxiosResponse<ApiListResponse<Course>>> =>
    api.get("/courses"),

  getCourse: (id: string): Promise<AxiosResponse<ApiResponse<Course>>> =>
    api.get(`/courses/${id}`),

  createCourse: (
    data: CourseInput
  ): Promise<AxiosResponse<ApiResponse<Course>>> => api.post("/courses", data),

  updateCourse: (
    id: string,
    data: CourseInput
  ): Promise<AxiosResponse<ApiResponse<Course>>> =>
    api.put(`/courses/${id}`, data),

  deleteCourse: (id: string): Promise<AxiosResponse<ApiResponse<{}>>> =>
    api.delete(`/courses/${id}`),
};

// Progress API
export const progressApi = {
  getMyProgress: (): Promise<AxiosResponse<ApiResponse<Progress>>> =>
    api.get("/progress/my-progress"),

  markVideoCompleted: (
    courseId: string,
    videoId: string
  ): Promise<AxiosResponse<ApiResponse<Progress>>> =>
    api.post(`/progress/courses/${courseId}/videos/${videoId}/complete`),

  getAllProgress: (): Promise<AxiosResponse<ApiListResponse<Progress>>> =>
    api.get("/progress/all"),

  getCourseProgress: (
    courseId: string
  ): Promise<AxiosResponse<ApiListResponse<Progress>>> =>
    api.get(`/progress/courses/${courseId}`),
};

// Certificates API
export const certificatesApi = {
  generateCertificate: (
    courseId: string
  ): Promise<AxiosResponse<CertificateResponse>> =>
    api.post(`/certificates/generate/${courseId}`),

  downloadCertificate: (certificateId: string): Promise<AxiosResponse<Blob>> =>
    api.get(`/certificates/download/${certificateId}`, {
      responseType: "blob",
    }),

  verifyCertificate: (
    certificateId: string
  ): Promise<AxiosResponse<CertificateVerifyResponse>> =>
    api.get(`/certificates/verify/${certificateId}`),

  getAllCertificates: (): Promise<
    AxiosResponse<ApiListResponse<Certificate>>
  > => api.get("/certificates"),
};

export default api;
