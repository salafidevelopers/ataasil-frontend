"use client"

import { useState } from "react"
import { useGenerateCertificate } from "@/hooks/use-certificates"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Award } from "lucide-react"

interface GenerateCertificateButtonProps {
  courseId: string
}

export function GenerateCertificateButton({ courseId }: GenerateCertificateButtonProps) {
  const [certificateId, setCertificateId] = useState<string | null>(null)
  const generateCertificate = useGenerateCertificate()
  const { toast } = useToast()

  const handleGenerateCertificate = async () => {
    try {
      const result = await generateCertificate.mutateAsync(courseId)
      setCertificateId(result.certificateId)
      toast({
        title: "Certificate generated",
        description: "Your certificate has been generated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate certificate.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {!certificateId ? (
        <Button onClick={handleGenerateCertificate} disabled={generateCertificate.isPending} className="w-full">
          <Award className="mr-2 h-4 w-4" />
          {generateCertificate.isPending ? "Generating..." : "Generate Certificate"}
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm">
            Certificate ID: <span className="font-medium">{certificateId}</span>
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <a href={`/certificates/download/${certificateId}`} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </Button>
            <Button asChild className="flex-1">
              <a href={`/certificates/verify/${certificateId}`} target="_blank" rel="noopener noreferrer">
                Verify
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

