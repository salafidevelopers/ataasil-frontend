import { create } from "zustand"
import { certificatesApi } from "@/lib/api"
import type { Certificate, CertificateResponse, CertificateVerifyResponse } from "@/types/api"

interface CertificateState {
  certificates: Certificate[]
  isLoading: boolean
  error: string | null
  generateCertificate: (courseId: string) => Promise<CertificateResponse>
  verifyCertificate: (certificateId: string) => Promise<CertificateVerifyResponse>
  downloadCertificate: (certificateId: string) => Promise<void>
}

export const useCertificateStore = create<CertificateState>((set) => ({
  certificates: [],
  isLoading: false,
  error: null,

  generateCertificate: async (courseId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificatesApi.generateCertificate(courseId)
      set({ isLoading: false })
      return response.data
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  verifyCertificate: async (certificateId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificatesApi.verifyCertificate(certificateId)
      set({ isLoading: false })
      return response.data
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  downloadCertificate: async (certificateId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await certificatesApi.downloadCertificate(certificateId)

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `certificate-${certificateId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))

