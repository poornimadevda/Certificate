"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { verifyCertificateOnBlockchain, getAllCertificatesFromBlockchain } from "@/lib/blockchain"

export function CertificateVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState<"id" | "hash">("id")

  const allCertificates = getAllCertificatesFromBlockchain()

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setTimeout(() => {
      let result = null

      if (searchType === "id") {
        // Search by Certificate ID
        const cert = allCertificates.find((c) => c.certificateId.toLowerCase().includes(searchQuery.toLowerCase()))
        if (cert) {
          const verification = verifyCertificateOnBlockchain(cert.certificateId, cert.hash)
          result = {
            ...verification,
            certificate: cert,
            foundType: "id",
          }
        }
      } else {
        // Search by Blockchain Hash
        const cert = allCertificates.find((c) => c.hash.startsWith(searchQuery))
        if (cert) {
          const verification = verifyCertificateOnBlockchain(cert.certificateId, cert.hash)
          result = {
            ...verification,
            certificate: cert,
            foundType: "hash",
          }
        }
      }

      if (!result) {
        result = {
          isValid: false,
          blockNumber: null,
          timestamp: null,
          message: "Certificate not found in blockchain",
          foundType: null,
        }
      }

      setVerificationResult(result)
      setIsSearching(false)
    }, 1000)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Certificate Verification</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify the authenticity of academic certificates using blockchain technology. Any credential can be verified
            independently by employers, institutions, or educational partners.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verify a Certificate</CardTitle>
            <CardDescription>Enter a certificate ID or blockchain hash to verify its authenticity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button variant={searchType === "id" ? "default" : "outline"} onClick={() => setSearchType("id")}>
                Search by ID
              </Button>
              <Button variant={searchType === "hash" ? "default" : "outline"} onClick={() => setSearchType("hash")}>
                Search by Hash
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder={
                  searchType === "id" ? "Enter Certificate ID (e.g., CERT-2024-001)" : "Enter Blockchain Hash"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                disabled={isSearching}
              />
              <Button onClick={handleSearch} disabled={isSearching} className="bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <div className="space-y-6">
            <div
              className={`p-8 rounded-lg border-2 ${
                verificationResult.isValid
                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
              }`}
            >
              <div className="flex items-start gap-4">
                {verificationResult.isValid ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      verificationResult.isValid
                        ? "text-green-800 dark:text-green-100"
                        : "text-red-800 dark:text-red-100"
                    }`}
                  >
                    {verificationResult.isValid ? "Certificate Verified" : "Certificate Invalid"}
                  </h2>
                  <p
                    className={
                      verificationResult.isValid
                        ? "text-green-700 dark:text-green-200"
                        : "text-red-700 dark:text-red-200"
                    }
                  >
                    {verificationResult.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            {verificationResult.isValid && verificationResult.certificate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certificate Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Certificate ID</p>
                      <p className="font-mono text-sm text-foreground break-all">
                        {verificationResult.certificate.certificateId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Issue Date</p>
                      <p className="text-sm text-foreground">{formatDate(verificationResult.certificate.timestamp)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Verification Status</p>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100">
                        Verified on Blockchain
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Blockchain Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Block Number</p>
                      <p className="text-sm font-mono text-foreground">#{verificationResult.blockNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Blockchain Hash</p>
                      <p className="text-xs font-mono text-foreground break-all">
                        {verificationResult.certificate.hash}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Verification Time</p>
                      <p className="text-sm text-foreground">{formatDate(verificationResult.certificate.timestamp)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How Certificate Verification Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Certificate Issued</h3>
                <p className="text-sm text-muted-foreground">
                  Student completes course and certificate is issued with a unique ID
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                  <span className="text-lg font-bold text-accent">2</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Blockchain Recording</h3>
                <p className="text-sm text-muted-foreground">
                  Certificate data is hashed and recorded on the blockchain immutably
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-4">
                  <span className="text-lg font-bold text-secondary">3</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Public Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Anyone can verify the certificate authenticity using this tool
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground mb-2">Why Blockchain Matters</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Immutable - Certificates cannot be altered or forged</li>
                    <li>Transparent - Verification is publicly available and independent</li>
                    <li>Secure - Cryptographic hashing ensures data integrity</li>
                    <li>Timestamped - Complete audit trail of when credentials were issued</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
