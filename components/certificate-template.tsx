"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

interface CertificateTemplateProps {
  studentName: string
  courseName: string
  issueDate: string
  certificateId: string
  instructorName: string
  grade: string
  blockchainHash?: string
}

export function CertificateTemplate({
  studentName,
  courseName,
  issueDate,
  certificateId,
  instructorName,
  grade,
  blockchainHash,
}: CertificateTemplateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const downloadCertificate = () => {
    if (certificateRef.current) {
      const element = certificateRef.current
      const link = document.createElement("a")
      link.href = `data:image/png;base64,${btoa(element.innerHTML)}`
      link.download = `certificate-${certificateId}.png`
      link.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        className="w-full bg-gradient-to-br from-primary/10 to-accent/10 border-4 border-primary p-12 rounded-lg"
        style={{
          aspectRatio: "16/9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Certificate Header */}
        <div className="mb-8">
          <div className="text-primary font-bold text-4xl mb-2">Certificate of Achievement</div>
          <div className="h-1 w-24 bg-primary mx-auto" />
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          <p className="text-muted-foreground text-lg">This is to certify that</p>
          <p className="text-primary font-bold text-3xl">{studentName}</p>
          <p className="text-muted-foreground text-lg">has successfully completed the course</p>
          <p className="text-accent font-bold text-2xl">{courseName}</p>
          <p className="text-muted-foreground">with a grade of</p>
          <p className="text-secondary font-bold text-2xl">{grade}</p>
        </div>

        {/* Certificate Footer */}
        <div className="mt-8 w-full grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="h-12 mb-2" />
            <p className="text-xs text-muted-foreground font-medium">{instructorName}</p>
            <p className="text-xs text-muted-foreground">Instructor</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium">{issueDate}</p>
            <p className="text-xs text-muted-foreground">Date of Issue</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono break-all">{certificateId}</p>
            <p className="text-xs text-muted-foreground">Certificate ID</p>
          </div>
        </div>

        {/* Blockchain Info */}
        {blockchainHash && (
          <div className="mt-4 pt-4 border-t border-primary/30 w-full">
            <p className="text-xs text-muted-foreground">Blockchain Verified</p>
            <p className="text-xs font-mono text-muted-foreground break-all">{blockchainHash}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={downloadCertificate} className="flex-1 bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}
