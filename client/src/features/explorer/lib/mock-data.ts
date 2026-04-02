import { DEFAULT_CHAIN_PROPERTIES } from "@/features/explorer/lib/types"
import type { ChainProperties, ExplorerDetail, ExtrinsicSummary, TransferItem } from "@/features/explorer/lib/types"
import { detectSearchKind } from "@/features/explorer/lib/search"

const HASH_SECURE = "0x1111111111111111111111111111111111111111111111111111111111111111"
const HASH_FINALIZED = "0x2222222222222222222222222222222222222222222222222222222222222222"

const secureExtrinsic: ExtrinsicSummary = {
  id: "0048833571-94a1a-000001",
  hash: HASH_SECURE,
  blockHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  blockNumber: 120,
  index: 1,
  success: true,
  version: 4,
}

const finalizedExtrinsic: ExtrinsicSummary = {
  id: "0048833571-94a1a-000002",
  hash: HASH_FINALIZED,
  blockHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  blockNumber: 230,
  index: 2,
  success: true,
  version: 4,
}

function transfer(
  id: string,
  extrinsicHash: string,
  blockNumber: number,
  timestamp: string,
  amount: string,
  fee: string,
  from: string,
  to: string
): TransferItem {
  return {
    id,
    blockNumber,
    timestamp,
    extrinsicHash,
    amount,
    fee,
    from: { id: from },
    to: { id: to },
  }
}

const details: Record<string, ExplorerDetail> = {
  [HASH_SECURE]: {
    kind: "hash",
    query: HASH_SECURE,
    extrinsic: secureExtrinsic,
    transfers: [
      transfer(
        "0048833571-94a1a-000011",
        HASH_SECURE,
        120,
        "2026-03-26T10:15:00.000Z",
        "690000000000000000",
        "2227718881",
        "5Ew9dLGRMLr3J5icw9vSG64w62hdxcvrDAvjKqx9T1KG1uKc",
        "5DcouPSTvkgJiHGjTENcCDimNsRnu5vQuaGQNoArVuFoKM73"
      ),
      transfer(
        "0048833571-94a1a-000012",
        HASH_SECURE,
        120,
        "2026-03-26T10:15:00.000Z",
        "690000000000000",
        "2227718881",
        "5DcouPSTvkgJiHGjTENcCDimNsRnu5vQuaGQNoArVuFoKM73",
        "5C4hrfjw9DjXZTzV3MwzrrAr9PUr9y8SHgV3cmVGNUWRiJL5"
      ),
    ],
  },
  [HASH_FINALIZED]: {
    kind: "hash",
    query: HASH_FINALIZED,
    extrinsic: finalizedExtrinsic,
    transfers: [
      transfer(
        "0048833571-94a1a-000021",
        HASH_FINALIZED,
        230,
        "2026-03-26T10:20:00.000Z",
        "1000000000000000000",
        "1234000000",
        "5GnSxwsccY2YkqVKmf7Ma4nG5BodGexYQhkn5sH7r5fL8E1M",
        "5EYCAe5ijiZkYczJQ8rYg4Jx4CV2wAPYp8nH3UX77DpD6PEw"
      ),
    ],
  },
}

const ids: Record<string, string> = {
  [secureExtrinsic.id]: HASH_SECURE,
  [finalizedExtrinsic.id]: HASH_FINALIZED,
}

export async function loadMockExplorerDetail(query: string): Promise<ExplorerDetail | null> {
  const kind = detectSearchKind(query)

  if (kind === "hash") {
    const detail = details[query.trim()]
    return detail ? { ...detail, kind, query } : null
  }

  const hash = ids[query.trim()]
  if (!hash) return null

  const detail = details[hash]
  return detail ? { ...detail, kind, query } : null
}

export async function loadMockChainProperties(): Promise<ChainProperties> {
  return DEFAULT_CHAIN_PROPERTIES
}
