"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BlockchainExplorer } from "./blockchain-explorer"
import { Shield, Lock, CheckCircle2, BarChart3 } from "lucide-react"

export function BlockchainDashboard() {
  const features = [
    {
      icon: Shield,
      title: "Immutable Records",
      description: "Certificates are permanently stored and cannot be altered",
    },
    {
      icon: Lock,
      title: "Cryptographic Security",
      description: "SHA256 hashing ensures authenticity and integrity",
    },
    {
      icon: CheckCircle2,
      title: "Transparent Verification",
      description: "Anyone can verify certificate authenticity independently",
    },
    {
      icon: BarChart3,
      title: "Audit Trail",
      description: "Complete transaction history and timestamps for all certificates",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <Icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Blockchain Explorer */}
      <BlockchainExplorer />
    </div>
  )
}
