import { DEFAULT_CHAIN_PROPERTIES } from "@/features/explorer/lib/types"
import type { ChainProperties } from "@/features/explorer/lib/types"

function splitUnits(value: string, decimals = DEFAULT_CHAIN_PROPERTIES.tokenDecimals) {
  const amount = BigInt(value)
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const fraction = amount % divisor
  const paddedFraction = fraction.toString().padStart(decimals, "0")

  return {
    amount,
    whole: whole.toString(),
    paddedFraction,
    trimmedFraction: paddedFraction.replace(/0+$/, ""),
  }
}

function trimFraction(whole: string, fraction: string) {
  const trimmed = fraction.replace(/0+$/, "")
  return trimmed ? `${whole}.${trimmed}` : whole
}

function roundToFractionDigits(whole: string, fraction: string, fractionDigits: number) {
  if (fractionDigits <= 0) return whole

  if (fraction.length <= fractionDigits) {
    return trimFraction(whole, fraction)
  }

  const kept = fraction.slice(0, fractionDigits)
  const shouldRoundUp = Number(fraction[fractionDigits]) >= 5
  const totalLength = whole.length + fractionDigits
  const rounded = (
    BigInt(`${whole}${kept}`) + (shouldRoundUp ? 1n : 0n)
  )
    .toString()
    .padStart(totalLength, "0")

  const roundedWhole = rounded.slice(0, rounded.length - fractionDigits)
  const roundedFraction = rounded.slice(-fractionDigits)

  return trimFraction(roundedWhole, roundedFraction)
}

function formatAmountUnits(value: string, decimals = DEFAULT_CHAIN_PROPERTIES.tokenDecimals) {
  const { whole, trimmedFraction } = splitUnits(value, decimals)

  return trimmedFraction ? `${whole}.${trimmedFraction.slice(0, 6)}` : whole
}

function formatFeeUnits(value: string, decimals = DEFAULT_CHAIN_PROPERTIES.tokenDecimals) {
  const { amount, whole, paddedFraction, trimmedFraction } = splitUnits(value, decimals)

  if (amount === 0n) return "0"

  const thresholdFractionDigits = Math.min(decimals, 6)
  const thresholdUnits = 10n ** BigInt(Math.max(decimals - thresholdFractionDigits, 0))

  if (amount < thresholdUnits) {
    const thresholdLabel =
      thresholdFractionDigits === 0
        ? "1"
        : `0.${"0".repeat(thresholdFractionDigits - 1)}1`

    return `<${thresholdLabel}`
  }

  if (whole !== "0") {
    return roundToFractionDigits(whole, paddedFraction, 3)
  }

  const firstNonZeroIndex = trimmedFraction.search(/[1-9]/)

  if (firstNonZeroIndex === -1) return "0"

  return roundToFractionDigits(whole, paddedFraction, firstNonZeroIndex + 3)
}

export function formatAmount(value: string, chainProperties: ChainProperties = DEFAULT_CHAIN_PROPERTIES) {
  return `${formatAmountUnits(value, chainProperties.tokenDecimals)} ${chainProperties.tokenSymbol}`
}

export function formatFee(value: string, chainProperties: ChainProperties = DEFAULT_CHAIN_PROPERTIES) {
  return `${formatFeeUnits(value, chainProperties.tokenDecimals)} ${chainProperties.tokenSymbol}`
}

export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value))
}

export function formatHash(value: string) {
  if (value.length <= 18) return value
  return `${value.slice(0, 12)}…${value.slice(-8)}`
}
