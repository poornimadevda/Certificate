"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeManagement } from "./grade-management"
import { CertificateIssuance } from "./certificate-issuance"

interface Student {
  id: string
  name: string
  email: string
  grade: string | null
}

export function TeacherPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificates Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">2</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grades">Manage Grades</TabsTrigger>
          <TabsTrigger value="certificates">Issue Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-4">
          <GradeManagement />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <CertificateIssuance />
        </TabsContent>
      </Tabs>
    </div>
  )
}
