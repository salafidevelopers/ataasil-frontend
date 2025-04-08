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
  PasswordChangeInput,
  ProfileUpdateInput,
} from "@/types/api";

// --- Define API URLs based on environment ---
const PROD_API_BASE_URL =
  "https://ataasil-backend-production.up.railway.app/api/v1"; // Use HTTPS for production
const DEV_API_BASE_URL = "http://localhost:5000/api/v1";

// Determine the correct URL based on NODE_ENV
// process.env.NODE_ENV is 'production' in production builds/environments
// It's usually 'development' otherwise (locally).
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? PROD_API_BASE_URL : DEV_API_BASE_URL;

console.log(`API Base URL set to: ${API_BASE_URL}`); // Optional: Log the URL being used for debugging

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // Use the dynamically determined URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Make sure token retrieval works in both server/client contexts if needed
    const token = typeof window !== "undefined" ? getAuthToken() : null;
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
      // Ensure localStorage access is guarded for environments where it's not available (like server-side rendering)
      if (typeof window !== "undefined") {
        console.error("Unauthorized request. Clearing auth token."); // Log the action
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
    }

    // Extract error message from API response if available
    const errorMessage =
      response?.data?.error ||
      response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Log the detailed error
    console.error("API Error:", errorMessage, {
      status: response?.status,
      config: error.config, // Contains request details
      data: response?.data, // Contains response body
    });

    // Create a custom error with the message
    const customError = new Error(errorMessage);
    // Optionally attach status code or other details to the custom error
    // (customError as any).status = response?.status;
    // (customError as any).data = response?.data;

    return Promise.reject(customError);
  }
);

// --- API Function Exports (Remain the same) ---

// Auth API
export const authApi = {
  login: (data: LoginInput): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", data),

  register: (data: RegisterInput): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),

  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get("/auth/me"),
};

// Profile API
export const profileApi = {
  updateProfile: (
    data: ProfileUpdateInput
  ): Promise<AxiosResponse<ApiResponse<User>>> => api.put("/profile", data),

  changePassword: (
    data: PasswordChangeInput
  ): Promise<AxiosResponse<ApiResponse<{}>>> =>
    api.put("/profile/password", data),
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

  getUserCertificates: (): Promise<
    AxiosResponse<ApiListResponse<Certificate>>
  > => api.get("/certificates/my-certificates"),
};

export default api;
