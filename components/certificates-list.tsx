"use client";

import {
  useCertificates,
  useDownloadCertificate,
  useUserCertificates,
} from "@/hooks/use-certificates";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CertificateWithDetails } from "@/types/api";

export function CertificatesList() {
  const { data, isLoading } = useUserCertificates();
  const downloadCertificate = useDownloadCertificate();
  const { toast } = useToast();

  const handleDownload = async (certificateId: string) => {
    try {
      await downloadCertificate.mutateAsync(certificateId);
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download certificate.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Filter the data to only include items where course is the detailed object
  const certificatesWithDetails =
    data?.data?.filter(
      (cert): cert is CertificateWithDetails => typeof cert.course === "object"
    ) ?? []; // Use nullish coalescing for safety

  console.log({ certificatesWithDetails, certi: data?.data });

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold mt-4">No certificates yet</h3>
        <p className="text-muted-foreground mt-2">
          Complete courses to earn certificates.
        </p>
        <Button asChild className="mt-6">
          <a href="/courses">Browse Courses</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {certificatesWithDetails.map((certificate) => (
        <Card key={certificate.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {certificate.course.title}
            </CardTitle>
            <CardDescription>
              Issued on {new Date(certificate.issuedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Certificate ID:{" "}
              <span className="font-medium">{certificate.certificateId}</span>
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleDownload(certificate.certificateId)}
              disabled={downloadCertificate.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button asChild size="sm" className="flex-1">
              <a
                href={`/certificates/verify/${certificate.certificateId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Verify
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
