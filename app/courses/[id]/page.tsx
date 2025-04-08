"use client";

import { useParams } from "next/navigation";
import { useCourse } from "@/hooks/use-courses";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/video-player";
import { CourseProgress } from "@/components/course-progress";
import { GenerateCertificateButton } from "@/components/generate-certificate-button";

export default function CoursePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: course, isLoading: courseLoading } = useCourse(id as string);
  const { data: progress, isLoading: progressLoading } = useProgress();

  const isLoading = courseLoading || progressLoading;

  // Find user progress for this course
  const userProgressForCourse = progress?.data?.find((p) => {
    // Check if course is a string (just the ID)
    if (typeof p.course === "string") {
      return p.course === id;
    }
    // Otherwise, it's an object with _id property
    return p.course._id === id;
  });

  const completedVideos = userProgressForCourse?.completedVideos || [];

  const isCompleted = completedVideos?.length === course?.data?.videos?.length;

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12 px-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : course?.data ? (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {course.data.title}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {course.data.description}
              </p>
            </div>

            {user && (
              <CourseProgress
                total={course.data.videos.length}
                completed={completedVideos?.length || 0}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Course Content</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  {course.data.videos.map((video, index) => (
                    <VideoPlayer
                      key={index}
                      video={video}
                      courseId={course.data._id}
                      isCompleted={completedVideos?.includes(video._id)}
                    />
                  ))}
                </div>
              </div>

              {user && isCompleted && (
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">
                    Course Completed!
                  </h3>
                  <p className="mb-6">
                    Congratulations on completing this course. You can now
                    generate your certificate.
                  </p>
                  <GenerateCertificateButton courseId={course.data._id} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Course not found</h2>
            <p className="text-muted-foreground mt-2">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="mt-6">
              <a href="/courses">Browse Courses</a>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
