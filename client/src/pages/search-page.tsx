import { Compass, MoveRight, Network, ShieldCheck, Waves } from "lucide-react"
import { useState } from "react"

import { BrandLockup } from "@/components/brand-lockup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchForm } from "@/features/explorer/components/search-form"
import { TempTestPanel } from "@/features/explorer/components/temp-test-panel"

export function SearchPage() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <main className="app-shell">
      <div className="mb-8 flex items-center justify-between gap-4">
        <BrandLockup />
      </div>
      <div className="grid flex-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:pt-8">
        <section className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Compass className="size-3.5" />
            QF Network Explorer
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
              Look up transfer details by hash or ID.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Enter a transaction hash or internal ID to view transfer details and the latest
              confirmation status.
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm sm:p-5">
            <SearchForm value={searchValue} onValueChange={setSearchValue} />
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                Transfer-focused lookup
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Network className="size-3.5" />
                Live transfer and confirmation data
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Waves className="size-3.5" />
                Result and confirmations in one view
              </span>
            </div>
          </div>
          <TempTestPanel onSelect={setSearchValue} />

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-black/6 bg-white/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Step 1
              </div>
              <div className="font-medium">Enter a hash or ID</div>
            </div>
            <div className="rounded-xl border border-black/6 bg-white/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Step 2
              </div>
              <div className="font-medium">View transfer details</div>
            </div>
            <div className="rounded-xl border border-black/6 bg-white/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Step 3
              </div>
              <div className="font-medium">Check the latest confirmations</div>
            </div>
          </div>
        </section>

        <Card className="self-start">
          <CardHeader>
            <CardTitle>What you can check</CardTitle>
            <CardDescription>
              The details page combines indexed transfer data with the latest network confirmation
              status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-lg border border-black/6 bg-white/60 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Network className="size-4" />
                Transfer data
              </div>
              <p className="text-muted-foreground">
                View the transfer hash, block, status, addresses, amount, fee, and time.
              </p>
            </div>
            <div className="rounded-lg border border-black/6 bg-white/60 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Network className="size-4" />
                Confirmation data
              </div>
              <p className="text-muted-foreground">
                Check whether the transfer is still pending confirmations or already confirmed.
              </p>
            </div>
            <div className="rounded-lg border border-dashed border-black/10 bg-amber-50/60 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <MoveRight className="size-4" />
                Good to know
              </div>
              A transfer can already be successful while confirmations are still pending.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
