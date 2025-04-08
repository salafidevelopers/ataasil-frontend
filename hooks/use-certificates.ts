"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCertificateStore } from "@/store/certificate-store"
import { certificatesApi } from "@/lib/api"
import type { Certificate, CertificateResponse, CertificateVerifyResponse, ApiListResponse } from "@/types/api"

// Generate a certificate
export function useGenerateCertificate() {
  const { generateCertificate } = useCertificateStore()
  const queryClient = useQueryClient()

  return useMutation<CertificateResponse, Error, string>({
    mutationFn: (courseId) => generateCertificate(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] })
    },
  })
}

// Verify a certificate
export function useVerifyCertificate(certificateId: string) {
  const { verifyCertificate } = useCertificateStore()

  return useQuery<CertificateVerifyResponse>({
    queryKey: ["certificates", "verify", certificateId],
    queryFn: () => verifyCertificate(certificateId),
    enabled: !!certificateId,
  })
}

// Download a certificate
export function useDownloadCertificate() {
  const { downloadCertificate } = useCertificateStore()

  return useMutation<void, Error, string>({
    mutationFn: (certificateId) => downloadCertificate(certificateId),
  })
}

// Get user certificates
export function useCertificates() {
  return useQuery<ApiListResponse<Certificate>>({
    queryKey: ["certificates"],
    queryFn: async () => {
      try {
        const response = await certificatesApi.getAllCertificates()
        return response.data
      } catch (error) {
        // If endpoint doesn't exist or user doesn't have access
        return { success: true, count: 0, data: [] }
      }
    },
  })
}

