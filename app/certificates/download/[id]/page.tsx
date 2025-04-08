"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { certificatesApi } from "@/lib/api";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Download, ArrowLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CertificateDownloadPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    // Delay the download slightly to ensure component is fully mounted
    const timer = setTimeout(() => {
      if (id) {
        handleDownload();
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDownload = async () => {
    if (!id || typeof id !== "string") return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await certificatesApi.downloadCertificate(id);

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);

      setDownloadStarted(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || "Failed to download certificate");
      toast({
        title: "Download failed",
        description: error.message || "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold tracking-tight text-center">
          Certificate Download
        </h1>
        <p className="text-muted-foreground text-lg mt-2 text-center mb-8">
          Download your Ataasil E-Learning certificate
        </p>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificate Download
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              ) : downloadStarted ? (
                <div className="space-y-4">
                  <p>
                    Your download has started. If it doesn't start
                    automatically, click the button below to try again.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Certificate ID: <span className="font-medium">{id}</span>
                  </p>
                </div>
              ) : (
                <p>Preparing your certificate for download...</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {!isLoading && (
                <>
                  {downloadStarted && (
                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Again
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
