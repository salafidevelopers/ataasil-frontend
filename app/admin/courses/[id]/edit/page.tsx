"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCourse } from "@/hooks/use-courses";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { CourseForm } from "@/components/admin/course-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCoursePage() {
  const { id } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { data: course, isLoading: courseLoading } = useCourse(id as string);
  const router = useRouter();

  const isLoading = authLoading || courseLoading;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // if (authLoading || !user) {
  //   return null // Will redirect in useEffect
  // }

  // if (user.role !== "admin") {
  //   return null // Will redirect in useEffect
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12 px-6">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Edit Course</h1>
        <div className="max-w-3xl mx-auto">
          {courseLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : course?.data ? (
            <CourseForm initialData={course.data} courseId={id as string} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Course not found</h2>
              <p className="text-muted-foreground mt-2">
                The course you're trying to edit doesn't exist.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
