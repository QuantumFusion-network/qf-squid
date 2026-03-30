import type { ReactNode } from "react"
import { CheckCircle2, Clock3, HelpCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTimestamp } from "@/features/explorer/lib/format"
import type { ExplorerDetail, SecureFinalityResult } from "@/features/explorer/lib/types"

interface DetailSummaryProps {
  detail: ExplorerDetail
  confirmation?: SecureFinalityResult
  isConfirmationLoading: boolean
}

function SummaryRow({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:items-start">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className={mono ? "hash-text font-mono text-sm" : "text-sm font-medium"}>{value}</div>
    </div>
  )
}

function renderConfirmationBadge(
  confirmation: SecureFinalityResult | undefined,
  isConfirmationLoading: boolean
) {
  if (isConfirmationLoading && !confirmation) {
    return (
      <Badge data-testid="confirmation-badge" variant="neutral">
        Checking confirmations
      </Badge>
    )
  }

  if (!confirmation || confirmation.state === "unavailable") {
    return (
      <Badge data-testid="confirmation-badge" variant="neutral">
        Confirmation unavailable
      </Badge>
    )
  }

  if (confirmation.state === "confirmed") {
    return (
      <Badge data-testid="confirmation-badge" variant="success">
        Confirmed
      </Badge>
    )
  }

  return (
    <Badge data-testid="confirmation-badge" variant="warning">
      Pending confirmations
    </Badge>
  )
}

function renderBlockValue(
  blockNumber: number,
  confirmation: SecureFinalityResult | undefined,
  isConfirmationLoading: boolean
) {
  if (isConfirmationLoading && !confirmation) {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>{blockNumber}</span>
        <span className="text-muted-foreground text-sm">Loading confirmations...</span>
      </div>
    )
  }

  if (confirmation?.confirmations != null) {
    const isConfirmed = confirmation.state === "confirmed"
    const Icon = confirmation.state === "pending" ? Clock3 : confirmation.state === "unavailable" ? HelpCircle : CheckCircle2
    const pillClassName = isConfirmed
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700"

    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>{blockNumber}</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${pillClassName}`}
          data-testid="confirmations-text"
        >
          <Icon className="size-3.5" />
          {confirmation.confirmations} confirmations
        </span>
      </div>
    )
  }

  return String(blockNumber)
}

export function DetailSummary({ detail, confirmation, isConfirmationLoading }: DetailSummaryProps) {
  const { extrinsic } = detail

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          Core details for the selected transfer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge data-testid="result-badge" variant={extrinsic.success ? "success" : "destructive"}>
            {extrinsic.success ? "Success" : "Failed"}
          </Badge>
          {renderConfirmationBadge(confirmation, isConfirmationLoading)}
          <Badge>{detail.kind === "hash" ? "Hash lookup" : "ID lookup"}</Badge>
        </div>
        <SummaryRow label="Internal ID" value={extrinsic.id} mono />
        <SummaryRow label="Transaction hash" value={extrinsic.hash} mono />
        <SummaryRow
          label="Block"
          value={renderBlockValue(extrinsic.blockNumber, confirmation, isConfirmationLoading)}
        />
        <SummaryRow label="Block hash" value={extrinsic.blockHash} mono />
        <SummaryRow label="Position in block" value={String(extrinsic.index)} />
        <SummaryRow label="Version" value={String(extrinsic.version)} />
        <SummaryRow label="Time" value={formatTimestamp(detail.transfers[0].timestamp)} />
      </CardContent>
    </Card>
  )
}
