"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Trash2, Edit2, RefreshCw } from "lucide-react"
import { Label } from "@/components/ui/label"

// Interfaces API response ke hisab se
interface Student {
  id: string
  name: string
  email: string
}

interface Course {
  id: string
  name: string
}

interface GradeRecord {
  id: string
  student_id: string
  student_name: string
  student_email: string
  course_id: string
  course_name: string
  grade: string | null
  score: number | null
  feedback: string
  certificate_issued: boolean
}

export function GradeManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [grades, setGrades] = useState<GradeRecord[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [grade, setGrade] = useState("")
  const [score, setScore] = useState("")
  const [feedback, setFeedback] = useState("")

  // Data fetch karne ke functions
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users?role=student")
      if (res.ok) setStudents(await res.json())
    } catch (e) { console.error("Failed to fetch students", e) }
  }

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses")
      if (res.ok) setCourses(await res.json())
    } catch (e) { console.error("Failed to fetch courses", e) }
  }

  const fetchGrades = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/grades")
      if (res.ok) setGrades(await res.json())
    } catch (e) { console.error("Failed to fetch grades", e) }
    setIsLoading(false)
  }

  // Initial data load
  useEffect(() => {
    fetchStudents()
    fetchCourses()
    fetchGrades()
  }, [])

  // Grade submit logic (API call)
  const submitGrade = async () => {
    if (!selectedStudentId || !selectedCourseId || !grade || !score) {
      alert("Please select student, course, grade, and score.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:5000/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudentId,
          course_id: selectedCourseId,
          grade: grade,
          score: parseInt(score, 10),
          feedback: feedback,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Grade submitted successfully! Certificate is being verified.")
        resetForm()
        await fetchGrades() // Refresh grade list
      } else {
        alert(`Failed to submit grade: ${result.error}`)
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error. Could not submit grade.")
    }
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setSelectedStudentId("")
    setSelectedCourseId("")
    setGrade("")
    setScore("")
    setFeedback("")
  }

  // Helper
  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100"
    if (["A", "A+"].includes(grade)) return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"
    return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100"
  }

  return (
    <div className="space-y-6">
      {/* Grade Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Grade</CardTitle>
          <CardDescription>Select student, course, and assign a grade. This will automatically issue and verify the certificate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Select */}
            <div>
              <Label>Student</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Select */}
            <div>
              <Label>Course</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grade Select */}
            <div>
              <Label>Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C+">C+</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Score Input */}
            <div>
              <Label>Score (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 95"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </div>
          </div>

          {/* Feedback Textarea */}
          <div>
            <Label>Feedback (Optional)</Label>
            <textarea
              placeholder="Provide constructive feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground mt-1 min-h-20 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button onClick={submitGrade} disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Submitting..." : "Submit Grade & Issue Certificate"}
          </Button>
        </CardContent>
      </Card>

      {/* Student Grades List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Submitted Grades</CardTitle>
            <Button variant="outline" size="icon" onClick={fetchGrades} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading grades...</p>
            ) : grades.length === 0 ? (
               <p className="text-center text-muted-foreground">No grades submitted yet.</p>
            ) : (
              grades.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{g.student_name}</h3>
                    <p className="text-sm text-muted-foreground">{g.course_name}</p>
                    {g.feedback && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Feedback: {g.feedback}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {g.grade ? (
                      <Badge className={getGradeColor(g.grade)}>
                        {g.grade} ({g.score}%)
                      </Badge>
                    ) : (
                      <Badge className={getGradeColor(null)}>Pending</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}