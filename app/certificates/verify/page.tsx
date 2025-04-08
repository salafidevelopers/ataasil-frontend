import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { CertificateVerifyForm } from "@/components/certificate-verify-form";

export default function VerifyCertificatePage() {
  return (
    <div className="flex min-h-screen flex-col ">
      <MainNav />
      <main className="flex-1 container py-12 px-6">
        <h1 className="text-4xl font-bold tracking-tight text-center">
          Certificate Verification
        </h1>
        <p className="text-muted-foreground text-lg mt-2 text-center mb-8">
          Verify the authenticity of an Ataasil E-Learning certificate
        </p>

        <div className="max-w-md mx-auto">
          <CertificateVerifyForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
