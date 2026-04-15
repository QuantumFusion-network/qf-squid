import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTimestamp } from "@/features/explorer/lib/format"
import type { ExplorerDetail } from "@/features/explorer/lib/types"

interface DetailSummaryProps {
  detail: ExplorerDetail
}

function SummaryRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:items-start">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className={mono ? "hash-text font-mono text-sm" : "text-sm font-medium"}>{value}</div>
    </div>
  )
}

export function DetailSummary({ detail }: DetailSummaryProps) {
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
        </div>
        <SummaryRow label="Extrinsic ID" value={extrinsic.id} mono />
        <SummaryRow label="Transaction hash" value={extrinsic.hash} mono />
        <SummaryRow label="Block" value={String(extrinsic.blockNumber)} />
        <SummaryRow label="Block hash" value={extrinsic.blockHash} mono />
        <SummaryRow label="Position in block" value={String(extrinsic.index)} />
        <SummaryRow label="Version" value={String(extrinsic.version)} />
        <SummaryRow label="Time" value={formatTimestamp(detail.transfers[0].timestamp)} />
      </CardContent>
    </Card>
  )
}
