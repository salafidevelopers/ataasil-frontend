"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCourses, useDeleteCourse } from "@/hooks/use-courses";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, MoreHorizontal, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import type { Course } from "@/types/api";

export default function AdminCoursesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const deleteCourse = useDeleteCourse();
  const router = useRouter();
  const { toast } = useToast();
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const isLoading = authLoading || coursesLoading;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse.mutateAsync(courseToDelete);
      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      });
      setCourseToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course.",
        variant: "destructive",
      });
    }
  };

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
      <main className="flex-1 container py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-0" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                </Link>
              </Button>
              <h1 className="text-4xl font-bold tracking-tight">Courses</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your e-learning courses
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : courses?.data && courses.data.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Videos</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.data.map((course: Course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>{course.videos.length}</TableCell>
                    <TableCell>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course._id}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course._id}/edit`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setCourseToDelete(course._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md">
            <h3 className="text-xl font-semibold">No courses found</h3>
            <p className="text-muted-foreground mt-2">
              Get started by creating a new course.
            </p>
            <Button asChild className="mt-6">
              <Link href="/admin/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                New Course
              </Link>
            </Button>
          </div>
        )}

        <AlertDialog
          open={!!courseToDelete}
          onOpenChange={(open) => !open && setCourseToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                course and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCourse}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <Footer />
    </div>
  );
}
