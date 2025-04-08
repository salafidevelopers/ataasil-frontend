"use client";

import { useCourses } from "@/hooks/use-courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Course } from "@/types/api";

export function CourseList() {
  const { data, isLoading } = useCourses();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video w-full bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
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

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No courses available</h3>
        <p className="text-muted-foreground mt-2">
          Check back later for new courses.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.data.map((course: Course) => (
        <Card key={course._id} className="overflow-hidden flex flex-col">
          <div className="aspect-video w-full bg-muted">
            <img
              alt={course.title}
              className="object-cover w-full h-full"
              height="200"
              src="/placeholder.svg?height=200&width=400"
              width="400"
            />
          </div>
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>
              {course.videos.length} video
              {course.videos.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="line-clamp-3">{course.description}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href={`/courses/${course._id}`}>View Course</a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
