"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-8">
          Create New Course
        </h1>
        <div className="max-w-3xl mx-auto">
          <CourseForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
