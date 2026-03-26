import { Compass, Network } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchForm } from "@/features/explorer/components/search-form"
import { appEnv } from "@/features/explorer/lib/env"

export function SearchPage() {
  return (
    <main className="app-shell">
      <div className="grid flex-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:pt-10">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Compass className="size-3.5" />
            QF Transfer Explorer
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Search transfer transactions by extrinsic hash or id.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              This MVP is focused on MEXC transfer lookups. Enter an extrinsic hash or internal
              extrinsic id to load transfer details and current secure finality.
            </p>
          </div>
          <SearchForm />
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
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
