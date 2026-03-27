import { appEnv } from "@/features/explorer/lib/env"

function formatUnits(value: string, decimals = appEnv.tokenDecimals) {
  const amount = BigInt(value)
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const fraction = amount % divisor
  const trimmed = fraction.toString().padStart(decimals, "0").replace(/0+$/, "")

  return trimmed ? `${whole.toString()}.${trimmed.slice(0, 6)}` : whole.toString()
}

export function formatAmount(value: string) {
  return `${formatUnits(value)} ${appEnv.tokenSymbol}`
}

export function formatFee(value: string) {
  return `${formatUnits(value)} ${appEnv.tokenSymbol}`
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
