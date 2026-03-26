import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatHash, formatTimestamp } from "@/features/explorer/lib/format"
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
        <CardTitle>Transaction summary</CardTitle>
        <CardDescription>
          Detail page for the selected transfer extrinsic.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={extrinsic.success ? "success" : "destructive"}>
            {extrinsic.success ? "Success" : "Failed"}
          </Badge>
          <Badge>{detail.kind === "hash" ? "Search by hash" : "Search by id"}</Badge>
        </div>
        <SummaryRow label="Extrinsic id" value={extrinsic.id} mono />
        <SummaryRow label="Extrinsic hash" value={extrinsic.hash} mono />
        <SummaryRow label="Block number" value={String(extrinsic.blockNumber)} />
        <SummaryRow label="Block hash" value={formatHash(extrinsic.blockHash)} mono />
        <SummaryRow label="Extrinsic index" value={String(extrinsic.index)} />
        <SummaryRow label="Version" value={String(extrinsic.version)} />
        <SummaryRow label="Timestamp" value={formatTimestamp(detail.transfers[0].timestamp)} />
      </CardContent>
    </Card>
  )
}
