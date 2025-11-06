"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Award, Download, Share2, Eye, QrCode, Copy, CheckCircle2, RefreshCw } from "lucide-react"
import { CertificateTemplate } from "./certificate-template"
import { User } from "@/app/page" // User type ko import karein

// Interface API response ke hisab se
interface StudentCertificate {
  id: string
  course_name: string
  grade: string
  issue_date: string
  certificate_id: string
  blockchain_hash: string
  status: string
  instructor_name: string
  score: number
}

// User prop receive karein
export function StudentCertificateVault({ user }: { user: User }) {
  const [myCertificates, setMyCertificates] = useState<StudentCertificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [selectedCert, setSelectedCert] = useState<StudentCertificate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState("")

  // Sirf logged-in student ke certificates fetch karein
  const fetchMyCertificates = async () => {
    setIsLoading(true);
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/api/certificates?student_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyCertificates(data);
      } else {
        console.error("Failed to fetch my certificates");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMyCertificates();
  }, [user]); // user change hone par refetch karein

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const generateShareLink = (cert: StudentCertificate) => {
    const link = `${window.location.origin}/verify?cert=${cert.certificate_id}`
    setShareLink(link)
  }

  const stats = {
    total: myCertificates.length,
    verified: myCertificates.filter((c) => c.status === "verified").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blockchain Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Certificate List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Certificates</CardTitle>
             <Button variant="outline" size="icon" onClick={fetchMyCertificates} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardDescription>Your academic credentials verified on blockchain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
             <p className="text-center text-muted-foreground">Loading certificates...</p>
          ) : myCertificates.length > 0 ? (
            myCertificates.map((cert) => (
              <div key={cert.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-accent" />
                      <h3 className="font-medium text-foreground">{cert.course_name}</h3>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100">
                        {cert.grade}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">ID: {cert.certificate_id}</p>
                  </div>
                  {cert.status === "verified" && (
                    <div className="flex items-center gap-1 text-green-600 font-medium text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Blockchain Hash */}
                <div className="p-3 bg-muted/50 rounded flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Blockchain Hash</p>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      {cert.blockchain_hash.substring(0, 40)}...
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(cert.blockchain_hash, cert.id)}>
                    {copiedId === cert.id ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCert(cert)
                      setShowPreview(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generateShareLink(cert)}>
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <QrCode className="w-4 h-4 mr-1" />
                    QR Code
                  </Button>
                </div>

                {shareLink && (
                  <div className="p-3 bg-accent/10 rounded border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-2">Share Link:</p>
                    <div className="flex gap-2">
                      <Input value={shareLink} readOnly className="h-8 text-xs" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink)
                          setShareLink("")
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No certificates yet. Complete courses to earn certificates!</p>
            </div>
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
                studentName={user.name}
                courseName={selectedCert.course_name}
                issueDate={new Date(selectedCert.issue_date).toLocaleDateString()}
                certificateId={selectedCert.certificate_id}
                instructorName={selectedCert.instructor_name}
                grade={selectedCert.grade}
                blockchainHash={selectedCert.blockchain_hash}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}