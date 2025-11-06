"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Clock, BookOpen, Search } from "lucide-react"

interface CourseItem {
  id: string
  name: string
  description: string
  instructor: string
  level: "Beginner" | "Intermediate" | "Advanced"
  students: number
  duration: string
  modules: number
}

export function CourseCatalog() {
  const [courses, setCourses] = useState<CourseItem[]>([
    {
      id: "1",
      name: "Web Development 101",
      description: "Learn modern web development with React, TypeScript, and Node.js",
      instructor: "Dr. Sarah Smith",
      level: "Beginner",
      students: 45,
      duration: "12 weeks",
      modules: 12,
    },
    {
      id: "2",
      name: "Blockchain Basics",
      description: "Introduction to blockchain technology and smart contracts",
      instructor: "Prof. James Johnson",
      level: "Intermediate",
      students: 32,
      duration: "10 weeks",
      modules: 8,
    },
    {
      id: "3",
      name: "Advanced Cryptography",
      description: "Deep dive into modern cryptographic algorithms and security",
      instructor: "Prof. Michael Chen",
      level: "Advanced",
      students: 18,
      duration: "14 weeks",
      modules: 10,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = !selectedLevel || course.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Course Catalog</h1>
        <p className="text-muted-foreground">Explore our comprehensive selection of learning programs</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant={selectedLevel === null ? "default" : "outline"} onClick={() => setSelectedLevel(null)}>
            All Levels
          </Button>
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{course.instructor}</p>
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.modules} modules
                  </div>
                </div>
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Enroll Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No courses found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
