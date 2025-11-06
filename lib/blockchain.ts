/**
 * Blockchain Module - Certificate Verification System
 * Simulates blockchain operations for certificate verification
 */

interface CertificateRecord {
  id: string
  studentName: string
  courseName: string
  grade: string
  issueDate: string
  instructorName: string
  hash?: string
  timestamp?: number
  blockNumber?: number
}

interface BlockchainTransaction {
  certificateId: string
  hash: string
  blockNumber: number
  timestamp: number
  verified: boolean
}

// Simulated blockchain ledger
const blockchainLedger: Map<string, BlockchainTransaction> = new Map()
let blockCounter = 1

/**
 * Generate a SHA256-like hash for the certificate
 */
export function generateCertificateHash(certificate: CertificateRecord): string {
  const data = `${certificate.studentName}${certificate.courseName}${certificate.grade}${certificate.issueDate}${certificate.instructorName}`

  // Simulate SHA256 hash (in production, use actual crypto library)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert to hex string
  const hexHash = Math.abs(hash).toString(16).padStart(64, "0")
  return hexHash
}

/**
 * Submit a certificate to the blockchain
 */
export function submitToCertificateBlockchain(certificate: CertificateRecord): BlockchainTransaction {
  const hash = generateCertificateHash(certificate)
  const timestamp = Date.now()

  const transaction: BlockchainTransaction = {
    certificateId: certificate.id,
    hash,
    blockNumber: blockCounter,
    timestamp,
    verified: true,
  }

  blockchainLedger.set(certificate.id, transaction)
  blockCounter++

  return transaction
}

/**
 * Verify a certificate on the blockchain
 */
export function verifyCertificateOnBlockchain(
  certificateId: string,
  expectedHash: string,
): {
  isValid: boolean
  blockNumber: number | null
  timestamp: number | null
  message: string
} {
  const transaction = blockchainLedger.get(certificateId)

  if (!transaction) {
    return {
      isValid: false,
      blockNumber: null,
      timestamp: null,
      message: "Certificate not found on blockchain",
    }
  }

  if (transaction.hash !== expectedHash) {
    return {
      isValid: false,
      blockNumber: transaction.blockNumber,
      timestamp: transaction.timestamp,
      message: "Certificate hash does not match - potential tampering detected",
    }
  }

  return {
    isValid: true,
    blockNumber: transaction.blockNumber,
    timestamp: transaction.timestamp,
    message: "Certificate verified successfully",
  }
}

/**
 * Get blockchain status and stats
 */
export function getBlockchainStats() {
  return {
    totalCertificates: blockchainLedger.size,
    totalBlocks: blockCounter - 1,
    lastBlockTime:
      blockchainLedger.size > 0 ? Array.from(blockchainLedger.values()).pop()?.timestamp || Date.now() : null,
  }
}

/**
 * Retrieve a certificate record from blockchain
 */
export function getCertificateFromBlockchain(certificateId: string) {
  return blockchainLedger.get(certificateId)
}

/**
 * Get all certificates (for admin view)
 */
export function getAllCertificatesFromBlockchain() {
  return Array.from(blockchainLedger.values())
}

/**
 * Simulate blockchain transaction confirmation
 */
export function confirmBlockchainTransaction(certificateId: string): boolean {
  const transaction = blockchainLedger.get(certificateId)
  if (!transaction) {
    return false
  }
  transaction.verified = true
  return true
}
