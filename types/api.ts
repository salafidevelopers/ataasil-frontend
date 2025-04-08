export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  count?: number;
  data: T[];
}

// Auth Types
export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = "student" | "admin" | "instructor";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  secret?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Profile Types
export interface ProfileUpdateInput {
  name: string;
  email: string;
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}

// Course Types
export interface Video {
  id: string;
  _id: string;
  title: string;
  url: string;
}

export interface Course {
  id: string;
  _id: string;
  title: string;
  description: string;
  videos: Video[];
  createdAt: string;
}

export interface CourseInput {
  title: string;
  description: string;
  videos: Omit<Video, "id">[];
}

// Progress Types
export interface Progress {
  id: string;
  _id: string;
  user: string;
  course:
    | {
        id: string;
        _id: string;
        title: string;
      }
    | string;
  completedVideos: string[];
  completed: boolean;
  completedAt: string | null;
}

// Certificate Types
export interface Certificate {
  id: string;
  _id: string;
  user: string;
  course: string | { id: string; _id: string; title: string };
  certificateId: string;
  issuedAt: string;
}

export interface CertificateResponse {
  success: boolean;
  certificateId: string;
  message: string;
}

export interface CertificateVerifyData {
  certificateId: string;
  studentName: string;
  courseName: string;
  issuedAt: string;
}

export interface CertificateVerifyResponse {
  success: boolean;
  data: CertificateVerifyData;
}

// Extended types for UI
export interface CourseWithProgress extends Course {
  progress?: {
    completedVideos: string[];
    percentage: number;
  };
}

export interface CertificateWithDetails extends Certificate {
  course: {
    id: string;
    _id: string;
    title: string;
  };
}
