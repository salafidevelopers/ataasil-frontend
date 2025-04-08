"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api";
import type {
  ProfileUpdateInput,
  PasswordChangeInput,
  ApiResponse,
  User,
} from "@/types/api";
import { useAuthStore } from "@/store/auth-store";

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation<ApiResponse<User>, Error, ProfileUpdateInput>({
    mutationFn: async (profileData) => {
      const response = await profileApi.updateProfile(profileData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update auth store with new user data
      setUser(data.data);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation<ApiResponse<{}>, Error, PasswordChangeInput>({
    mutationFn: async (passwordData) => {
      const response = await profileApi.changePassword(passwordData);
      return response.data;
    },
  });
}
