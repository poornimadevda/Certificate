"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, BookOpen, BarChart3 } from "lucide-react"

interface CourseDetailsProps {
  courseId: string
  onClose: () => void
}

export function CourseDetails({ courseId, onClose }: CourseDetailsProps) {
  // Mock course data
  const course = {
    id: courseId,
    name: "Web Development 101",
    description: "Learn modern web development with React and Node.js",
    teacher: "Dr. Sarah Smith",
    status: "Active",
    startDate: "2024-09-01",
    endDate: "2024-12-30",
    students: 45,
    modules: 12,
    averageProgress: 72,
    totalLessons: 48,
    completedLessons: 35,
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">{course.name}</CardTitle>
            <CardDescription className="mt-2">{course.description}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Teacher</p>
              <p className="font-medium text-foreground">{course.teacher}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="w-fit bg-green-600">{course.status}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium text-foreground">{course.startDate}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium text-foreground">{course.endDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{course.students}</div>
                <p className="text-xs text-muted-foreground">Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent">{course.modules}</div>
                <p className="text-xs text-muted-foreground">Modules</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <BarChart3 className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">{course.averageProgress}%</div>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {course.completedLessons}/{course.totalLessons}
                </div>
                <p className="text-xs text-muted-foreground">Lessons</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1 bg-primary hover:bg-primary/90">Edit Course</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              View Students
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
