"use client"

import { useParams } from "next/navigation"
import { useVerifyCertificate } from "@/hooks/use-certificates"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerifyCertificatePage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useVerifyCertificate(id as string)

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold tracking-tight text-center">Certificate Verification</h1>
        <p className="text-muted-foreground text-lg mt-2 text-center mb-8">
          Verify the authenticity of an Ataasil E-Learning certificate
        </p>

        <div className="max-w-md mx-auto">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ) : isError ? (
            <Card className="border-destructive">
              <CardHeader className="bg-destructive/10 text-destructive">
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Invalid Certificate
                </CardTitle>
                <CardDescription className="text-destructive/80">
                  This certificate could not be verified
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p>
                  The certificate ID <strong>{id}</strong> is not valid or does not exist in our records.
                </p>
              </CardContent>
            </Card>
          ) : data?.success ? (
            <Card className="border-green-500">
              <CardHeader className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Valid Certificate
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  This certificate has been verified as authentic
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificate ID</p>
                  <p>{data.data.certificateId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                  <p>{data.data.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course</p>
                  <p>{data.data.courseName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                  <p>{new Date(data.data.issuedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-destructive">
              <CardHeader className="bg-destructive/10 text-destructive">
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Verification Failed
                </CardTitle>
                <CardDescription className="text-destructive/80">Could not verify certificate</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p>There was a problem verifying this certificate. Please try again later.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

