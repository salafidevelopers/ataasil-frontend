"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { useCourses } from "@/hooks/use-courses";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseProgress } from "@/components/course-progress";
import { CertificatesList } from "@/components/certificates-list";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const router = useRouter();

  const isLoading = authLoading || progressLoading || coursesLoading;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-12 px-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px]" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12 px-6">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg mt-2">
          Welcome back, {user?.name}
        </p>

        <Tabs defaultValue="my-courses" className="mt-8">
          <TabsList>
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">My Certificates</TabsTrigger>
          </TabsList>
          <TabsContent value="my-courses" className="mt-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[200px]" />
                ))}
              </div>
            ) : progress?.data && courses?.data ? (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {courses.data.map((course) => {
                    // Find progress for this course
                    const courseVideos = course.videos.map((v) => v._id);
                    const userProgress = progress.data.find((p) => {
                      // Check if course is a string (just the ID)
                      if (typeof p.course === "string") {
                        return p.course === course._id;
                      }
                      // Otherwise, it's an object with _id property
                      return p.course._id === course._id;
                    });
                    const completedVideos = userProgress?.completedVideos || [];

                    const completionPercentage =
                      courseVideos.length > 0
                        ? (completedVideos.length / courseVideos.length) * 100
                        : 0;

                    return (
                      <Card key={course._id}>
                        <CardHeader>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>
                            {course.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <CourseProgress
                            total={courseVideos.length}
                            completed={completedVideos.length}
                          />
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <a href={`/courses/${course._id}`}>
                              {completionPercentage === 100
                                ? "Review Course"
                                : "Continue Learning"}
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>

                {courses.data.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold">No courses found</h3>
                    <p className="text-muted-foreground mt-2">
                      Explore our catalog to find courses that interest you.
                    </p>
                    <Button asChild className="mt-6">
                      <a href="/courses">Browse Courses</a>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold">Error loading courses</h3>
                <p className="text-muted-foreground mt-2">
                  Please try again later.
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="certificates" className="mt-6">
            <CertificatesList />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
