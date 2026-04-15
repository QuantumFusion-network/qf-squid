import { appEnv } from "@/features/explorer/lib/env"
import { loadExplorerDetailByHash, loadExplorerDetailById } from "@/features/explorer/lib/graphql"
import { loadMockExplorerDetail } from "@/features/explorer/lib/mock-data"
import { detectSearchKind } from "@/features/explorer/lib/search"
import type { ExplorerDetail } from "@/features/explorer/lib/types"

export async function loadExplorerDetail(searchValue: string): Promise<ExplorerDetail | null> {
  const query = searchValue.trim()

  if (!query) {
    return null
  }

  if (appEnv.useMock) {
    return loadMockExplorerDetail(query)
  }

  const kind = detectSearchKind(query)
  return kind === "hash" ? loadExplorerDetailByHash(query) : loadExplorerDetailById(query)
}
