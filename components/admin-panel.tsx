"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Eye, Search } from "lucide-react"
import { CourseDetails } from "./course-details"
import { BlockchainDashboard } from "./blockchain-dashboard"

interface Course {
  id: string
  name: string
  teacher: string
  students: number
}

export function AdminPanel() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Web Development 101", teacher: "Dr. Smith", students: 45 },
    { id: "2", name: "Blockchain Basics", teacher: "Prof. Johnson", students: 32 },
  ])

  const [newCourseName, setNewCourseName] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const addCourse = () => {
    if (newCourseName.trim()) {
      setCourses([
        ...courses,
        {
          id: Date.now().toString(),
          name: newCourseName,
          teacher: "Unassigned",
          students: 0,
        },
      ])
      setNewCourseName("")
    }
  }

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id))
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{courses.reduce((sum, c) => sum + c.students, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">128</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Course name..."
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCourse()}
                />
                <Button onClick={addCourse} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Courses</CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses or teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Teacher: {course.teacher} • {course.students} students
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedCourseId(course.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteCourse(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No courses found matching your search.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage admin, teacher, and student accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">john.teacher@chainlearn.com</h3>
                    <p className="text-sm text-muted-foreground">Teacher • Active</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">student@chainlearn.com</h3>
                    <p className="text-sm text-muted-foreground">Student • Active</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainDashboard />
        </TabsContent>
      </Tabs>

      {selectedCourseId && <CourseDetails courseId={selectedCourseId} onClose={() => setSelectedCourseId(null)} />}
    </div>
  )
}
