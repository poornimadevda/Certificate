"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Award, Download, RefreshCw } from "lucide-react"
import { CertificateTemplate } from "./certificate-template"

// Interface ko API response ke hisab se update kiya
interface CertificateRecord {
  id: string
  student_name: string
  student_email: string
  course_name: string
  grade: string
  score: number
  issue_date: string | null
  certificate_id: string | null
  blockchain_hash: string | null
  status: "pending" | "issued" | "verified"
  instructor_name: string
}

export function CertificateIssuance() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // API se data fetch karne ke liye function
  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/certificates");
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      } else {
        console.error("Failed to fetch certificates");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    setIsLoading(false);
  };

  // Component load hone par data fetch kiya
  useEffect(() => {
    fetchCertificates();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100"
      case "issued":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100"
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"
      default:
        return ""
    }
  }

  const pendingCount = certificates.filter((c) => c.status === "pending").length
  const issuedCount = certificates.filter((c) => c.status === "issued").length
  const verifiedCount = certificates.filter((c) => c.status === "verified").length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{certificates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Issued (Old)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{issuedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{verifiedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Certificate List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Certificate Log</CardTitle>
              <CardDescription>Monitor all certificates issued by the system.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={fetchCertificates} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading certificates...</p>
          ) : certificates.length === 0 ? (
            <p className="text-center text-muted-foreground">No certificates found. Submit grades to issue them.</p>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="p-4 border border-border rounded-lg space-y-3 hover:bg-muted/30 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-accent" />
                      <h3 className="font-medium text-foreground">{cert.student_name}</h3>
                      <Badge className={getStatusColor(cert.status)}>{cert.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{cert.course_name}</p>
                    <p className="text-xs text-muted-foreground">Email: {cert.student_email}</p>
                    <p className="text-xs text-muted-foreground">
                      Grade: {cert.grade} ({cert.score}%)
                    </p>
                    {cert.certificate_id && (
                      <p className="text-xs font-mono text-muted-foreground mt-1">ID: {cert.certificate_id}</p>
                    )}
                    {cert.blockchain_hash && (
                      <p className="text-xs font-mono text-muted-foreground break-all">Hash: {cert.blockchain_hash}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {/* "Issue" and "Verify" buttons hata diye gaye hain */}
                    
                    {cert.status === "verified" && (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium px-3">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified
                      </div>
                    )}

                    {cert.certificate_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCert(cert)
                          setShowPreview(true)
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Certificate Preview Modal */}
      {showPreview && selectedCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certificate Preview</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CertificateTemplate
                studentName={selectedCert.student_name}
                courseName={selectedCert.course_name}
                issueDate={selectedCert.issue_date ? new Date(selectedCert.issue_date).toLocaleDateString() : new Date().toLocaleDateString()}
                certificateId={selectedCert.certificate_id || "CERT-PREVIEW"}
                instructorName={selectedCert.instructor_name || "Dr. Sarah Smith"}
                grade={selectedCert.grade}
                blockchainHash={selectedCert.blockchain_hash || "Not Verified"}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}