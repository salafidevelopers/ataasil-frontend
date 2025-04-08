"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-12">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-[400px] w-full mt-6" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-0" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                </Link>
              </Button>
              <h1 className="text-4xl font-bold tracking-tight">Users</h1>
            </div>
            <p className="text-muted-foreground">Manage platform users</p>
          </div>
        </div>

        <div className="text-center py-12 border rounded-md">
          <h3 className="text-xl font-semibold">User Management Coming Soon</h3>
          <p className="text-muted-foreground mt-2">
            This feature is under development. Check back later for user
            management capabilities.
          </p>
          <Button asChild className="mt-6">
            <Link href="/admin">Return to Dashboard</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
