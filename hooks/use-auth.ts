"use client";

import { useContext, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { AuthContext } from "@/providers/auth-provider";

export function useAuth() {
  const { isInitialized } = useContext(AuthContext);
  const { user, isLoading, error, login, register, logout, fetchCurrentUser } =
    useAuthStore();

  // Track if user data has been fetched already
  const userFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if initialized, user exists, not currently loading, and hasn't been fetched
    if (isInitialized && user && !isLoading && !userFetchedRef.current) {
      // Mark as fetched before the API call to prevent loops
      userFetchedRef.current = true;

      fetchCurrentUser().catch(() => {
        // Silent catch - the interceptor will handle token issues
      });
    }
  }, [isInitialized, user, isLoading]); // Remove fetchCurrentUser from dependencies

  // Reset the flag if user changes (e.g., on logout)
  useEffect(() => {
    if (!user) {
      userFetchedRef.current = false;
    }
  }, [user]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    fetchCurrentUser,
  };
}
