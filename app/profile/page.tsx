"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PasswordChangeForm } from "@/components/password-change-form";
import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-12 px-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Manage your account settings
        </p>

        {isLoading ? (
          <div className="space-y-6 max-w-2xl">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : user ? (
          <div className="max-w-2xl">
            <Tabs
              defaultValue="profile"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <ProfileForm user={user} />
              </TabsContent>
              <TabsContent value="password">
                <PasswordChangeForm />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">User not found</h2>
            <p className="text-muted-foreground mt-2">
              Please log in to view your profile.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
