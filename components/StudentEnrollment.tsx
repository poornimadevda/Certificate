"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast" // Toast dikhane ke liye

// Assume karte hain ki aapke paas Student aur Course ki list fetch karne ke liye API hai
interface Student {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

export function StudentEnrollment() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Component load hone par students aur courses ki list fetch karein
  useEffect(() => {
    // Fetch students
    fetch("http://localhost:5000/api/students")
      .then(res => res.json())
      .then(data => setStudents(data));

    // Fetch courses
    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  // Enroll button click hone par
  const handleEnroll = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      toast({
        title: "Error",
        description: "Please select both a student and a course.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudentId,
          course_id: selectedCourseId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Student has been enrolled in the course.",
        });
        // Reset forms
        setSelectedStudentId(null);
        setSelectedCourseId(null);
      } else {
        toast({
          title: "Failed",
          description: result.error || "Could not enroll student.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Enrollment error:", error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enroll Student in Course</CardTitle>
        <CardDescription>Select a student and a course to enroll them.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Student Select Dropdown */}
        <div className="space-y-2">
          <label>Select Student</label>
          <Select onValueChange={setSelectedStudentId} value={selectedStudentId || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student..." />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Select Dropdown */}
        <div className="space-y-2">
          <label>Select Course</label>
          <Select onValueChange={setSelectedCourseId} value={selectedCourseId || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleEnroll} disabled={isLoading}>
          {isLoading ? "Enrolling..." : "Enroll Student"}
        </Button>
      </CardContent>
    </Card>
  );
}