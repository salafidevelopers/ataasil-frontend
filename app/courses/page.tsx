import { CourseList } from "@/components/course-list";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col px-4">
      <MainNav />
      <main className="flex-1 px-6">
        <section className="container py-12">
          <h1 className="text-4xl font-bold tracking-tight mb-8">
            All Courses
          </h1>
          <CourseList />
        </section>
      </main>
      <Footer />
    </div>
  );
}
