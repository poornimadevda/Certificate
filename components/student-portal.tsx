"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen } from "lucide-react"
import { StudentCertificateVault } from "./student-certificate-vault"
import { User } from "@/app/page" // User type ko import karein

interface Course {
  id: string
  name: string
  progress: number
  status: "In Progress" | "Completed"
}

// User prop ko receive karein
export function StudentPortal({ user }: { user: User }) {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Web Development 101", progress: 85, status: "In Progress" },
    { id: "2", name: "Blockchain Basics", progress: 100, status: "Completed" },
  ])

  // Stats (yeh bhi API se aa sakte hain, abhi hardcoded hain)
  const enrolledCount = courses.length
  const completedCount = courses.filter((c) => c.status === "Completed").length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{enrolledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {completedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Yeh count ab certificate vault se dynamically aa sakta hai */}
            <div className="text-3xl font-bold text-secondary">...</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="certificates">My Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {course.name}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground">{course.status}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{course.progress}% Complete</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          {/* User object ko StudentCertificateVault mein pass karein */}
          <StudentCertificateVault user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}