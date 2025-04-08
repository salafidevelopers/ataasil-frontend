import { Button } from "@/components/ui/button";
import { CourseList } from "@/components/course-list";
import { HeroSection } from "@/components/hero-section";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <HeroSection />
        <section className="container py-12  px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Available Courses
            </h2>
            <Button variant="outline" asChild>
              <a href="/courses">View All</a>
            </Button>
          </div>
          <CourseList />
        </section>
      </main>
      <Footer />
    </div>
  );
}
