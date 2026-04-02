import { FlaskConical } from "lucide-react"

import { Button } from "@/components/ui/button"

const TEST_QUERIES = [
  {
    label: "Live hash",
    hint: "Single transfer",
    value: "0xb05c639629be82e14c6e0391d96056da51bb1b590e600804f82f467c79fa46b1",
  },
  {
    label: "Live ID",
    hint: "Single transfer",
    value: "0049681936-89781-000001",
  },
  {
    label: "Multi-transfer hash",
    hint: "Two transfers",
    value: "0x08d5fa2a3ed9ce2428e75d1aabe30f51e94d5c5ff8a31c83fc25d49f00de481c",
  },
  {
    label: "Missing example",
    hint: "Not found state",
    value: "does-not-exist",
  },
] as const

interface TempTestPanelProps {
  onSelect: (value: string) => void
}

export function TempTestPanel({ onSelect }: TempTestPanelProps) {
  return (
    <div className="rounded-2xl border border-amber-300/80 bg-amber-50/80 p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <div>
          <div className="font-medium text-amber-900">Temporary QA block</div>
          <div className="text-sm text-amber-800/90">
            For internal testing only. Click any example to place it into the search field. This
            block will be removed before production.
          </div>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {TEST_QUERIES.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant="outline"
            className="h-auto min-w-0 justify-start whitespace-normal border-amber-200 bg-white/80 px-3 py-3 text-left hover:bg-amber-100/70"
            onClick={() => onSelect(item.value)}
          >
            <div className="min-w-0 w-full">
              <div className="text-xs uppercase tracking-[0.14em] text-amber-700">{item.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.hint}</div>
              <div className="hash-text mt-2 break-all font-mono text-xs text-foreground">
                {item.value}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
