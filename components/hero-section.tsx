import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Learn at Your Own Pace
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Discover high-quality courses taught by expert instructors. Advance your career, learn new skills, and
                get certified.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Hero Image"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              height="310"
              src="/placeholder.svg?height=310&width=550"
              width="550"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

