import type { SecureFinalityResult } from "@/features/explorer/lib/types"

export function computeSecureFinality(
  blockNumber: number,
  secureUpTo?: number | null,
  bestBlock?: number | null
): SecureFinalityResult {
  const confirmations =
    bestBlock == null || Number.isNaN(bestBlock) ? undefined : Math.max(bestBlock - blockNumber, 0)

  if (secureUpTo == null || Number.isNaN(secureUpTo)) {
    return {
      state: "unavailable",
      blockNumber,
      bestBlock: bestBlock ?? undefined,
      confirmations,
    }
  }

  return {
    state: blockNumber <= secureUpTo ? "confirmed" : "pending",
    blockNumber,
    secureUpTo,
    bestBlock: bestBlock ?? undefined,
    confirmations,
  }
}
