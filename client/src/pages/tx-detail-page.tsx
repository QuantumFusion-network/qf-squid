import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { DetailSummary } from "@/features/explorer/components/detail-summary"
import { FinalityCard } from "@/features/explorer/components/finality-card"
import { SearchForm } from "@/features/explorer/components/search-form"
import { StatePanel } from "@/features/explorer/components/state-panel"
import { TransferList } from "@/features/explorer/components/transfer-list"
import { loadExplorerDetail } from "@/features/explorer/lib/api"
import { loadSecureFinality } from "@/features/explorer/lib/rpc"

export function TxDetailPage() {
  const { query = "" } = useParams()
  const decodedQuery = decodeURIComponent(query)
  const queryClient = useQueryClient()

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
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="ghost">
            <Link to="/">
              <ChevronLeft className="size-4" />
              Back
            </Link>
          </Button>
        </div>
        <SearchForm defaultValue={decodedQuery} />
      </div>

      {detailQuery.isLoading ? (
        <StatePanel
          title="Loading transfer details"
          description="The explorer is fetching the transfer detail page."
        />
      ) : detailQuery.error ? (
        <StatePanel
          destructive
          title="Unable to load transfer"
          description="The GraphQL API request failed. Please try again."
        />
      ) : !detailQuery.data ? (
        <StatePanel
          title="Transfer not found"
          description="We could not find a transfer for this extrinsic hash or id."
        />
      ) : (
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
                Current query
              </div>
              <p className="hash-text font-mono text-xs sm:text-sm">{decodedQuery}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
