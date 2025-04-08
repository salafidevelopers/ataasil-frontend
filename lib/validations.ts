import * as z from "zod"

// Auth validations
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(["student", "instructor", "admin"], {
      message: "Please select a valid role",
    }),
    secret: z.string().optional(),
  })
  .refine(
    (data) => {
      // If role is admin, secret is required
      if (data.role === "admin") {
        return !!data.secret
      }
      return true
    },
    {
      message: "Admin secret is required for admin registration",
      path: ["secret"],
    },
  )

// Course validations
export const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  videos: z
    .array(
      z.object({
        title: z.string().min(3, { message: "Video title must be at least 3 characters" }),
        url: z.string().url({ message: "Please enter a valid URL" }),
      }),
    )
    .min(1, { message: "At least one video is required" }),
})

// Certificate validations
export const certificateVerifySchema = z.object({
  certificateId: z.string().min(1, { message: "Certificate ID is required" }),
})

// Types derived from schemas
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type CourseFormValues = z.infer<typeof courseSchema>
export type CertificateVerifyFormValues = z.infer<typeof certificateVerifySchema>

