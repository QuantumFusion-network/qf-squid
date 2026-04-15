import type { SearchKind } from "@/features/explorer/lib/types"

export function detectSearchKind(input: string): SearchKind {
  return input.trim().startsWith("0x") ? "hash" : "id"
}
