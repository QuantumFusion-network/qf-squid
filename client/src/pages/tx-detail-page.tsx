import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Loader2, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { BrandLockup } from "@/components/brand-lockup"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DetailSummary } from "@/features/explorer/components/detail-summary"
import { FinalityCard } from "@/features/explorer/components/finality-card"
import { SearchForm } from "@/features/explorer/components/search-form"
import { StatePanel } from "@/features/explorer/components/state-panel"
import { TempTestPanel } from "@/features/explorer/components/temp-test-panel"
import { TransferList } from "@/features/explorer/components/transfer-list"
import { loadExplorerDetail } from "@/features/explorer/lib/api"
import { loadSecureFinality } from "@/features/explorer/lib/rpc"

export function TxDetailPage() {
  const { query = "" } = useParams()
  const decodedQuery = decodeURIComponent(query)
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState(decodedQuery)

  useEffect(() => {
    setSearchValue(decodedQuery)
  }, [decodedQuery])

  const detailQuery = useQuery({
    queryKey: ["explorer-detail", decodedQuery],
    queryFn: () => loadExplorerDetail(decodedQuery),
  })

  const finalityQuery = useQuery({
    queryKey: ["secure-finality", detailQuery.data?.extrinsic.hash],
    queryFn: () => loadSecureFinality(detailQuery.data!.extrinsic.blockNumber),
    enabled: !!detailQuery.data,
    retry: false,
  })

  function refreshFinality() {
    void queryClient.invalidateQueries({
      queryKey: ["secure-finality", detailQuery.data?.extrinsic.hash],
    })
  }

  return (
    <main className="app-shell gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BrandLockup compact />
          <Button asChild variant="ghost">
            <Link to="/">
              <ChevronLeft className="size-4" />
              Back
            </Link>
          </Button>
        </div>
        <SearchForm value={searchValue} onValueChange={setSearchValue} />
        <TempTestPanel onSelect={setSearchValue} />
      </div>

      {detailQuery.isLoading ? (
        <StatePanel
          title="Loading transfer"
          description="We are loading the latest transfer details."
        />
      ) : detailQuery.error ? (
        <StatePanel
          destructive
          title="Unable to load transfer details"
          description="We could not load this transfer right now. Please try again."
        />
      ) : !detailQuery.data ? (
        <StatePanel
          title="Transfer not found"
          description="No transfer details were found for this hash or ID."
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/3 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  Transfer details
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Transfer details
                </h1>
                <p className="hash-text font-mono text-xs text-muted-foreground sm:text-sm">
                  {decodedQuery}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{detailQuery.data.kind === "hash" ? "Hash lookup" : "ID lookup"}</Badge>
                <Badge variant={detailQuery.data.extrinsic.success ? "success" : "destructive"}>
                  {detailQuery.data.extrinsic.success ? "Success" : "Failed"}
                </Badge>
                <Badge>{detailQuery.data.transfers.length} transfer event(s)</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <DetailSummary detail={detailQuery.data} />
              <TransferList transfers={detailQuery.data.transfers} />
            </div>
            <div className="space-y-6">
              <FinalityCard
                isLoading={finalityQuery.isLoading || finalityQuery.isFetching}
                result={finalityQuery.error ? { state: "unavailable", blockNumber: detailQuery.data.extrinsic.blockNumber } : finalityQuery.data}
                onRefresh={refreshFinality}
              />
              <div className="rounded-xl border border-black/6 bg-white/65 p-5 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                  <Loader2 className="size-4" />
                  Search value
                </div>
                <p className="hash-text font-mono text-xs sm:text-sm">{decodedQuery}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
