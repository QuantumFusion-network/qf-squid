import { DEFAULT_CHAIN_PROPERTIES } from "@/features/explorer/lib/types"
import type { ChainProperties } from "@/features/explorer/lib/types"

function formatUnits(value: string, decimals = DEFAULT_CHAIN_PROPERTIES.tokenDecimals) {
  const amount = BigInt(value)
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const fraction = amount % divisor
  const trimmed = fraction.toString().padStart(decimals, "0").replace(/0+$/, "")

  return trimmed ? `${whole.toString()}.${trimmed.slice(0, 6)}` : whole.toString()
}

export function formatAmount(value: string, chainProperties: ChainProperties = DEFAULT_CHAIN_PROPERTIES) {
  return `${formatUnits(value, chainProperties.tokenDecimals)} ${chainProperties.tokenSymbol}`
}

export function formatFee(value: string, chainProperties: ChainProperties = DEFAULT_CHAIN_PROPERTIES) {
  return `${formatUnits(value, chainProperties.tokenDecimals)} ${chainProperties.tokenSymbol}`
}

export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value))
}

export function formatHash(value: string) {
  if (value.length <= 18) return value
  return `${value.slice(0, 12)}…${value.slice(-8)}`
}
