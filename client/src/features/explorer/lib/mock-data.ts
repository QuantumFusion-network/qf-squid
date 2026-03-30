import { DEFAULT_CHAIN_PROPERTIES } from "@/features/explorer/lib/types"
import type { ChainProperties, ExplorerDetail, ExtrinsicSummary, SecureFinalityResult, TransferItem } from "@/features/explorer/lib/types"
import { computeSecureFinality } from "@/features/explorer/lib/finality"
import { detectSearchKind } from "@/features/explorer/lib/search"

const HASH_FINALIZED = "0x1111111111111111111111111111111111111111111111111111111111111111"
const HASH_PENDING = "0x2222222222222222222222222222222222222222222222222222222222222222"
const HASH_UNAVAILABLE = "0x3333333333333333333333333333333333333333333333333333333333333333"

const finalizedExtrinsic: ExtrinsicSummary = {
  id: "0048833571-94a1a-000001",
  hash: HASH_FINALIZED,
  blockHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  blockNumber: 120,
  index: 1,
  success: true,
  version: 4,
}

const pendingExtrinsic: ExtrinsicSummary = {
  id: "0048833571-94a1a-000002",
  hash: HASH_PENDING,
  blockHash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  blockNumber: 250,
  index: 2,
  success: true,
  version: 4,
}

const unavailableExtrinsic: ExtrinsicSummary = {
  id: "0048833571-94a1a-000003",
  hash: HASH_UNAVAILABLE,
  blockHash: "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  blockNumber: 999,
  index: 3,
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
  [HASH_FINALIZED]: {
    kind: "hash",
    query: HASH_FINALIZED,
    extrinsic: finalizedExtrinsic,
    transfers: [
      transfer(
        "0048833571-94a1a-000011",
        HASH_FINALIZED,
        120,
        "2026-03-26T10:15:00.000Z",
        "690000000000000000",
        "2227718881",
        "5Ew9dLGRMLr3J5icw9vSG64w62hdxcvrDAvjKqx9T1KG1uKc",
        "5DcouPSTvkgJiHGjTENcCDimNsRnu5vQuaGQNoArVuFoKM73"
      ),
      transfer(
        "0048833571-94a1a-000012",
        HASH_FINALIZED,
        120,
        "2026-03-26T10:15:00.000Z",
        "690000000000000",
        "2227718881",
        "5DcouPSTvkgJiHGjTENcCDimNsRnu5vQuaGQNoArVuFoKM73",
        "5C4hrfjw9DjXZTzV3MwzrrAr9PUr9y8SHgV3cmVGNUWRiJL5"
      ),
    ],
  },
  [HASH_PENDING]: {
    kind: "hash",
    query: HASH_PENDING,
    extrinsic: pendingExtrinsic,
    transfers: [
      transfer(
        "0048833571-94a1a-000021",
        HASH_PENDING,
        250,
        "2026-03-26T10:20:00.000Z",
        "1000000000000000000",
        "1234000000",
        "5GnSxwsccY2YkqVKmf7Ma4nG5BodGexYQhkn5sH7r5fL8E1M",
        "5EYCAe5ijiZkYczJQ8rYg4Jx4CV2wAPYp8nH3UX77DpD6PEw"
      ),
    ],
  },
  [HASH_UNAVAILABLE]: {
    kind: "hash",
    query: HASH_UNAVAILABLE,
    extrinsic: unavailableExtrinsic,
    transfers: [
      transfer(
        "0048833571-94a1a-000031",
        HASH_UNAVAILABLE,
        999,
        "2026-03-26T10:30:00.000Z",
        "42000000000000000000",
        "1000000000",
        "5Cq6iAV8rVSu2Ce279b9EcRWWEDuJeiQMZT6ZX6hg2Pdh9vy",
        "5FHneW46xGXgs5mUiveU4sbTyGBzmto4VQK7x2m6d2vY5r2d"
      ),
    ],
  },
}

const ids: Record<string, string> = {
  [finalizedExtrinsic.id]: HASH_FINALIZED,
  [pendingExtrinsic.id]: HASH_PENDING,
  [unavailableExtrinsic.id]: HASH_UNAVAILABLE,
}

const finalityRequestCounts = new Map<number, number>()

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

export async function loadMockSecureFinality(blockNumber: number): Promise<SecureFinalityResult> {
  if (blockNumber === unavailableExtrinsic.blockNumber) {
    throw new Error("RPC unavailable")
  }

  const count = (finalityRequestCounts.get(blockNumber) || 0) + 1
  finalityRequestCounts.set(blockNumber, count)

  if (blockNumber === pendingExtrinsic.blockNumber && count > 1) {
    return computeSecureFinality(blockNumber, 300, 305)
  }

  if (blockNumber === pendingExtrinsic.blockNumber) {
    return computeSecureFinality(blockNumber, 200, 255)
  }

  return computeSecureFinality(blockNumber, 150, 180)
}

export async function loadMockChainProperties(): Promise<ChainProperties> {
  return DEFAULT_CHAIN_PROPERTIES
}
