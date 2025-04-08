import { Progress } from "@/components/ui/progress"

interface CourseProgressProps {
  total: number
  completed: number
}

export function CourseProgress({ total, completed }: CourseProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {completed} of {total} video{total !== 1 ? "s" : ""} completed
      </p>
    </div>
  )
}

