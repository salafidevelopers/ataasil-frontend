"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { courseSchema, type CourseFormValues } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"
import { useCreateCourse, useUpdateCourse } from "@/hooks/use-courses"
import { useRouter } from "next/navigation"
import type { Course } from "@/types/api"

interface CourseFormProps {
  initialData?: Course
  courseId?: string
}

export function CourseForm({ initialData, courseId }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse(courseId || "")

  const defaultValues: CourseFormValues = initialData
    ? {
        title: initialData.title,
        description: initialData.description,
        videos: initialData.videos.map((v) => ({ title: v.title, url: v.url })) || [],
      }
    : {
        title: "",
        description: "",
        videos: [{ title: "", url: "" }],
      }

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "videos",
    control: form.control,
  })

  const onSubmit = async (values: CourseFormValues) => {
    setIsLoading(true)

    try {
      if (courseId) {
        await updateCourse.mutateAsync(values)
        toast({
          title: "Course updated",
          description: "The course has been updated successfully.",
        })
      } else {
        await createCourse.mutateAsync(values)
        toast({
          title: "Course created",
          description: "The course has been created successfully.",
        })
        form.reset(defaultValues)
      }
      router.push("/admin/courses")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{courseId ? "Edit Course" : "Create Course"}</CardTitle>
        <CardDescription>{courseId ? "Update the course details" : "Add a new course to the platform"}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to TypeScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A comprehensive introduction to TypeScript programming language."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Videos</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", url: "" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </div>

              <FormDescription>Add videos to your course. You need at least one video.</FormDescription>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Video {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove video</span>
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`videos.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Introduction to TypeScript" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`videos.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.youtube.com/watch?v=example" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {form.formState.errors.videos?.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.videos.root.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (courseId ? "Updating..." : "Creating...") : courseId ? "Update Course" : "Create Course"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

