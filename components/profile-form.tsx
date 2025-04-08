"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { profileSchema, type ProfileFormValues } from "@/lib/validations";
import type { User } from "@/types/api";
import { useUpdateProfile } from "@/hooks/use-profile";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateProfile = useUpdateProfile();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);

    try {
      await updateProfile.mutateAsync(values);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      // Refresh the page to show updated information
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your account details</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the email address you use to log in to your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Role</FormLabel>
              <Input value={user.role} disabled />
              <FormDescription className="mt-1">
                Your account role cannot be changed. Contact an administrator if
                you need a different role.
              </FormDescription>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
