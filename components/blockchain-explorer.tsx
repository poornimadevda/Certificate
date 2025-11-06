"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CheckCircle2, XCircle, Copy } from "lucide-react"
import { verifyCertificateOnBlockchain, getBlockchainStats, getAllCertificatesFromBlockchain } from "@/lib/blockchain"

export function BlockchainExplorer() {
  const [searchHash, setSearchHash] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const stats = getBlockchainStats()
  const allCerts = getAllCertificatesFromBlockchain()

  const handleSearch = () => {
    if (!searchHash.trim()) return

    setIsSearching(true)
    // Simulate blockchain lookup delay
    setTimeout(() => {
      // Try to find a matching certificate
      const cert = allCerts.find((c) => c.hash.includes(searchHash) || c.certificateId.includes(searchHash))

      if (cert) {
        const result = verifyCertificateOnBlockchain(cert.certificateId, cert.hash)
        setVerificationResult({ ...result, certificate: cert })
      } else {
        setVerificationResult({
          isValid: false,
          blockNumber: null,
          timestamp: null,
          message: "No matching certificate found on blockchain",
        })
      }
      setIsSearching(false)
    }, 1000)
  }

  const copyToClipboard = (text: string, hash: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground mt-1">Verified on blockchain</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.totalBlocks}</div>
            <p className="text-xs text-muted-foreground mt-1">Chain length</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Block</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-secondary">
              {stats.lastBlockTime ? formatDate(stats.lastBlockTime) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Latest transaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verify">Verify Certificate</TabsTrigger>
          <TabsTrigger value="explorer">Blockchain Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>Search and verify certificates on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Certificate ID or Blockchain Hash..."
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  disabled={isSearching}
                />
                <Button onClick={handleSearch} disabled={isSearching} className="bg-primary hover:bg-primary/90">
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Verify"}
                </Button>
              </div>

              {/* Verification Result */}
              {verificationResult && (
                <div
                  className={`p-6 rounded-lg border-2 ${
                    verificationResult.isValid
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {verificationResult.isValid ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3
                        className={`font-bold text-lg ${
                          verificationResult.isValid
                            ? "text-green-800 dark:text-green-100"
                            : "text-red-800 dark:text-red-100"
                        }`}
                      >
                        {verificationResult.isValid ? "Valid Certificate" : "Verification Failed"}
                      </h3>
                      <p
                        className={
                          verificationResult.isValid
                            ? "text-green-700 dark:text-green-200"
                            : "text-red-700 dark:text-red-200"
                        }
                      >
                        {verificationResult.message}
                      </p>

                      {verificationResult.isValid && verificationResult.certificate && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div>
                            <p className="text-xs font-medium opacity-75">Block Information</p>
                            <p
                              className={
                                verificationResult.isValid
                                  ? "text-green-700 dark:text-green-200"
                                  : "text-red-700 dark:text-red-200"
                              }
                            >
                              Block #{verificationResult.blockNumber} • {formatDate(verificationResult.timestamp)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium opacity-75">Certificate ID</p>
                            <p
                              className={`font-mono text-xs ${
                                verificationResult.isValid
                                  ? "text-green-700 dark:text-green-200"
                                  : "text-red-700 dark:text-red-200"
                              }`}
                            >
                              {verificationResult.certificate.certificateId}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Info Section */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-medium text-foreground mb-3">How Blockchain Verification Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Certificates are hashed using SHA256 algorithm</li>
                    <li>Each certificate creates an immutable blockchain record</li>
                    <li>Any tampering is immediately detected through hash mismatch</li>
                    <li>Employers and institutions can verify authenticity independently</li>
                    <li>Certificate data is permanently recorded with timestamp</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explorer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Ledger</CardTitle>
              <CardDescription>View all verified certificates in the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allCerts.length > 0 ? (
                  allCerts.map((cert, index) => (
                    <div
                      key={cert.certificateId}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-primary/10">
                              Block #{cert.blockNumber}
                            </Badge>
                            {cert.verified && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="font-mono text-xs text-muted-foreground break-all">{cert.certificateId}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Hash: </span>
                          <span className="font-mono text-xs text-muted-foreground break-all">
                            {cert.hash.substring(0, 32)}...
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(cert.timestamp)}</p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(cert.hash, cert.certificateId)}
                        className="w-full"
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        {copiedHash === cert.certificateId ? "Copied!" : "Copy Hash"}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No certificates in blockchain yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
