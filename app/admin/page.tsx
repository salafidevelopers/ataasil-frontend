"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
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
import { BookOpen, Users, Award, BarChart3, Plus } from "lucide-react";
import { useCourses } from "@/hooks/use-courses";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const router = useRouter();

  const isLoading = authLoading || coursesLoading;

  useEffect(() => {
    console.log({ user });

    if (!authLoading && (!user || user.role !== "admin")) {
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
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[200px]" />
              ))}
            </div>
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
      <main className="flex-1 container py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Manage your e-learning platform
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  courses?.data?.length || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {courses?.data?.length === 1 ? "Course" : "Courses"} available
                on the platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Students enrolled in courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Certificates Issued
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Total certificates generated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--%</div>
              <p className="text-xs text-muted-foreground">
                Average course completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>
                Create, edit, and manage your courses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">All Courses</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/courses">View All</Link>
                </Button>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Add New Course</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/courses/new">Create</Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/admin/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Courses
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage students and instructors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">All Users</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/users">View All</Link>
                </Button>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Student Progress</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/progress">View</Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
