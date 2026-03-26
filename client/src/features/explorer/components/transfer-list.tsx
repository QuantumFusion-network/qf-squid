import { ArrowRightLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAmount, formatFee, formatTimestamp } from "@/features/explorer/lib/format"
import type { TransferItem } from "@/features/explorer/lib/types"

interface TransferListProps {
  transfers: TransferItem[]
}

function TransferCard({ transfer }: { transfer: TransferItem }) {
  return (
    <div className="rounded-lg border border-black/6 bg-white/60 p-4" data-testid="transfer-card">
      <div className="mb-4 flex items-center gap-2">
        <ArrowRightLeft className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Transfer event</span>
      </div>
      <div className="grid gap-3 text-sm">
        <div>
          <div className="text-muted-foreground mb-1">From</div>
          <div className="hash-text font-mono text-xs sm:text-sm">{transfer.from.id}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">To</div>
          <div className="hash-text font-mono text-xs sm:text-sm">{transfer.to.id}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <div className="text-muted-foreground mb-1">Amount</div>
            <div className="font-medium">{formatAmount(transfer.amount)}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Fee</div>
            <div className="font-medium">{formatFee(transfer.fee)}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Timestamp</div>
            <div className="font-medium">{formatTimestamp(transfer.timestamp)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TransferList({ transfers }: TransferListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer details</CardTitle>
        <CardDescription>
          One extrinsic can emit one or multiple transfer events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {transfers.map((transfer) => (
          <TransferCard key={transfer.id} transfer={transfer} />
        ))}
      </CardContent>
    </Card>
  )
}
