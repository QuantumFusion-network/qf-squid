import type { SecureFinalityResult } from "@/features/explorer/lib/types"

export function computeSecureFinality(
  blockNumber: number,
  secureUpTo?: number | null
): SecureFinalityResult {
  if (secureUpTo == null || Number.isNaN(secureUpTo)) {
    return {
      state: "unavailable",
      blockNumber,
    }
  }

  return {
    state: blockNumber <= secureUpTo ? "secure" : "pending",
    blockNumber,
    secureUpTo,
  }
}
