import { Compass, MoveRight, Network, ShieldCheck, Waves } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchForm } from "@/features/explorer/components/search-form"
import { appEnv } from "@/features/explorer/lib/env"

export function SearchPage() {
  return (
    <main className="app-shell">
      <div className="grid flex-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:pt-8">
        <section className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Compass className="size-3.5" />
            QF Transfer Explorer
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
              Search transfer transactions by extrinsic hash or id.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              This MVP is focused on MEXC transfer lookups. Enter an extrinsic hash or internal
              extrinsic id to load transfer details and current secure finality.
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm sm:p-5">
            <SearchForm />
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                Transfer-first explorer flow
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Network className="size-3.5" />
                GraphQL + RPC data merge
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Waves className="size-3.5" />
                Manual secure finality refresh
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-black/6 bg-white/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Step 1
              </div>
              <div className="font-medium">Paste hash or extrinsic id</div>
            </div>
            <div className="rounded-xl border border-black/6 bg-white/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Step 2
              </div>
              <div className="font-medium">Load transfer details from the indexer</div>
            </div>
            <div className="rounded-xl border border-black/6 bg-white/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Step 3
              </div>
              <div className="font-medium">Check secure finality from RPC</div>
            </div>
          </div>
        </section>

        <Card className="self-start">
          <CardHeader>
            <CardTitle>Data sources</CardTitle>
            <CardDescription>
              The detail page combines indexed transfer data with secure finality from RPC.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-lg border border-black/6 bg-white/60 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Network className="size-4" />
                GraphQL
              </div>
              <p className="text-muted-foreground hash-text">{appEnv.graphqlEndpoint}</p>
            </div>
            <div className="rounded-lg border border-black/6 bg-white/60 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Network className="size-4" />
                RPC
              </div>
              <p className="text-muted-foreground hash-text">{appEnv.rpcEndpoint}</p>
            </div>
            <div className="rounded-lg border border-dashed border-black/10 bg-amber-50/60 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <MoveRight className="size-4" />
                Runtime note
              </div>
              Secure finality is evaluated separately from transfer success. A transfer can already
              be successful while secure finality is still pending.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
