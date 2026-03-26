import { RefreshCw, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SecureFinalityResult } from "@/features/explorer/lib/types"

interface FinalityCardProps {
  isLoading: boolean
  result?: SecureFinalityResult
  onRefresh: () => void
}

function renderState(result?: SecureFinalityResult) {
  if (!result) {
    return {
      icon: ShieldQuestion,
      badge: <Badge data-testid="finality-badge">Loading</Badge>,
      text: "Finality is loading for this transfer.",
    }
  }

  if (result.state === "secure") {
    return {
      icon: ShieldCheck,
      badge: <Badge data-testid="finality-badge" variant="success">Securely finalized</Badge>,
      text: `This transfer block is at or below secureUpTo ${result.secureUpTo}.`,
    }
  }

  if (result.state === "pending") {
    return {
      icon: ShieldAlert,
      badge: <Badge data-testid="finality-badge" variant="warning">Pending secure finality</Badge>,
      text: `This transfer is above secureUpTo ${result.secureUpTo} and needs more time.`,
    }
  }

  return {
    icon: ShieldQuestion,
    badge: <Badge data-testid="finality-badge" variant="neutral">Unavailable</Badge>,
    text: "RPC finality data is temporarily unavailable.",
  }
}

export function FinalityCard({ isLoading, result, onRefresh }: FinalityCardProps) {
  const state = renderState(result)
  const Icon = state.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure finality</CardTitle>
        <CardDescription>
          Current finality state at the moment of loading or refresh.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Icon className="size-5 text-muted-foreground" />
          {state.badge}
        </div>
        <p className="text-muted-foreground text-sm">{state.text}</p>
        <Button
          aria-label="Refresh finality"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh finality
        </Button>
      </CardContent>
    </Card>
  )
}
